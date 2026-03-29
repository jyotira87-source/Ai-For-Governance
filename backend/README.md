# PolisAI Backend (FastAPI)

## Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip

# Install PyTorch first (pick CPU wheels; version depends on your platform)
pip install --index-url https://download.pytorch.org/whl/cpu torch

# Then install the rest
pip install -r requirements.txt
```

## macOS / Apple Silicon notes (important)

This backend uses HuggingFace `transformers`, which requires **PyTorch (`torch`)**.
PyTorch wheels are not available for **Python 3.13** on macOS, so you must use **Python 3.11 or 3.12**.

```bash
cd backend
rm -rf .venv

# Use Python 3.12 if available; otherwise Python 3.11.
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip setuptools wheel
pip install --index-url https://download.pytorch.org/whl/cpu torch
pip install -r requirements.txt
```

## Run

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Endpoints

- `POST /analyze` — policy analysis
- `GET /health` — health check

