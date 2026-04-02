"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type AuthContextType = {
  token: string | null;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://ai-for-governance.onrender.com";

  // Load token from localStorage on mount
  useEffect(() => {
    const stored_token = localStorage.getItem("polisai:token");
    const stored_user = localStorage.getItem("polisai:user");
    if (stored_token && stored_user) {
      setToken(stored_token);
      setUser(JSON.parse(stored_user));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = `${API_URL}/auth/login`;
      console.log("Attempting login to:", apiUrl);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errText = await res.text();
        console.error("Login failed - Status:", res.status, "Response:", errText);
        let detail = "Login failed";
        try {
          const err = JSON.parse(errText);
          detail = err.detail || detail;
        } catch {}
        throw new Error(detail);
      }

      const data = await res.json();
      console.log("Login successful");
      setToken(data.access_token);
      localStorage.setItem("polisai:token", data.access_token);

      // Fetch user info
      try {
        const userRes = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${data.access_token}` },
          signal: controller.signal
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
          localStorage.setItem("polisai:user", JSON.stringify(userData));
        }
      } catch (e) {
        console.warn("Could not fetch user info:", e);
        setUser({ email });
      }
    } catch (e: any) {
      console.error("Auth error:", e.message);
      // Provide helpful error messages
      if (e.name === "AbortError") {
        setError("Request timeout - backend server may be down");
      } else if (e.message.includes("fetch")) {
        setError("NetworkError - Cannot connect to backend. Check your internet and backend status.");
      } else {
        setError(e.message);
      }
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, username: string, password: string, fullName?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = `${API_URL}/auth/register`;
      console.log("Attempting registration to:", apiUrl);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password, full_name: fullName }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errText = await res.text();
        console.error("Registration failed - Status:", res.status, "Response:", errText);
        let detail = "Registration failed";
        try {
          const err = JSON.parse(errText);
          detail = err.detail || detail;
        } catch {}
        throw new Error(detail);
      }

      console.log("Registration successful, attempting auto-login");
      // Auto-login after registration
      await login(email, password);
    } catch (e: any) {
      console.error("Auth error:", e.message);
      // Provide helpful error messages
      if (e.name === "AbortError") {
        setError("Request timeout - backend server may be down");
      } else if (e.message.includes("fetch")) {
        setError("NetworkError - Cannot connect to backend. Check your internet and backend status.");
      } else {
        setError(e.message);
      }
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("polisai:token");
    localStorage.removeItem("polisai:user");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
