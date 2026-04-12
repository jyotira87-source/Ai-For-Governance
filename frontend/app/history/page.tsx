"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { Spinner } from "@/components/Spinner";
import { Breadcrumb } from "@/components/Breadcrumb";
import { LoadingState } from "@/components/LoadingState";
import { QuickActions, historyActions } from "@/components/QuickActions";

interface AnalysisHistory {
  id: number;
  policy_title?: string;
  policy_text: string;
  governance_score: number;
  friction_score: number;
  cost_estimate: string;
  summary: string;
  created_at: string;
}

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<AnalysisHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/auth");
      return;
    }

    fetchHistory();
  }, [token, router]);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      // For now, we'll show a placeholder since we don't have the history API yet
      // This would normally fetch from /api/history or similar
      setAnalyses([
        {
          id: 1,
          policy_title: "Digital Privacy Act",
          policy_text: "A comprehensive policy for digital privacy protection...",
          governance_score: 8.5,
          friction_score: 3.2,
          cost_estimate: "₹ 2.5 crore",
          summary: "Strong governance framework with moderate implementation challenges",
          created_at: "2024-01-15T10:30:00Z"
        },
        {
          id: 2,
          policy_title: "Education Reform Initiative",
          policy_text: "Reforming the education system to improve quality...",
          governance_score: 7.8,
          friction_score: 4.1,
          cost_estimate: "₹ 15 crore",
          summary: "Good governance potential but significant implementation hurdles",
          created_at: "2024-01-14T15:45:00Z"
        }
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load history");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return <LoadingState message="Redirecting to login..." fullScreen />;
  }

  if (isLoading) {
    return <LoadingState message="Loading your analysis history..." fullScreen />;
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background">
      <div className="noise absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(225,6,0,0.12),transparent_55%),radial-gradient(900px_circle_at_80%_15%,rgba(255,255,255,0.06),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_35%),linear-gradient(135deg,#0A0A0A,#111111_55%,#0A0A0A)]" />

      <div className="mx-auto w-full max-w-6xl px-6 pb-20 pt-8 md:pt-10">
        <Breadcrumb />

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/40">Library</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">Analysis History</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/60">
            Review your past policy analyses and track your governance insights over time
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-accent/30 hover:bg-accent/10"
          >
            New Analysis
          </button>
        </div>

        {error && (
          <Card className="mb-8">
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
              <p className="text-red-300">{error}</p>
            </div>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <Card>
            <div className="text-center">
              <div className="text-3xl font-semibold text-emerald-400">{analyses.length}</div>
              <p className="mt-1 text-sm text-white/55">Total Analyses</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-semibold text-blue-400">
                {analyses.length > 0 ? (analyses.reduce((sum, a) => sum + a.governance_score, 0) / analyses.length).toFixed(1) : "0"}
              </div>
              <p className="mt-1 text-sm text-white/55">Avg Governance Score</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-semibold text-orange-400">
                {analyses.length > 0 ? (analyses.reduce((sum, a) => sum + a.friction_score, 0) / analyses.length).toFixed(1) : "0"}
              </div>
              <p className="mt-1 text-sm text-white/55">Avg Friction Score</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-semibold text-purple-400">
                {analyses.length > 0 ? new Set(analyses.map(a => new Date(a.created_at).toDateString())).size : "0"}
              </div>
              <p className="mt-1 text-sm text-white/55">Active Days</p>
            </div>
          </Card>
        </div>

        {/* History List */}
        {analyses.length === 0 ? (
          <Card>
            <div className="py-12 text-center">
              <div className="mb-4 text-6xl">📊</div>
              <h3 className="mb-2 text-xl font-semibold text-white">No Analysis History Yet</h3>
              <p className="mb-6 text-white/60">
                Start analyzing policies to build your governance insights history
              </p>
              <button
                onClick={() => router.push("/")}
                className="rounded-2xl border border-accent/30 bg-accent/15 px-6 py-3 font-semibold text-accent transition hover:bg-accent/25"
              >
                Start Analyzing
              </button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {analyses.map((analysis) => (
              <Card key={analysis.id} className="transition-all duration-300 hover:-translate-y-1">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="mb-1 text-xl font-semibold text-white">
                          {analysis.policy_title || "Untitled Policy"}
                        </h3>
                        <p className="text-sm text-white/55">
                          {new Date(analysis.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    <p className="mb-4 line-clamp-3 text-white/78">
                      {analysis.policy_text.length > 200
                        ? `${analysis.policy_text.substring(0, 200)}...`
                        : analysis.policy_text
                      }
                    </p>

                    <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-emerald-400">{analysis.governance_score}</div>
                        <div className="text-xs text-white/55">Governance</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-orange-400">{analysis.friction_score}</div>
                        <div className="text-xs text-white/55">Friction</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-400">{analysis.cost_estimate}</div>
                        <div className="text-xs text-white/55">Cost Estimate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-400">
                          {Math.round((analysis.governance_score / 10) * 100)}%
                        </div>
                        <div className="text-xs text-white/55">Success Rate</div>
                      </div>
                    </div>

                    <p className="text-sm leading-6 text-white/68">{analysis.summary}</p>
                  </div>

                  <div className="flex flex-col gap-3 lg:min-w-[220px]">
                    <button
                      onClick={() => router.push(`/analysis/${analysis.id}`)}
                      className="rounded-2xl border border-accent/30 bg-accent/15 px-4 py-3 text-sm font-semibold text-accent transition hover:bg-accent/25"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => router.push(`/sentiment?policy=${encodeURIComponent(analysis.policy_text)}`)}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      Sentiment Analysis
                    </button>
                    <button
                      onClick={() => {
                        // Copy to clipboard functionality would go here
                        navigator.clipboard.writeText(analysis.policy_text);
                      }}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      Copy Policy
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <QuickActions actions={historyActions} title="" />
        </Card>
      </div>
    </main>
  );
}