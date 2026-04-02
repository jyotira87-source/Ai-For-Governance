"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export function SignupForm({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const { register, isLoading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    try {
      await register(email, username, password, fullName);
      if (onSuccess) onSuccess();
      router.push("/dashboard");
    } catch (e) {
      // Error is handled in context
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-white/10 bg-black/40 text-white placeholder-white/30 focus:border-white/30 focus:bg-black/50 outline-none transition"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg border border-white/10 bg-black/40 text-white placeholder-white/30 focus:border-white/30 focus:bg-black/50 outline-none transition"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg border border-white/10 bg-black/40 text-white placeholder-white/30 focus:border-white/30 focus:bg-black/50 outline-none transition"
          placeholder="username"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-white/10 bg-black/40 text-white placeholder-white/30 focus:border-white/30 focus:bg-black/50 outline-none transition"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/70"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">Confirm Password</label>
        <input
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg border border-white/10 bg-black/40 text-white placeholder-white/30 focus:border-white/30 focus:bg-black/50 outline-none transition"
          placeholder="••••••••"
        />
      </div>

      {(error || passwordError) && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error || passwordError}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 font-semibold hover:bg-blue-500/30 disabled:opacity-50 transition"
      >
        {isLoading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
}
