export type RiskDetail = {
  risk_summary: string;
  exact_quote: string;
};

export type BiasMatrix = {
  urban_tech: number;
  rural_unconnected: number;
  corporate: number;
  vulnerable: number;
};

export type AnalyzeResponse = {
  summary: string;
  risks: RiskDetail[];
  references: string[];
  impact: string[];
  simulation: string[];
  score: number;
  bias_matrix: BiasMatrix;
  friction_score: number;
  cost_estimate: string;
  recommendations: string[];
};

export type SentimentTheme = {
  theme: string;
  sentiment_score: number;
  mentions: number;
  trend: string;
};

export type SentimentResponse = {
  overall_approval: number;
  key_themes: SentimentTheme[];
  social_volume: number;
  platforms: Record<string, number>;
  languages: Record<string, number>;
  last_updated: string;
};

export async function analyzePolicy(policy: string): Promise<AnalyzeResponse> {
  const base = "https://ai-for-governance.onrender.com";

  const res = await fetch(`${base}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ policy })
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Backend error (${res.status}): ${text || res.statusText}`);
  }
  return (await res.json()) as AnalyzeResponse;
}

export async function analyzeSentiment(policy: string): Promise<SentimentResponse> {
  const base = "https://ai-for-governance.onrender.com";

  const res = await fetch(`${base}/sentiment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ policy })
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Backend error (${res.status}): ${text || res.statusText}`);
  }
  return (await res.json()) as SentimentResponse;
}

