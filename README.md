# 🏛️ PolisAI: Enterprise Governance Intelligence

![PolisAI Version](https://img.shields.io/badge/Version-4.0%20Ultimate-amber.svg)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20FastAPI%20%7C%20Llama--3-blue.svg)

**Predictive GovTech and Constitutional Risk Analysis for 1.4 Billion Citizens.**

PolisAI helps lawmakers, civic leaders, and government agencies draft, analyze, and simulate public policy. By grounding LLM analysis in the Constitution of India, PolisAI surfaces legal risks, estimates rollout friction, and gives predictive implementation signals before policy rollout.

---

## 🚀 Key Features

- 🔍 **X-Ray Clause Highlighting** for risk-triggering text
- ⚖️ **A/B Policy Diff Engine** for draft comparisons
- 📊 **Algorithmic Bias Matrix** across demographic groups
- ⚙️ **Logistical Friction Simulator** with cost signals
- 📄 **Government Memo Exporter** for official record format
- 🗺️ **Policy Dashboard Visuals** (sentiment, readiness, timelines)

---

## 🧠 System Architecture

### Frontend
- Next.js (App Router) + React 18 + TypeScript
- Tailwind CSS with glassmorphism UI

### Backend
- FastAPI (Python)
- Llama-3 via Groq Cloud
- Strict Pydantic validation for safe response contracts

---

## 💻 Local Setup

Run backend and frontend in separate terminals.

### 1) Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# Add GROQ_API_KEY in backend/.env
uvicorn main:app --reload
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🤝 Contributing

We welcome community contributions.

- Start here: [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- Issue templates:
  - Bug report: [`.github/ISSUE_TEMPLATE/bug_report.yml`](./.github/ISSUE_TEMPLATE/bug_report.yml)
  - Feature request: [`.github/ISSUE_TEMPLATE/feature_request.yml`](./.github/ISSUE_TEMPLATE/feature_request.yml)
- PR template: [`.github/pull_request_template.md`](./.github/pull_request_template.md)

### Quick Contribution Flow

1. Fork the repository
2. Create a branch from `main`
3. Implement a focused change
4. Run checks (`lint`, `build`, relevant tests)
5. Open a PR using the template

### Good First Contributions

- UI consistency and accessibility fixes
- API validation and error-handling improvements
- Unit/e2e test coverage improvements
- Docs setup and developer experience improvements

If you want to contribute but need direction, open a feature request and we’ll help scope the task.
