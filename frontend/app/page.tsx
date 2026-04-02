"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { Spinner } from "@/components/Spinner";
import { RiskChart } from "@/components/RiskChart";
import { PolicyFlow } from "@/components/PolicyFlow";
import { PolicyMap } from "@/components/PolicyMap";
import { ImpactMap } from "@/components/ImpactMap";
import { SentimentDashboard } from "@/components/SentimentDashboard";
import { QuickActions, mainPageActions } from "@/components/QuickActions";
import { analyzePolicy, analyzeSentiment } from "@/lib/api";

// Professional color scheme inspired by Ocean Health Index
const colors = {
  primary: "#1e40af", // Professional blue
  secondary: "#059669", // Professional green
  accent: "#dc2626", // Professional red
  neutral: "#6b7280", // Professional gray
  background: "#ffffff",
  surface: "#f8fafc",
  text: "#111827",
  textSecondary: "#6b7280"
};

// Professional typography scale
const typography = {
  h1: "text-4xl md:text-5xl font-bold tracking-tight text-gray-900",
  h2: "text-2xl md:text-3xl font-semibold tracking-tight text-gray-900",
  h3: "text-xl md:text-2xl font-semibold text-gray-900",
  h4: "text-lg md:text-xl font-medium text-gray-900",
  body: "text-base text-gray-700 leading-relaxed",
  caption: "text-sm text-gray-600",
  label: "text-xs font-medium text-gray-500 uppercase tracking-wider"
};

// Professional component styles
const styles = {
  card: "bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200",
  cardHeader: "px-6 py-4 border-b border-gray-100",
  cardBody: "px-6 py-4",
  button: {
    primary: "bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 shadow-sm",
    secondary: "bg-white hover:bg-gray-50 text-gray-900 font-medium px-6 py-3 rounded-lg border border-gray-300 transition-colors duration-200 shadow-sm",
    outline: "bg-transparent hover:bg-blue-50 text-blue-600 font-medium px-6 py-3 rounded-lg border border-blue-200 transition-colors duration-200"
  },
  input: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200",
  badge: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
};

// Status indicator component
function StatusIndicator({ status, label }: { status: 'success' | 'warning' | 'error' | 'info', label: string }) {
  const statusStyles = {
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200"
  };

  return (
    <span className={`${styles.badge} ${statusStyles[status]} border`}>
      {label}
    </span>
  );
}

