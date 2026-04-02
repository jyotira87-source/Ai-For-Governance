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

      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white">Welcome, {user.full_name || user.username}!</h1>
          <p className="text-white/50 mt-2">Your Policy Analysis Dashboard</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card title="Policies Analyzed">
            <div className="text-4xl font-bold text-emerald-400">0</div>
            <p className="text-white/50 text-sm mt-2">Total analyses</p>
          </Card>
          <Card title="Saved Reports">
            <div className="text-4xl font-bold text-blue-400">0</div>
            <p className="text-white/50 text-sm mt-2">In your library</p>
          </Card>
          <Card title="Account Status">
            <div className="text-lg font-bold text-white/90">Active</div>
            <p className="text-white/50 text-sm mt-2">Since {new Date(user.created_at).toLocaleDateString()}</p>
          </Card>
        </div>

        {/* Main CTA */}
        <div className="glass rounded-3xl p-8 border border-white/10 text-center mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to analyze a policy?</h2>
          <p className="text-white/60 mb-6">Start analyzing policies with AI-powered constitutional compliance checking</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 rounded-xl bg-accent/20 border border-accent/30 text-accent hover:bg-accent/30 transition font-semibold"
          >
            Go to Analysis Engine
          </button>
        </div>

        {/* Quick Actions */}
        <QuickActions actions={dashboardActions} />

        {/* User Info */}
        <div className="mt-12 glass rounded-2xl p-6 border border-white/10">
          <h3 className="text-sm font-bold text-accent uppercase tracking-widest mb-4">Account Information</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-white/50">Email</p>
              <p className="text-white font-mono">{user.email}</p>
            </div>
            <div>
              <p className="text-white/50">Username</p>
              <p className="text-white font-mono">{user.username}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
