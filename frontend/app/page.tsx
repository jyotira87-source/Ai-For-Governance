"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/Card";
import { Spinner } from "@/components/Spinner";
import { RiskChart } from "@/components/RiskChart";
import { PolicyFlow } from "@/components/PolicyFlow";
import { PolicyMap } from "@/components/PolicyMap";
import { analyzePolicy, type AnalyzeResponse } from "@/lib/api";

function Pill({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75 backdrop-blur-md">
      {children}
    </span>
  );
}

export default function HomePage() {
  const [policy, setPolicy] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [history, setHistory] = useState<
    { id: string; policy: string; createdAt: string; result: AnalyzeResponse }[]
  >([]);
  const [theme, setTheme] = useState<"carbon" | "crimson" | "midnight">("carbon");
  const reportRef = useRef<HTMLDivElement | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("polisai:history");
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        id: string;
        policy: string;
        createdAt: string;
        result: AnalyzeResponse;
      }[];
      setHistory(parsed);
    } catch {
      // ignore
    }
  }, []);

  // Load theme on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("polisai:theme");
    const nextTheme =
      stored === "crimson" || stored === "midnight" || stored === "carbon"
        ? stored
        : "carbon";
    setTheme(nextTheme);
    document.documentElement.classList.remove("theme-carbon", "theme-crimson", "theme-midnight");
    document.documentElement.classList.add(`theme-${nextTheme}`);
  }, []);

  const canAnalyze = useMemo(() => policy.trim().length >= 40, [policy]);

  async function onAnalyze() {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const data = await analyzePolicy(policy);
      setResult(data);
      if (typeof window !== "undefined") {
        const entry = {
          id: `${Date.now()}`,
          policy,
          createdAt: new Date().toISOString(),
          result: data
        };
        setHistory((prev) => {
          const next = [entry, ...prev].slice(0, 10);
          window.localStorage.setItem("polisai:history", JSON.stringify(next));
          return next;
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function onPrintReport() {
    if (!result) return;
    window.print();
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background">
      {/* Background */}
      <div className="noise absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(225,6,0,0.12),transparent_55%),radial-gradient(900px_circle_at_80%_15%,rgba(255,255,255,0.06),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_35%),linear-gradient(135deg,#0A0A0A,#111111_55%,#0A0A0A)]" />

      <div className="mx-auto flex w-full max-w-6xl flex-col px-6 pb-24 pt-16 md:pt-24 print-page print-bg-white">
        {/* Hero */}
        <section className="relative no-print">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <Pill>Governance</Pill>
            <Pill>Policy Intelligence</Pill>
            <Pill>Risk & Rights</Pill>
          </div>

          <h1 className="text-balance text-5xl font-semibold tracking-tight text-white md:text-7xl">
            PolisAI
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg text-white/70 md:text-xl">
            AI Governance Intelligence Platform
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/60">
            <span className="uppercase tracking-[0.18em] text-white/50">
              Theme
            </span>
            {[
              { id: "carbon", label: "Carbon" },
              { id: "crimson", label: "Crimson" },
              { id: "midnight", label: "Midnight" }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  const next = t.id as "carbon" | "crimson" | "midnight";
                  setTheme(next);
                  if (typeof window !== "undefined") {
                    window.localStorage.setItem("polisai:theme", next);
                  }
                  document.documentElement.classList.remove(
                    "theme-carbon",
                    "theme-crimson",
                    "theme-midnight"
                  );
                  document.documentElement.classList.add(`theme-${next}`);
                }}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${
                  theme === t.id
                    ? "border-white/70 bg-white/10 text-white"
                    : "border-white/10 bg-white/5 text-white/60 hover:border-white/30 hover:text-white"
                }`}
              >
                <span
                  className={`h-2 w-6 rounded-full ${
                    t.id === "carbon"
                      ? "bg-gradient-to-r from-white/40 to-white/10"
                      : t.id === "crimson"
                      ? "bg-gradient-to-r from-red-500 to-red-700"
                      : "bg-gradient-to-r from-indigo-400 to-purple-500"
                  }`}
                />
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-6">
            {/* Input */}
            <div className="glass relative overflow-hidden rounded-3xl p-5 shadow-soft backdrop-blur-[14px]">
              <div className="pointer-events-none absolute inset-0 opacity-50">
                <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl animate-float" />
              </div>

              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm font-semibold tracking-[0.18em] text-white/75 uppercase">
                    Paste a policy
                  </div>
                  <div className="text-xs text-white/50">
                    {policy.trim().length} chars
                  </div>
                </div>

                <textarea
                  value={policy}
                  onChange={(e) => setPolicy(e.target.value)}
                  placeholder="Example: This policy establishes a national digital ID system requiring biometric verification for access to public services, with data retained for 10 years..."
                  className="mt-3 h-44 w-full resize-none rounded-2xl border border-white/10 bg-black/40 p-4 text-[15px] leading-relaxed text-white/90 outline-none ring-0 placeholder:text-white/30 focus:border-white/20 focus:bg-black/50"
                />

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-white/60">
                    {canAnalyze
                      ? "Ready. Analyze for summary, risks, and constitutional touchpoints."
                      : "Tip: Add more detail (min ~40 characters) for best results."}
                  </div>

                  <button
                    onClick={onAnalyze}
                    disabled={!canAnalyze || loading}
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl px-6 py-3 text-sm font-semibold tracking-wide text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="absolute inset-0 bg-gradient-to-b from-accent/95 to-accent/70" />
                    <span className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                      <span className="absolute -left-1/2 top-0 h-full w-1/2 bg-white/25 blur-xl animate-shimmer" />
                    </span>
                    <span className="absolute inset-0 shadow-glow opacity-70 transition duration-300 group-hover:opacity-100" />
                    <span className="relative">
                      {loading ? "Analyzing…" : "Analyze Policy"}
                    </span>
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Pill>Glass UI</Pill>
                  <Pill>High contrast</Pill>
                  <Pill>Premium motion</Pill>
                </div>
              </div>
            </div>

            {/* Loading / Error */}
            <div className="min-h-[28px]">
              {loading ? (
                <div className="glass inline-flex rounded-2xl px-4 py-3 backdrop-blur-[14px]">
                  <Spinner />
                </div>
              ) : null}
              {error ? (
                <div className="glass rounded-2xl px-4 py-3 text-sm text-white/80">
                  <span className="font-semibold text-accent">Error:</span>{" "}
                  {error}
                </div>
              ) : null}
            </div>

            {history.length > 0 ? (
              <div className="glass mt-2 rounded-2xl p-4 text-xs text-white/70">
                <div className="mb-2 flex items-center justify-between">
                  <div className="uppercase tracking-[0.18em] text-white/60">
                    Recent analyses
                  </div>
                  <button
                    onClick={() => {
                      setHistory([]);
                      if (typeof window !== "undefined") {
                        window.localStorage.removeItem("polisai:history");
                      }
                    }}
                    className="text-[10px] text-white/40 hover:text-white/70"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setPolicy(item.policy);
                        setResult(item.result);
                        setError(null);
                      }}
                      className="min-w-[180px] rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-left hover:border-white/25"
                    >
                      <div className="text-[10px] uppercase tracking-[0.18em] text-white/50">
                        Loaded
                      </div>
                      <div className="line-clamp-2 text-[11px] text-white/80">
                        {item.policy}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {/* Results */}
        <section
          className={`mt-10 grid gap-6 transition-all duration-500 ${
            result ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          {result ? (
            <div ref={reportRef} className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-3 flex items-center justify-between no-print">
                <div className="text-xs uppercase tracking-[0.18em] text-white/60">
                  Analysis report
                </div>
                <button
                  onClick={onPrintReport}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur-md transition hover:border-white/30 hover:bg-white/10"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>Download report (PDF)</span>
                </button>
              </div>
              <div className="md:col-span-2">
                <Card title="Policy Summary">
                  <p className="whitespace-pre-wrap">{result.summary}</p>
                </Card>
              </div>
              <div className="md:col-span-1 space-y-4">
                <Card title="Governance Score">
                  <div className="flex items-baseline gap-3">
                    <div className="text-4xl font-semibold text-white">
                      {result.score.toFixed(1)}
                    </div>
                    <div className="space-y-1 text-xs text-white/60">
                      <div className="uppercase tracking-[0.18em] text-white/70">
                        Composite score
                      </div>
                      <div>Lower scores indicate higher structural and rights risks.</div>
                    </div>
                  </div>
                </Card>
                <Card title="Risk Analysis">
                  <ul className="space-y-2">
                    {result.risks.map((r, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-accent/90" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
              <div className="md:col-span-2">
                <Card title="Risk Distribution">
                  <RiskChart risks={result.risks} />
                </Card>
              </div>
              <div className="md:col-span-1">
                <Card title="Policy Map">
                  <PolicyMap />
                </Card>
              </div>
              <div className="md:col-span-2">
                <Card title="Future Impact">
                  <ul className="space-y-2">
                    {result.impact.map((item, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-white/70" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
              <div className="md:col-span-1">
                <Card title="Simulation Scenarios">
                  <ul className="space-y-2 text-xs md:text-[13px]">
                    {result.simulation.map((item, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-accent/80" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
              <div className="md:col-span-2">
                <Card title="Constitutional References">
                  <div className="flex flex-wrap gap-2">
                    {result.references.map((ref, idx) => (
                      <span
                        key={idx}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/75 backdrop-blur-md"
                      >
                        {ref}
                      </span>
                    ))}
                  </div>
                </Card>
              </div>
              <div className="md:col-span-1">
                <Card title="Recommendations & Flow">
                  <div className="space-y-4">
                    <ul className="space-y-2 text-xs md:text-[13px]">
                      {result.recommendations.map((item, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-white/70" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-2">
                      <PolicyFlow />
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ) : null}
        </section>

        <footer className="mt-16 flex flex-col gap-2 text-xs text-white/40">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div>
            PolisAI — premium governance intelligence. Backend: FastAPI. AI: HuggingFace
            Transformers.
          </div>
        </footer>
      </div>
    </main>
  );
}

