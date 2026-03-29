from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List


class PolicyRequest(BaseModel):
    policy: str


class PolicyResponse(BaseModel):
    summary: str
    risks: List[str]
    references: List[str]
    impact: List[str]
    simulation: List[str]
    score: float
    recommendations: List[str]


app = FastAPI(title="PolisAI Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def summarize_policy(text: str) -> str:
    text = text.strip()
    if not text:
        return ""
    # Lightweight heuristic summarization to avoid heavy model loading.
    # Takes the first few sentences/lines and trims to a reasonable length.
    parts = []
    for splitter in [". ", "\n"]:
        if splitter in text:
            parts = text.split(splitter)
            break
    if not parts:
        parts = [text]
    # Take first 3 segments and join.
    summary = ". ".join(parts[:3]).strip()
    if len(summary) > 600:
        summary = summary[:580].rsplit(" ", 1)[0] + "..."
    return summary


RISK_KEYWORDS = {
    "privacy": [
        "surveillance",
        "data collection",
        "data retention",
        "metadata",
        "monitoring",
        "facial recognition",
        "tracking",
    ],
    "civil_liberties": [
        "freedom of speech",
        "freedom of expression",
        "assembly",
        "protest",
        "censorship",
        "ban",
        "blacklist",
    ],
    "due_process": [
        "without warrant",
        "warrantless",
        "detention",
        "indefinite",
        "no appeal",
        "emergency powers",
    ],
    "discrimination": [
        "protected class",
        "race",
        "religion",
        "ethnicity",
        "gender",
        "orientation",
        "disparate impact",
    ],
    "economic": [
        "tax",
        "income tax",
        "vat",
        "sales tax",
        "levy",
        "fiscal",
        "revenue",
        "budget",
        "austerity",
        "subsidy",
        "welfare",
        "benefit",
    ],
}


def analyze_risk(text: str) -> List[str]:
    lowered = text.lower()
    risks: List[str] = []

    if any(k in lowered for k in RISK_KEYWORDS["privacy"]):
        risks.append("Potential privacy and surveillance concerns.")

    if any(k in lowered for k in RISK_KEYWORDS["civil_liberties"]):
        risks.append("Potential impact on civil liberties and free expression.")

    if any(k in lowered for k in RISK_KEYWORDS["due_process"]):
        risks.append("Potential limitations on due process or judicial oversight.")

    if any(k in lowered for k in RISK_KEYWORDS["discrimination"]):
        risks.append("Risk of discriminatory or unequal impact on protected groups.")

    if any(k in lowered for k in RISK_KEYWORDS["economic"]):
        risks.append(
            "Distributional and economic burden: assess effects across income groups, "
            "potential regressivity, and impacts on essential goods or services."
        )

    if "emergency" in lowered or "national security" in lowered:
        risks.append("Expansion of executive or emergency powers may require safeguards.")

    if not risks:
        risks.append("No major structural risks detected based on simple rule-based checks.")

    return risks


CONSTITUTIONAL_TOPICS = [
    (
        "Freedom of speech & expression",
        [
            "speech",
            "expression",
            "censorship",
            "press",
            "media",
            "communication platform",
        ],
    ),
    (
        "Privacy and search & seizure protections",
        [
            "surveillance",
            "monitoring",
            "search",
            "seizure",
            "encryption",
            "metadata",
        ],
    ),
    (
        "Due process & fair trial rights",
        [
            "trial",
            "prosecution",
            "detention",
            "appeal",
            "court",
            "judicial",
        ],
    ),
    (
        "Equal protection & non-discrimination",
        [
            "protected class",
            "race",
            "religion",
            "ethnicity",
            "gender",
            "discrimination",
            "minority",
        ],
    ),
    (
        "Separation of powers & checks and balances",
        [
            "executive",
            "legislature",
            "parliament",
            "congress",
            "agency",
            "regulator",
        ],
    ),
]


def get_constitutional_references(text: str) -> List[str]:
    lowered = text.lower()
    refs: List[str] = []
    for label, keywords in CONSTITUTIONAL_TOPICS:
        if any(k in lowered for k in keywords):
            refs.append(label)

    if not refs:
        refs.append("General governance, accountability, and fundamental rights.")

    return refs


def analyze_future_impact(text: str, risks: List[str]) -> List[str]:
    lowered = text.lower()
    impact: List[str] = []

    if any(k in lowered for k in RISK_KEYWORDS["economic"]):
        impact.append(
            "Medium-term distributional effects on lower and middle-income households; "
            "model potential changes in disposable income and consumption."
        )
        impact.append(
            "Long-run incentives: assess behavioural responses such as reduced labour supply "
            "or increased tax planning."
        )

    if any(k in lowered for k in RISK_KEYWORDS["privacy"]):
        impact.append(
            "Increased normalization of data collection, with cumulative risk of function creep "
            "and cross-database linkage over a 5–10 year horizon."
        )

    if "climate" in lowered or "emissions" in lowered or "carbon" in lowered:
        impact.append(
            "Climate trajectory: estimate emission reductions and alignment with national "
            "targets across 2030 and 2050 horizons."
        )

    if not impact:
        impact.append(
            "No specific long-term impact patterns detected beyond baseline governance and "
            "implementation risks."
        )

    return impact


def simulate_policy(text: str, risks: List[str]) -> List[str]:
    lowered = text.lower()
    sims: List[str] = []

    if any(k in lowered for k in RISK_KEYWORDS["economic"]):
        sims.append(
            "Scenario A — High-intensity implementation: full 25% increase applied quickly; "
            "short-term revenue gain is high but public acceptance and compliance may fall."
        )
        sims.append(
            "Scenario B — Phased implementation: staggered increase over multiple years; "
            "lower shock to households but delayed fiscal impact."
        )

    if any(k in lowered for k in RISK_KEYWORDS["privacy"]):
        sims.append(
            "Scenario C — Strong safeguards: independent oversight, strict retention limits, "
            "and transparency reports reduce perceived surveillance risk."
        )
        sims.append(
            "Scenario D — Weak safeguards: broad access and long retention periods; higher "
            "chilling effects on behaviour and civic participation."
        )

    if not sims:
        sims.append(
            "Baseline scenario: policy implemented as written with standard administrative "
            "capacity and moderate public scrutiny."
        )
        sims.append(
            "Stress scenario: implementation under crisis conditions or fiscal stress, where "
            "oversight and consultation may be compressed."
        )

    return sims


def compute_score(risks: List[str]) -> float:
    base = 85.0
    penalty = len(risks) * 6.5
    score = max(10.0, min(95.0, base - penalty))
    return round(score, 1)


def generate_recommendations(text: str, risks: List[str]) -> List[str]:
    recs: List[str] = []
    lowered = text.lower()

    if any("economic burden" in r or "distributional" in r for r in risks):
        recs.append(
            "Run a distributional impact assessment by income decile and publish "
            "results before implementation."
        )
        recs.append(
            "Consider compensatory measures (tax credits, targeted transfers) for "
            "low-income households most affected."
        )

    if any("privacy" in r or "surveillance" in r for r in risks):
        recs.append(
            "Adopt data minimisation and clear retention limits, with independent "
            "oversight over access to sensitive datasets."
        )

    if any("civil liberties" in r or "expression" in r for r in risks):
        recs.append(
            "Include explicit safeguards protecting peaceful protest, journalism, and "
            "online expression from indirect restrictions."
        )

    if not recs:
        recs.append(
            "Document implementation assumptions, key metrics, and review points to "
            "ensure accountability over time."
        )

    if "consultation" not in lowered:
        recs.append(
            "Plan structured consultation with affected stakeholders and publish a "
            "reasoned response to feedback."
        )

    return recs


@app.post("/analyze", response_model=PolicyResponse)
async def analyze_policy(payload: PolicyRequest) -> PolicyResponse:
    summary = summarize_policy(payload.policy)
    risks = analyze_risk(payload.policy)
    references = get_constitutional_references(payload.policy)
    impact = analyze_future_impact(payload.policy, risks)
    simulation = simulate_policy(payload.policy, risks)
    score = compute_score(risks)
    recommendations = generate_recommendations(payload.policy, risks)
    return PolicyResponse(
        summary=summary,
        risks=risks,
        references=references,
        impact=impact,
        simulation=simulation,
        score=score,
        recommendations=recommendations,
    )


@app.get("/health")
async def health():
    return {"status": "ok", "service": "polisai-backend"}

