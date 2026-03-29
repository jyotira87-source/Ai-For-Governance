export type AnalyzeResponse = {
  summary: string;
  risks: string[];
  references: string[];
  impact: string[];
  simulation: string[];
  score: number;
  recommendations: string[];
};

export async function analyzePolicy(policy: string): Promise<AnalyzeResponse> {
  const base =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

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

