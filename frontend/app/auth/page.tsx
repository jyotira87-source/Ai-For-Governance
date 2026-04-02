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
    <main className="relative isolate min-h-screen overflow-hidden bg-background flex items-center justify-center">
      <div className="noise absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(225,6,0,0.12),transparent_55%),radial-gradient(900px_circle_at_80%_15%,rgba(255,255,255,0.06),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_35%),linear-gradient(135deg,#0A0A0A,#111111_55%,#0A0A0A)]" />

      <div className="w-full max-w-md px-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">PolisAI</h1>
          <p className="text-white/50">{isLogin ? "Welcome back" : "Join the governance revolution"}</p>
        </div>

        <div className="glass rounded-3xl p-8 border border-white/10 backdrop-blur-[14px]">
          {isLogin ? <LoginForm /> : <SignupForm />}

          <div className="mt-6 text-center text-sm text-white/60">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-accent hover:text-white transition font-semibold"
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-white/40">
          <p>Enterprise Policy Intelligence Platform</p>
          <p className="mt-2">Secure • Encrypted • Compliant</p>
        </div>
      </div>
    </main>
  );
}
