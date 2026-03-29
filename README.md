# 🏛️ PolisAI: Enterprise Governance Intelligence

![PolisAI Version](https://img.shields.io/badge/Version-4.0%20Ultimate-amber.svg)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20FastAPI%20%7C%20Llama--3-blue.svg)

**Predictive GovTech and Constitutional Risk Analysis for 1.4 Billion Citizens.**

PolisAI is an advanced, multi-agent AI engine designed to help lawmakers, civic leaders, and government agencies draft, analyze, and simulate public policy. By grounding state-of-the-art LLMs in the Constitution of India, PolisAI identifies legal risks, calculates algorithmic bias, and predicts logistical rollout friction before a policy is ever enacted.

---

## 🚀 Key Enterprise Features

* **🔍 X-Ray Clause Highlighting:** Click on any identified legal risk, and the UI uses string-matching algorithms to instantly highlight the exact problematic sentence in your original policy draft.
* **⚖️ A/B Policy Diff Engine:** Draft iteratively. Input "Draft V1", make adjustments, and input "Draft V2" to see a real-time side-by-side comparison of how your Governance Score improved.
* **📊 Algorithmic Bias Matrix:** Uses predictive modeling to score how a policy disproportionately impacts specific Indian demographics (e.g., Urban Tech-Savvy vs. Rural Unconnected).
* **⚙️ Logistical Friction Simulator:** Estimates the real-world difficulty and financial cost of rolling out the policy across India's vast geography.
* **📄 Official Gov Memo Exporter:** Generates a flawlessly formatted, macOS and Windows compatible `.html` Government Memorandum for official record-keeping and printing.
* **🗺️ 11-Point Data Dashboard:** Includes pure-Tailwind visualizers like Public Sentiment Gauges, Regional Readiness Heatmaps, and Implementation Timelines.

---

## 🧠 System Architecture

PolisAI is built on a decoupled, highly secure architecture to prevent LLM hallucinations and ensure data integrity.

### Frontend (The Face)
* **Framework:** Next.js (App Router) & React 18
* **Styling:** Tailwind CSS with a custom "Cyber-Lux Glassmorphism" UI.
* **Visualizations:** Zero-dependency, pure CSS/React data components to eliminate hydration errors and maximize rendering speed.

### Backend (The Brain)
* **Framework:** FastAPI (Python)
* **AI Engine:** Llama-3 (70B) via Groq Cloud for ultra-low latency inference.
* **Data Validation:** Strict `Pydantic` modeling. The backend forces the LLM to return complex, nested JSON objects and uses recursive unwrapping to ensure the frontend never receives broken data structures.

---

## 💻 Local Deployment Instructions

To run PolisAI on your local machine, you will need to start both the Python backend and the Next.js frontend.

### 1. Start the Backend (FastAPI)
Navigate to the backend directory, install the requirements, and boot the server:
```bash
cd backend
pip install -r requirements.txt
# Ensure your .env file contains GROQ_API_KEY=your_key_here
uvicorn main:app --reload