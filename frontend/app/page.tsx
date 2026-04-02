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
import { analyzePolicy, analyzeSentiment, SentimentResponse } from "@/lib/api";
import { SentimentDashboard } from "@/components/SentimentDashboard"; 

// --- 1. PILL COMPONENT ---
function Pill({ children, color = "accent" }: { children: string; color?: "accent" | "red" | "purple" }) {
  const colors = {
    accent: "border-white/10 bg-white/5 text-white/75",
    red: "border-red-500/30 bg-red-500/10 text-red-300",
    purple: "border-purple-500/30 bg-purple-500/10 text-purple-300"
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs tracking-widest uppercase backdrop-blur-md ${colors[color]}`}>
      {children}
    </span>
  );
}

// --- 2. BIAS MATRIX COMPONENT ---
function BiasMatrix({ data }: { data: any }) {
  if (!data) return <div className="text-white/50 text-sm">Awaiting simulation data...</div>;
  const metrics = [
    { group: "Urban / Tech-Savvy", impact: data.urban_tech || 0, color: "bg-blue-500" },
    { group: "Rural / Unconnected", impact: data.rural_unconnected || 0, color: "bg-red-500" },
    { group: "Corporate Sector", impact: data.corporate || 0, color: "bg-emerald-500" },
    { group: "Vulnerable Demographics", impact: data.vulnerable || 0, color: "bg-orange-500" }
  ];

  return (
    <div className="space-y-4">
      {metrics.map((m, i) => (
        <div key={i} className="space-y-1.5">
          <div className="flex justify-between text-xs text-white/80 font-medium tracking-wide">
            <span>{m.group}</span>
            <span className={m.impact < 50 ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>{m.impact} / 100</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div className={`h-full ${m.color} transition-all duration-1000 shadow-[0_0_10px_currentColor]`} style={{ width: `${m.impact}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// --- 3. NEW: PUBLIC SENTIMENT GAUGE ---
function SentimentVisualizer({ score }: { score: number }) {
  // Simulate sentiment based on the AI's governance score
  const approval = Math.max(15, Math.min(85, score)); 
  const outrage = 100 - approval;

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-end">
        <div className="text-emerald-400">
          <span className="text-2xl font-black">{approval.toFixed(1)}%</span>
          <span className="text-[10px] uppercase tracking-widest block text-emerald-500/70">Est. Approval</span>
        </div>
        <div className="text-red-400 text-right">
          <span className="text-2xl font-black">{outrage.toFixed(1)}%</span>
          <span className="text-[10px] uppercase tracking-widest block text-red-500/70">Est. Pushback</span>
        </div>
      </div>
      <div className="h-3 w-full flex rounded-full overflow-hidden border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <div className="bg-emerald-500 transition-all duration-1000" style={{ width: `${approval}%` }}></div>
        <div className="bg-red-500 transition-all duration-1000" style={{ width: `${outrage}%` }}></div>
      </div>
    </div>
  );
}

// --- 4. NEW: REGIONAL READINESS HEATMAP ---
function ReadinessHeatmap({ friction }: { friction: number }) {
  const regions = [
    { name: "North India", status: friction < 50 ? "Ready" : "High Friction", color: friction < 50 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" : "text-orange-400 bg-orange-500/10 border-orange-500/30" },
    { name: "South India", status: friction < 60 ? "Ready" : "Moderate", color: friction < 60 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" : "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
    { name: "Northeast", status: friction < 40 ? "Ready" : "Critical Deficit", color: friction < 40 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" : "text-red-400 bg-red-500/10 border-red-500/30" },
    { name: "West & Central", status: friction < 70 ? "Ready" : "Moderate", color: friction < 70 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" : "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {regions.map((r, i) => (
        <div key={i} className={`p-3 rounded-xl border ${r.color} flex flex-col justify-center items-center text-center transition-all hover:scale-[1.02]`}>
          <span className="text-xs font-bold text-white/90">{r.name}</span>
          <span className="text-[10px] font-mono tracking-widest uppercase mt-1 opacity-80">{r.status}</span>
        </div>
      ))}
    </div>
  );
}

// --- 5. NEW: IMPLEMENTATION TIMELINE INFOGRAPHIC ---
function ImplementationTimeline() {
  return (
    <div className="w-full flex flex-col md:flex-row gap-4 relative">
      <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 -translate-y-1/2 opacity-30 z-0"></div>
      
      {[
        { phase: "Phase 1: Legal Framing", desc: "Drafting ordinances & SC compliance.", time: "0-6 Months", color: "border-blue-500", glow: "shadow-[0_0_15px_rgba(59,130,246,0.2)]" },
        { phase: "Phase 2: Tech Infrastructure", desc: "Deploying API endpoints & security vaults.", time: "6-18 Months", color: "border-purple-500", glow: "shadow-[0_0_15px_rgba(168,85,247,0.2)]" },
        { phase: "Phase 3: National Rollout", desc: "Phased demographic deployment.", time: "18-36 Months", color: "border-red-500", glow: "shadow-[0_0_15px_rgba(239,68,68,0.2)]" }
      ].map((step, i) => (
        <div key={i} className={`flex-1 bg-black/60 border border-white/5 p-5 rounded-2xl z-10 border-t-2 ${step.color} ${step.glow}`}>
          <div className="text-[10px] text-white/50 tracking-widest uppercase font-mono mb-2">{step.time}</div>
          <h4 className="text-sm font-bold text-white/90 mb-1">{step.phase}</h4>
          <p className="text-xs text-white/60">{step.desc}</p>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [policy, setPolicy] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token, user, logout } = useAuth();
  const router = useRouter();
  
  // A/B State & X-Ray
  const [v1Data, setV1Data] = useState<any>(null);
  const [v2Data, setV2Data] = useState<any>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [activeQuote, setActiveQuote] = useState<string | null>(null);
  const [theme, setTheme] = useState<"carbon" | "crimson" | "midnight">("carbon");
  const [sentimentData, setSentimentData] = useState<SentimentResponse | null>(null);
  const [showSentiment, setShowSentiment] = useState(false);
  const reportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
    // Redirect to auth if not logged in
    if (!token) {
      router.push("/auth");
    }
    const stored = window.localStorage.getItem("polisai:theme");
    const nextTheme = stored === "crimson" || stored === "midnight" || stored === "carbon" ? stored : "carbon";
    setTheme(nextTheme);
    document.documentElement.classList.remove("theme-carbon", "theme-crimson", "theme-midnight");
    document.documentElement.classList.add(`theme-${nextTheme}`);
  }, [token, router]);

  const canAnalyze = useMemo(() => policy.trim().length >= 40, [policy]);

  async function onAnalyze() {
    if (!canAnalyze) return;
    setError(null);
    setLoading(true);
    setActiveQuote(null);
    try {
      const data = await analyzePolicy(policy);
      if (!v1Data) {
        setV1Data({ text: policy, result: data });
        // Fetch sentiment data for new analysis
        try {
          const sentiment = await analyzeSentiment(policy);
          setSentimentData(sentiment);
        } catch (e) {
          console.warn("Sentiment analysis failed:", e);
          setSentimentData(null);
        }
      } else {
        setV2Data({ text: policy, result: data });
        setIsComparing(true);
      }
      setPolicy("");
    } catch (e: any) { setError(e.message || "API Error"); } finally { setLoading(false); }
  }

 // --- UPGRADED GOV MEMO EXPORTER (Mac-Safe HTML) ---
 function exportToGovMemo(data: any) {
  const memoContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset='utf-8'>
      <title>Official Government Memorandum</title>
      <style>
        body { 
          font-family: 'Times New Roman', serif; 
          max-width: 800px; 
          margin: 40px auto; 
          padding: 50px; 
          background: white; 
          color: black; 
          line-height: 1.6;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px; 
          border-bottom: 2px solid #000; 
          padding-bottom: 20px; 
        }
        .header h1 { font-size: 28px; text-transform: uppercase; margin: 0; letter-spacing: 2px; }
        .header h2 { font-size: 16px; font-weight: normal; color: #444; margin: 10px 0; }
        h3 { color: #111; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 30px; }
        .risk-box { 
          background: #fff5f5; 
          border-left: 4px solid #dc2626; 
          padding: 12px; 
          margin-bottom: 15px; 
        }
        .footer { 
          text-align: center; 
          font-size: 11px; 
          color: #666; 
          margin-top: 50px; 
          border-top: 1px solid #ccc; 
          padding-top: 15px; 
          text-transform: uppercase;
          letter-spacing: 1px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Government of India</h1>
        <h2>PolisAI Risk Assessment Memorandum</h2>
        <p style="font-size: 12px;"><strong>Date:</strong> ${new Date().toLocaleDateString()} | <strong>Ref:</strong> POLIS-${Date.now().toString().slice(-6)}</p>
      </div>
      
      <h3>1. Executive Summary</h3>
      <p>${data.summary}</p>
      
      <h3>2. Scores & Logistics</h3>
      <ul>
        <li><strong>Constitutional Compliance Score:</strong> ${data.score} / 100</li>
        <li><strong>Logistical Friction Score:</strong> ${data.friction_score} / 100</li>
        <li><strong>Estimated Rollout Cost:</strong> ${data.cost_estimate}</li>
      </ul>
      
      <h3>3. Identified Legal Risks</h3>
      <div>
        ${data.risks?.map((r: any) => `
          <div class="risk-box">
            <strong>Threat:</strong> ${r.risk_summary || r} <br/>
            <span style="color: #666; font-size: 14px;"><i>Triggered by text: "${r.exact_quote || "N/A"}"</i></span>
          </div>
        `).join('') || "<p>No significant risks identified.</p>"}
      </div>
      
      <div class="footer">Confidential • Generated securely by PolisAI GovTech Engine</div>
    </body>
    </html>
  `;
  const blob = new Blob([memoContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); 
  link.href = url; 
  link.download = `Gov_Memo_POLIS_${Date.now()}.html`;
  document.body.appendChild(link); 
  link.click(); 
  document.body.removeChild(link);
}

  function renderHighlightedText(text: string) {
    if (!activeQuote || activeQuote === "N/A") return text;
    const parts = text.split(new RegExp(`(${activeQuote})`, 'gi'));
    return parts.map((part, i) => part.toLowerCase() === activeQuote.toLowerCase() 
        ? <mark key={i} className="bg-red-500 text-white px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse">{part}</mark> : part);
  }

  function handleReset() { setV1Data(null); setV2Data(null); setIsComparing(false); setPolicy(""); setSentimentData(null); setShowSentiment(false); }

  if (!isMounted) return null;
  const currentViewData = isComparing ? v2Data : v1Data;
  const result = currentViewData?.result;

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background">
      <div className="noise absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(225,6,0,0.12),transparent_55%),radial-gradient(900px_circle_at_80%_15%,rgba(255,255,255,0.06),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_35%),linear-gradient(135deg,#0A0A0A,#111111_55%,#0A0A0A)]" />

      <div className="mx-auto flex w-full max-w-6xl flex-col px-6 pb-24 pt-16 md:pt-24 print-page print-bg-white">
        
        {/* HERO SECTION */}
        <section className="relative no-print">
          <div className="flex justify-between items-start mb-8">
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <Pill color="accent">GovTech v4</Pill>
              <Pill color="purple">X-Ray Analysis</Pill>
              <Pill color="red">A/B Diff Engine</Pill>
            </div>
            <button
              onClick={() => {
                logout();
                router.push("/auth");
              }}
              className="text-xs text-white/40 hover:text-red-400 border border-white/10 px-3 py-1 rounded-full backdrop-blur-md transition"
            >
              Logout
            </button>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-balance text-5xl font-semibold tracking-tight text-white md:text-7xl">PolisAI</h1>
              <p className="mt-4 max-w-2xl text-pretty text-lg text-white/70 md:text-xl">Enterprise Policy Draft & Simulation Engine</p>
              {user && <p className="mt-2 text-sm text-white/50">Logged in as <span className="text-accent">{user.username}</span></p>}
            </div>
            {v1Data && <button onClick={handleReset} className="text-xs text-white/40 hover:text-red-400 border border-white/10 px-3 py-1 rounded-full backdrop-blur-md">Reset Workspace</button>}
          </div>

          {/* INPUT SECTION */}
          {!isComparing && (
            <div className="mt-10 grid gap-6">
              <div className="glass relative overflow-hidden rounded-3xl p-5 shadow-soft backdrop-blur-[14px]">
                <div className="relative">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-sm font-semibold tracking-[0.18em] text-white/75 uppercase">
                      {v1Data ? "Step 2: Initialize Draft V2 (Refinement)" : "Step 1: Paste Policy Draft"}
                    </div>
                  </div>
                  <textarea
                    value={policy} onChange={(e) => setPolicy(e.target.value)}
                    placeholder={v1Data ? "Paste revised policy..." : "Enter policy..."}
                    className="mt-3 h-44 w-full resize-none rounded-2xl border border-white/10 bg-black/40 p-4 text-[15px] leading-relaxed text-white/90 outline-none ring-0 placeholder:text-white/30 focus:border-white/20 focus:bg-black/50"
                  />
                  <div className="mt-4 flex justify-between items-center">
                    <button onClick={onAnalyze} disabled={!canAnalyze || loading} className="group relative overflow-hidden rounded-2xl px-6 py-3 text-sm font-semibold text-white transition disabled:opacity-50 border border-white/10 bg-white/5 hover:bg-white/10">
                      {loading ? "Simulating Constraints…" : v1Data ? "Compare with V1" : "Analyze Draft V1"}
                    </button>
                  </div>
                </div>
              </div>
              {error && <div className="glass rounded-2xl px-4 py-3 text-sm text-white/80"><span className="font-semibold text-red-400">Error:</span> {error}</div>}
            </div>
          )}
        </section>

        {/* --- ULTIMATE RESULTS DASHBOARD --- */}
        <section className={`mt-10 grid gap-6 transition-all duration-500 ${result ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}>
          {result && (
            <div ref={reportRef} className="grid gap-6 md:grid-cols-3">
              
              {/* Toolbar */}
              <div className="md:col-span-3 flex justify-between bg-black/40 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
                <div className="flex gap-4 items-center">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/60 ml-2">{isComparing ? "A/B Comparison View" : "Analysis Report"}</div>
                  {isComparing && <button onClick={() => setIsComparing(false)} className="text-xs font-bold text-accent hover:text-white bg-accent/10 px-3 py-1.5 rounded-full">← View Draft V1</button>}
                </div>
                <div className="flex gap-3 items-center">
                  {isComparing && (
                    <div className="text-xs font-bold px-4 py-2 rounded-xl bg-black/50 border border-white/5">
                      <span className="text-white/50 uppercase tracking-widest mr-2">Score Diff:</span>
                      <span className={v2Data.result.score > v1Data.result.score ? "text-emerald-400" : "text-red-400"}>
                        {v2Data.result.score > v1Data.result.score ? "+" : ""}{(v2Data.result.score - v1Data.result.score).toFixed(1)} Pts
                      </span>
                    </div>
                  )}
                  {sentimentData && (
                    <button
                      onClick={() => setShowSentiment(!showSentiment)}
                      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-all ${
                        showSentiment
                          ? "border-purple-500/30 bg-purple-500/10 text-purple-300"
                          : "border-purple-500/30 bg-purple-500/5 text-purple-400 hover:bg-purple-500/10"
                      }`}
                    >
                      📊 {showSentiment ? "Hide" : "Show"} Public Sentiment
                    </button>
                  )}
                  <button onClick={() => exportToGovMemo(result)} className="inline-flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-300 hover:bg-blue-500/20">📄 Export Gov Memo</button>
                </div>
              </div>

              {/* X-RAY VIEWER */}
              <div className="md:col-span-3 glass p-6 rounded-3xl border border-white/10">
                <h3 className="text-xs font-bold text-accent uppercase tracking-widest mb-4 flex justify-between">
                  <span>X-Ray Policy Viewer</span>
                  {activeQuote && <button onClick={() => setActiveQuote(null)} className="text-red-400 text-[10px] border border-red-500/30 px-2 py-1 rounded-full bg-red-500/10">Clear Highlight</button>}
                </h3>
                <div className="text-sm text-white/80 leading-relaxed font-serif bg-black/40 p-5 rounded-2xl border border-white/5">
                  {renderHighlightedText(currentViewData.text)}
                </div>
              </div>

              {/* ROW 1: CORE METRICS & NEW SENTIMENT GAUGE */}
              <div className="md:col-span-1 space-y-4">
                <Card title="Governance Score">
                  <div className="text-5xl font-semibold text-emerald-400">{result.score.toFixed(1)}</div>
                  <div className="mt-4 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${result.score > 60 ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: `${result.score}%` }}></div>
                  </div>
                </Card>
                <Card title="Logistical Friction & Cost">
                   <div className="flex items-end gap-3 mb-2">
                    <span className="text-4xl font-black text-orange-400">{result.friction_score}</span>
                    <span className="text-xs text-white/50 mb-1 uppercase tracking-widest">/ 100 Difficulty</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10 text-xs text-white/70 flex justify-between">
                    <span>Est. Cost:</span><span className="text-accent font-mono font-bold">{result.cost_estimate}</span>
                  </div>
                </Card>
              </div>

              <div className="md:col-span-2 space-y-4">
                <Card title="Interactive Risk Analysis (Click to X-Ray)">
                  <div className="space-y-3 h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    {result.risks?.map((r: any, idx: number) => (
                      <button key={idx} onClick={() => setActiveQuote(r.exact_quote)} className={`w-full text-left p-4 rounded-xl border transition-all ${activeQuote === r.exact_quote ? "bg-red-500/20 border-red-500" : "bg-black/40 border-white/5 hover:border-red-500/50"}`}>
                        <div className="flex items-start gap-3">
                          <span className="text-red-400 font-bold mt-0.5">⚠️</span>
                          <div>
                            <span className="text-sm text-white/90">{r.risk_summary || r}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>
              </div>

              {/* ROW 2: NEW VISUALIZERS (Sentiment & Readiness) */}
              <div className="md:col-span-1">
                <Card title="Predicted Public Sentiment">
                  <div className="w-full relative bg-black/20 rounded-xl border border-white/5 p-5">
                    <SentimentVisualizer score={result.score} />
                  </div>
                </Card>
              </div>

              <div className="md:col-span-2">
                <Card title="Regional Infrastructure Readiness">
                  <div className="w-full relative bg-black/20 rounded-xl border border-white/5 p-4">
                    <ReadinessHeatmap friction={result.friction_score} />
                  </div>
                </Card>
              </div>

              {/* ROW 3: RESTORED DATA TABLE */}
              <div className="md:col-span-3">
                <Card title="Constitutional Vectors & Risks Database">
                  <div className="overflow-x-auto mt-2 bg-black/20 rounded-xl border border-white/5">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-xs tracking-wider uppercase text-white/50">
                          <th className="py-4 px-4 font-medium">Vector Type</th>
                          <th className="py-4 px-4 font-medium">Identified Threat / Reference</th>
                          <th className="py-4 px-4 font-medium text-right">Severity</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm text-white/80">
                        {result.risks?.map((r: any, idx: number) => (
                          <tr key={`risk-${idx}`} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-3 px-4 text-red-400 font-semibold flex items-center gap-2">⚠️ Legal Risk</td>
                            <td className="py-3 px-4">{r.risk_summary || r}</td>
                            <td className="py-3 px-4 text-right"><span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase">High</span></td>
                          </tr>
                        ))}
                        {result.references?.map((ref: string, idx: number) => (
                          <tr key={`ref-${idx}`} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-3 px-4 text-blue-400 font-semibold flex items-center gap-2">⚖️ Constitution</td>
                            <td className="py-3 px-4 font-mono text-xs text-blue-200">{ref}</td>
                            <td className="py-3 px-4 text-right"><span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase">Active</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>

              {/* ROW 4: MAPS, CHARTS, AND NEW INFOGRAPHIC */}
              <div className="md:col-span-1">
                <Card title="Algorithmic Bias Matrix">
                  <div className="w-full relative bg-black/20 rounded-xl border border-white/5 p-5">
                    <BiasMatrix data={result.bias_matrix} />
                  </div>
                </Card>
              </div>

              <div className="md:col-span-2">
                <Card title="Risk Distribution Matrix">
                  <div className="w-full relative min-h-[150px] bg-black/20 rounded-xl border border-white/5 p-4">
                    <RiskChart risks={result.risks?.map((r: any) => r.risk_summary || r) || []} />
                  </div>
                </Card>
              </div>

              {/* NEW: INFOGRAPHIC TIMELINE */}
              <div className="md:col-span-3">
                <Card title="Estimated Implementation Roadmap">
                  <div className="w-full relative bg-black/20 rounded-xl border border-white/5 p-6 overflow-hidden">
                    <ImplementationTimeline />
                  </div>
                </Card>
              </div>

              <div className="md:col-span-2">
                <Card title="Demographic & Systemic Impact Map">
                  <div className="w-full relative bg-black/20 rounded-xl border border-white/5 p-6 overflow-hidden">
                    <ImpactMap impact={result.impact} simulation={result.simulation} />
                  </div>
                </Card>
              </div>

              <div className="md:col-span-1">
                <Card title="Jurisdictional Map">
                  <div className="w-full relative min-h-[150px] bg-black/20 rounded-xl border border-white/5 p-4 overflow-hidden flex items-center justify-center">
                    <PolicyMap />
                  </div>
                </Card>
              </div>

              <div className="md:col-span-3">
                <Card title="Actionable Recommendations & Policy Flow">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ul className="space-y-3 text-sm">
                      {result.recommendations?.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent font-bold text-xs">{idx + 1}</span>
                          <span className="text-white/90 mt-0.5">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="p-4 bg-black/20 rounded-xl border border-white/5 min-h-[200px] flex items-center justify-center overflow-hidden">
                       <PolicyFlow />
                    </div>
                  </div>
                </Card>
              </div>

              {/* SENTIMENT ANALYSIS SECTION */}
              {showSentiment && sentimentData && (
                <div className="md:col-span-3 mt-6">
                  <Card title="Real-Time Public Sentiment Analysis">
                    <SentimentDashboard data={sentimentData} />
                  </Card>
                </div>
              )}

            </div>
          )}
        </section>

      </div>
    </main>
  );
}