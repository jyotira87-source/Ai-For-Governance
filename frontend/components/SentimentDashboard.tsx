"use client";

import { SentimentResponse } from "@/lib/api";

function SentimentGauge({ approval }: { approval: number }) {
  const percentage = Math.max(0, Math.min(100, approval));

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-end">
        <div className="text-emerald-400">
          <span className="text-3xl font-black">{percentage.toFixed(1)}%</span>
          <span className="text-[10px] uppercase tracking-widest block text-emerald-500/70">Public Approval</span>
        </div>
        <div className="text-red-400 text-right">
          <span className="text-3xl font-black">{(100 - percentage).toFixed(1)}%</span>
          <span className="text-[10px] uppercase tracking-widest block text-red-500/70">Opposition</span>
        </div>
      </div>
      <div className="h-4 w-full flex rounded-full overflow-hidden border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <div className="bg-emerald-500 transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
        <div className="bg-red-500 transition-all duration-1000" style={{ width: `${100 - percentage}%` }}></div>
      </div>
    </div>
  );
}

function ThemeAnalysis({ themes }: { themes: SentimentResponse['key_themes'] }) {
  return (
    <div className="space-y-3">
      {themes.map((theme, i) => (
        <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
          <div className="flex-1">
            <span className="text-sm font-semibold text-white/90">{theme.theme}</span>
            <div className="text-xs text-white/50 mt-1">
              {theme.mentions.toLocaleString()} mentions
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-2 py-1 rounded text-xs font-bold ${
              theme.sentiment_score > 0.2 ? 'bg-emerald-500/20 text-emerald-400' :
              theme.sentiment_score < -0.2 ? 'bg-red-500/20 text-red-400' :
              'bg-yellow-500/20 text-yellow-400'
            }`}>
              {theme.sentiment_score > 0 ? '+' : ''}{(theme.sentiment_score * 100).toFixed(0)}%
            </div>
            <div className={`px-2 py-1 rounded text-xs font-bold ${
              theme.trend === 'rising' ? 'bg-emerald-500/20 text-emerald-400' :
              theme.trend === 'falling' ? 'bg-red-500/20 text-red-400' :
              'bg-blue-500/20 text-blue-400'
            }`}>
              {theme.trend === 'rising' ? '↗️' : theme.trend === 'falling' ? '↘️' : '→'} {theme.trend}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PlatformBreakdown({ platforms }: { platforms: Record<string, number> }) {
  const total = Object.values(platforms).reduce((a, b) => a + b, 0);

  return (
    <div className="grid grid-cols-2 gap-3">
      {Object.entries(platforms).map(([platform, percentage]) => (
        <div key={platform} className="p-3 bg-black/20 rounded-xl border border-white/5 text-center">
          <div className="text-lg font-bold text-accent capitalize">{platform}</div>
          <div className="text-sm text-white/70">{percentage}%</div>
        </div>
      ))}
    </div>
  );
}

export function SentimentDashboard({ data }: { data: SentimentResponse }) {
  return (
    <div className="space-y-6">
      {/* Overall Sentiment Gauge */}
      <div className="bg-black/20 rounded-xl border border-white/5 p-6">
        <h3 className="text-sm font-bold text-accent uppercase tracking-widest mb-4">Real-Time Public Sentiment</h3>
        <SentimentGauge approval={data.overall_approval} />
        <div className="mt-4 text-xs text-white/50 text-center">
          Based on {data.social_volume.toLocaleString()} social media mentions in last 24h
        </div>
      </div>

      {/* Key Themes */}
      <div className="bg-black/20 rounded-xl border border-white/5 p-6">
        <h3 className="text-sm font-bold text-accent uppercase tracking-widest mb-4">Key Discussion Themes</h3>
        <ThemeAnalysis themes={data.key_themes} />
      </div>

      {/* Platform & Language Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-black/20 rounded-xl border border-white/5 p-6">
          <h3 className="text-sm font-bold text-accent uppercase tracking-widest mb-4">Platform Distribution</h3>
          <PlatformBreakdown platforms={data.platforms} />
        </div>

        <div className="bg-black/20 rounded-xl border border-white/5 p-6">
          <h3 className="text-sm font-bold text-accent uppercase tracking-widest mb-4">Language Distribution</h3>
          <PlatformBreakdown platforms={data.languages} />
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-xs text-white/40 text-center">
        Last updated: {new Date(data.last_updated).toLocaleString()}
      </div>
    </div>
  );
}