// Metric card component
function MetricCard({ title, value, subtitle, trend, icon }: {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
}) {
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600"
  };

  return (
    <div className={`${styles.card} p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className="text-4xl text-gray-300">
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className={`mt-4 flex items-center text-sm ${trendColors[trend]}`}>
          {trend === 'up' && <span>↗️</span>}
          {trend === 'down' && <span>↘️</span>}
          {trend === 'neutral' && <span>→</span>}
          <span className="ml-1">Trend indicator</span>
        </div>
      )}
    </div>
  );
}

// Progress bar component
function ProgressBar({ value, max = 100, color = "blue", label }: {
  value: number;
  max?: number;
  color?: "blue" | "green" | "red" | "yellow";
  label?: string;
}) {
  const percentage = (value / max) * 100;
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500"
  };

  return (
    <div className="space-y-2">
      {label && <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">{value}/{max}</span>
      </div>}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${colorClasses[color]} h-2 rounded-full transition-all duration-1000`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Data visualization component
function DataVisualization({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Governance Score"
        value={data.governance_score?.toFixed(1) || "0.0"}
        subtitle="Overall policy quality"
        trend="up"
        icon="📊"
      />
      <MetricCard
        title="Implementation Risk"
        value={data.friction_score?.toFixed(1) || "0.0"}
        subtitle="Resistance level"
        trend="down"
        icon="⚠️"
      />
      <MetricCard
        title="Cost Estimate"
        value={data.cost_estimate || "₹0"}
        subtitle="Implementation cost"
        icon="💰"
      />
      <MetricCard
        title="Success Probability"
        value={`${Math.round((data.governance_score || 0) * 10)}%`}
        subtitle="Likelihood of success"
        trend="up"
        icon="🎯"
      />
    </div>
  );
}

export default function HomePage() {
  const [policy, setPolicy] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [v1Data, setV1Data] = useState<any>(null);
  const [showSentiment, setShowSentiment] = useState(false);
  const [sentimentData, setSentimentData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { token, user } = useAuth();
  const router = useRouter();

  const handleAnalyze = async () => {
    if (!policy.trim()) {
      setError("Please enter a policy to analyze");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setV1Data(null);
    setSentimentData(null);

    try {
      const result = await analyzePolicy(policy);
      setV1Data(result);

      // Auto-trigger sentiment analysis
      try {
        const sentimentResult = await analyzeSentiment(policy);
        setSentimentData(sentimentResult);
        setShowSentiment(true);
      } catch (sentimentErr) {
        console.warn("Sentiment analysis failed:", sentimentErr);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setPolicy("");
    setV1Data(null);
    setSentimentData(null);
    setShowSentiment(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className={typography.h1}>
              AI-Powered Governance Intelligence
            </h1>
            <p className={`${typography.body} mt-6 max-w-3xl mx-auto`}>
              Analyze policy proposals with advanced AI to ensure constitutional compliance,
              assess implementation feasibility, and predict public sentiment before deployment.
            </p>

            {user && (
              <p className="mt-4 text-sm text-gray-600">
                Welcome back, <span className="font-medium text-blue-600">{user.username}</span>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Analysis Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Input Panel */}
            <div className="lg:col-span-1">
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={typography.h4}>Policy Analysis</h3>
                  <p className={typography.caption}>Enter your policy proposal for comprehensive AI analysis</p>
                </div>

                <div className={styles.cardBody}>
                  <div className="space-y-4">
                    <div>
                      <label className={typography.label}>Policy Text</label>
                      <textarea
                        value={policy}
                        onChange={(e) => setPolicy(e.target.value)}
                        placeholder="Enter your policy proposal here..."
                        className={`${styles.input} mt-2 h-40 resize-none`}
                        disabled={isAnalyzing}
                      />
                    </div>

                    {error && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 text-sm">{error}</p>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !policy.trim()}
                        className={`${styles.button.primary} flex-1 ${
                          isAnalyzing || !policy.trim() ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isAnalyzing ? (
                          <>
                            <Spinner />
                            <span className="ml-2">Analyzing...</span>
                          </>
                        ) : (
                          "Analyze Policy"
                        )}
                      </button>

                      {v1Data && (
                        <button
                          onClick={handleReset}
                          className={styles.button.secondary}
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              {token && (
                <div className={`${styles.card} mt-6`}>
                  <div className={styles.cardHeader}>
                    <h4 className="text-lg font-medium text-gray-900">Quick Actions</h4>
                  </div>
                  <div className={styles.cardBody}>
                    <QuickActions actions={mainPageActions} title="" />
                  </div>
                </div>
              )}
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2">
              {v1Data ? (
                <div className="space-y-8">

                  {/* Key Metrics */}
                  <DataVisualization data={v1Data} />

                  {/* Detailed Analysis */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Governance Assessment */}
                    <div className={styles.card}>
                      <div className={styles.cardHeader}>
                        <h4 className={typography.h4}>Governance Assessment</h4>
                      </div>
                      <div className={styles.cardBody}>
                        <div className="space-y-4">
                          <ProgressBar
                            value={v1Data.governance_score || 0}
                            max={10}
                            color="blue"
                            label="Overall Governance Score"
                          />
                          <ProgressBar
                            value={10 - (v1Data.friction_score || 0)}
                            max={10}
                            color="green"
                            label="Implementation Feasibility"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Risk Analysis */}
                    <div className={styles.card}>
                      <div className={styles.cardHeader}>
                        <h4 className={typography.h4}>Risk Analysis</h4>
                      </div>
                      <div className={styles.cardBody}>
                        <RiskChart risks={v1Data?.risks || []} />
                      </div>
                    </div>

                    {/* Policy Flow */}
                    <div className={styles.card}>
                      <div className={styles.cardHeader}>
                        <h4 className={typography.h4}>Implementation Flow</h4>
                      </div>
                      <div className={styles.cardBody}>
                        <PolicyFlow />
                      </div>
                    </div>

                    {/* Impact Map */}
                    <div className={styles.card}>
                      <div className={styles.cardHeader}>
                        <h4 className={typography.h4}>Regional Impact</h4>
                      </div>
                      <div className={styles.cardBody}>
                        <ImpactMap impact={v1Data?.impact || []} simulation={v1Data?.simulation || []} />
                      </div>
                    </div>

                  </div>

                  {/* Sentiment Analysis */}
                  {showSentiment && sentimentData && (
                    <div className={styles.card}>
                      <div className={styles.cardHeader}>
                        <h4 className={typography.h4}>Public Sentiment Analysis</h4>
                      </div>
                      <div className={styles.cardBody}>
                        <SentimentDashboard data={sentimentData} />
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                /* Empty State */
                <div className={`${styles.card} flex items-center justify-center h-96`}>
                  <div className="text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Ready for Analysis
                    </h3>
                    <p className="text-gray-600 max-w-md">
                      Enter a policy proposal in the panel to the left to begin your comprehensive AI-powered governance analysis.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">PolisAI</h3>
            <p className="text-gray-600 text-sm">
              Enterprise Policy Intelligence Platform • AI-Powered Governance Analysis
            </p>
            <div className="mt-4 flex justify-center space-x-6 text-sm text-gray-500">
              <span>Built with Next.js & FastAPI</span>
              <span>•</span>
              <span>Powered by Groq AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}