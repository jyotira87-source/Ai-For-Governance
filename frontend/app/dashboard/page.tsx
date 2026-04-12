"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { QuickActions, dashboardActions } from "@/components/QuickActions";

export default function DashboardPage() {
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/auth");
    }
  }, [token, router]);

  if (!token || !user) return null;

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background">
      <div className="noise absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(225,6,0,0.12),transparent_55%),radial-gradient(900px_circle_at_80%_15%,rgba(255,255,255,0.06),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_35%),linear-gradient(135deg,#0A0A0A,#111111_55%,#0A0A0A)]" />

      <div className="mx-auto w-full max-w-6xl px-6 pb-20 pt-10 md:pt-14">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/40">Overview</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">Welcome, {user.full_name || user.username}!</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/60">Your policy workspace now shows a cleaner snapshot of activity, saved work, and quick navigation.</p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-accent/30 hover:bg-accent/10 md:inline-flex"
          >
            New Analysis
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <Card title="Policies Analyzed">
            <div className="text-4xl font-semibold text-emerald-400">0</div>
            <p className="mt-2 text-sm text-white/55">Total analyses</p>
          </Card>
          <Card title="Saved Reports">
            <div className="text-4xl font-semibold text-blue-400">0</div>
            <p className="mt-2 text-sm text-white/55">In your library</p>
          </Card>
          <Card title="Account Status">
            <div className="text-lg font-semibold text-white/90">Active</div>
            <p className="mt-2 text-sm text-white/55">Since {new Date(user.created_at).toLocaleDateString()}</p>
          </Card>
        </div>

        {/* Main CTA */}
        <div className="glass rounded-[2rem] border border-white/10 p-8 text-center shadow-soft mb-12">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">Ready to analyze a policy?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/60">Start analyzing policies with AI-powered constitutional compliance checking, sentiment context, and predictive forecasts.</p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 rounded-2xl border border-accent/30 bg-accent/15 px-6 py-3 font-semibold text-accent transition hover:bg-accent/25"
          >
            Go to Analysis Engine
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <QuickActions actions={dashboardActions} title="Dashboard Shortcuts" />
        </div>

        {/* User Info */}
        <div className="glass mt-12 rounded-[1.75rem] border border-white/10 p-6">
          <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">Account Information</h3>
          <div className="grid gap-6 text-sm md:grid-cols-2">
            <div>
              <p className="text-white/45">Email</p>
              <p className="font-mono text-white">{user.email}</p>
            </div>
            <div>
              <p className="text-white/45">Username</p>
              <p className="font-mono text-white">{user.username}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
