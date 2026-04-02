"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { Spinner } from "@/components/Spinner";
import { SentimentDashboard } from "@/components/SentimentDashboard";
import { analyzeSentiment, SentimentResponse } from "@/lib/api";
import { Breadcrumb } from "@/components/Breadcrumb";
import { LoadingState } from "@/components/LoadingState";
import { QuickActions, sentimentActions } from "@/components/QuickActions";

export default function SentimentPage() {
  const [policy, setPolicy] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sentimentData, setSentimentData] = useState<SentimentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/auth");
    }
  }, [token, router]);

  if (!token) {
    return <LoadingState message="Redirecting to login..." fullScreen />;
  }

  const handleAnalyze = async () => {
    if (!policy.trim()) {
      setError("Please enter a policy to analyze");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setSentimentData(null);

    try {
      const result = await analyzeSentiment(policy);
      setSentimentData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background">
      <div className="noise absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(225,6,0,0.12),transparent_55%),radial-gradient(900px_circle_at_80%_15%,rgba(255,255,255,0.06),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_35%),linear-gradient(135deg,#0A0A0A,#111111_55%,#0A0A0A)]" />

      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <Breadcrumb />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Sentiment Analysis</h1>
          <p className="text-white/70 text-lg">
            Analyze public sentiment and social media reactions to your policy proposals
          </p>
        </div>

        {/* Input Section */}
        <div className="mb-8">
          <Card title="Policy Input">
            <div className="space-y-4">
            <textarea
              value={policy}
              onChange={(e) => setPolicy(e.target.value)}
              placeholder="Enter your policy proposal here..."
              className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
              disabled={isAnalyzing}
            />

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !policy.trim()}
              className="w-full sm:w-auto px-6 py-3 bg-accent hover:bg-accent/80 disabled:bg-white/20 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <Spinner />
                  <span>Analyzing Sentiment...</span>
                </>
              ) : (
                <>
                  <span>📊</span>
                  <span>Analyze Sentiment</span>
                </>
              )}
            </button>
            </div>
          </Card>
        </div>

        {/* Results Section */}
        {sentimentData && (
          <div className="space-y-6">
            <SentimentDashboard data={sentimentData} />

            {/* Quick Actions */}
            <Card title="Next Steps">
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => router.push("/")}
                  className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-200 text-left group"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">📋</span>
                    <span className="text-white font-semibold group-hover:text-accent transition">Policy Analysis</span>
                  </div>
                  <p className="text-white/60 text-sm">Get detailed governance insights</p>
                </button>

                <button
                  onClick={() => router.push("/dashboard")}
                  className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-200 text-left group"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">📊</span>
                    <span className="text-white font-semibold group-hover:text-accent transition">Dashboard</span>
                  </div>
                  <p className="text-white/60 text-sm">View your analysis history</p>
                </button>

                <button
                  onClick={() => {
                    setPolicy("");
                    setSentimentData(null);
                    setError(null);
                  }}
                  className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-200 text-left group"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">🔄</span>
                    <span className="text-white font-semibold group-hover:text-accent transition">New Analysis</span>
                  </div>
                  <p className="text-white/60 text-sm">Start fresh with a new policy</p>
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* Help Section */}
        {!sentimentData && !isAnalyzing && (
          <Card title="How Sentiment Analysis Works">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-semibold mb-3">What We Analyze</h3>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>• Public opinion trends</li>
                  <li>• Social media sentiment</li>
                  <li>• Key themes and concerns</li>
                  <li>• Platform distribution</li>
                  <li>• Language demographics</li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-3">Benefits</h3>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>• Understand public reception</li>
                  <li>• Identify potential opposition</li>
                  <li>• Measure policy acceptance</li>
                  <li>• Track sentiment over time</li>
                  <li>• Inform policy adjustments</li>
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <Card title="Next Steps">
          <QuickActions actions={sentimentActions} title="" />
        </Card>
      </div>
    </main>
  );
}