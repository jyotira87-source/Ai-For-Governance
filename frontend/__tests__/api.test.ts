import { analyzePolicy, analyzeSentiment } from "../lib/api";

const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockAnalyzeResponse = {
  summary: "Test policy summary",
  risks: [{ risk_summary: "Budget risk", exact_quote: "costs may increase" }],
  references: ["Ref 1"],
  impact: ["Impact on citizens"],
  simulation: ["Urban scenario"],
  score: 75,
  bias_matrix: { urban_tech: 0.5, rural_unconnected: 0.3, corporate: 0.8, vulnerable: 0.2 },
  friction_score: 35,
  cost_estimate: "$5M",
  recommendations: ["Implement gradually"],
};

const mockSentimentResponse = {
  overall_approval: 62.5,
  key_themes: [{ theme: "Climate", sentiment_score: 0.6, mentions: 1200, trend: "rising" }],
  social_volume: 45000,
  platforms: { twitter: 55, reddit: 30, facebook: 15 },
  languages: { english: 80, spanish: 15, french: 5 },
  last_updated: "2024-01-15T10:00:00Z",
};

describe("analyzePolicy", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("calls the correct endpoint with POST method and JSON body", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAnalyzeResponse,
    });

    await analyzePolicy("Universal Basic Income proposal");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://ai-for-governance.onrender.com/analyze",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policy: "Universal Basic Income proposal" }),
      })
    );
  });

  it("returns the parsed JSON response on success", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAnalyzeResponse,
    });

    const result = await analyzePolicy("test policy");
    expect(result).toEqual(mockAnalyzeResponse);
  });

  it("throws an error with status and body when response is not ok", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      text: async () => "Server crashed",
    });

    await expect(analyzePolicy("test")).rejects.toThrow(
      "Backend error (500): Server crashed"
    );
  });

  it("falls back to statusText when text() fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      statusText: "Service Unavailable",
      text: async () => {
        throw new Error("read error");
      },
    });

    await expect(analyzePolicy("test")).rejects.toThrow(
      "Backend error (503): Service Unavailable"
    );
  });

  it("throws when fetch itself rejects (network error)", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Failed to fetch"));

    await expect(analyzePolicy("test")).rejects.toThrow("Failed to fetch");
  });

  it("returns correct shape including bias_matrix and friction_score", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAnalyzeResponse,
    });

    const result = await analyzePolicy("test");
    expect(result.bias_matrix).toHaveProperty("urban_tech");
    expect(result.bias_matrix).toHaveProperty("rural_unconnected");
    expect(result.bias_matrix).toHaveProperty("corporate");
    expect(result.bias_matrix).toHaveProperty("vulnerable");
    expect(typeof result.friction_score).toBe("number");
    expect(typeof result.score).toBe("number");
  });
});

describe("analyzeSentiment", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("calls the correct endpoint with POST method and JSON body", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSentimentResponse,
    });

    await analyzeSentiment("Climate policy text");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://ai-for-governance.onrender.com/sentiment",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policy: "Climate policy text" }),
      })
    );
  });

  it("returns the parsed sentiment response on success", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSentimentResponse,
    });

    const result = await analyzeSentiment("test policy");
    expect(result).toEqual(mockSentimentResponse);
  });

  it("throws an error with status and body when response is not ok", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 422,
      statusText: "Unprocessable Entity",
      text: async () => "Invalid input",
    });

    await expect(analyzeSentiment("test")).rejects.toThrow(
      "Backend error (422): Invalid input"
    );
  });

  it("falls back to statusText when text() fails on error response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
      text: async () => {
        throw new Error("read error");
      },
    });

    await expect(analyzeSentiment("test")).rejects.toThrow(
      "Backend error (404): Not Found"
    );
  });

  it("returns correct response shape with key_themes and platforms", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSentimentResponse,
    });

    const result = await analyzeSentiment("test");
    expect(typeof result.overall_approval).toBe("number");
    expect(Array.isArray(result.key_themes)).toBe(true);
    expect(typeof result.social_volume).toBe("number");
    expect(result.platforms).toBeDefined();
    expect(result.languages).toBeDefined();
    expect(result.last_updated).toBeDefined();
  });
});
