"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { SignupForm } from "@/components/SignupForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    if (token) {
      router.push("/dashboard");
    }
  }, [token, router]);

  if (!isMounted) return null;

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background">
      <div className="noise absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(225,6,0,0.12),transparent_55%),radial-gradient(900px_circle_at_80%_15%,rgba(255,255,255,0.06),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_35%),linear-gradient(135deg,#0A0A0A,#111111_55%,#0A0A0A)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(225,6,0,0.18),transparent_58%)] blur-3xl" />

      <div className="mx-auto grid min-h-screen w-full max-w-6xl gap-8 px-6 pb-16 pt-10 md:items-center md:pb-20 md:pt-14 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex flex-col justify-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/40">Secure Access</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-6xl">PolisAI</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/60 md:text-lg">
            Sign in to continue policy analysis, review saved work, and keep your governance intelligence workspace in sync.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:max-w-2xl">
            {["Encrypted", "Compliant", "Workspace-ready"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/70">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="glass relative overflow-hidden rounded-[1.75rem] border border-white/10 p-5 shadow-soft md:p-6">
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <div className="absolute -left-20 top-0 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -right-20 bottom-0 h-36 w-36 rounded-full bg-accent/12 blur-3xl" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          <div className="relative">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">
                  {isLogin ? "Access your dashboard" : "Start your workspace"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  {isLogin ? "Use your PolisAI credentials to pick up where you left off." : "Create a secure account for analysis history and dashboard access."}
                </p>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-2 rounded-2xl border border-white/10 bg-black/20 p-1">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  isLogin
                    ? "border border-accent/30 bg-accent/15 text-accent"
                    : "text-white/55 hover:bg-white/5 hover:text-white"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  !isLogin
                    ? "border border-accent/30 bg-accent/15 text-accent"
                    : "text-white/55 hover:bg-white/5 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>

            {isLogin ? <LoginForm /> : <SignupForm />}

            <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
              <span>{isLogin ? "New to PolisAI?" : "Already have an account?"}</span>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="rounded-xl border border-white/10 bg-black/20 px-4 py-2 font-semibold text-white transition hover:border-accent/30 hover:bg-accent/10 hover:text-accent"
              >
                {isLogin ? "Create an account" : "Login instead"}
              </button>
            </div>

            <p className="mt-5 text-center text-xs uppercase tracking-[0.2em] text-white/35">
              Enterprise Policy Intelligence
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
