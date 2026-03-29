# PolisAI — AI-powered governance policy analyzer

Full-stack app:

- **Frontend**: Next.js (App Router) + TypeScript + Tailwind (premium dark theme)
- **Backend**: FastAPI + HuggingFace Transformers summarization + rule-based risk + constitutional mapping

## Run backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend health: `http://localhost:8000/health`

## Run frontend

```bash
cd frontend
npm install
export NEXT_PUBLIC_API_URL="http://localhost:8000"
npm run dev
```

Open `http://localhost:3000`

## API

`POST /analyze`

Input:

```json
{ "policy": "text" }
```

Output:

```json
{
  "summary": "...",
  "risks": ["..."],
  "references": ["..."]
}
```

