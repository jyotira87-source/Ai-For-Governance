# Contributing to PolisAI

Thanks for your interest in contributing to **PolisAI**.
This guide helps you open high-quality issues and PRs quickly.

## Ways to Contribute

- Report bugs
- Suggest features
- Improve docs
- Add tests
- Fix UI/UX issues
- Improve backend reliability/performance

## Project Setup

### Prerequisites

- Node.js 18+
- npm 9+
- Python 3.11+
- Git

### 1) Fork and Clone

```bash
# Fork via GitHub UI first, then:
git clone https://github.com/<your-username>/Ai-For-Governance.git
cd Ai-For-Governance
```

### 2) Run Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# Add GROQ_API_KEY in backend/.env
uvicorn main:app --reload
```

### 3) Run Frontend

```bash
cd frontend
npm install
npm run dev
```

## Branch & Commit Workflow

1. Sync your fork with `main`
2. Create a feature branch:

```bash
git checkout -b feat/short-description
```

3. Keep changes focused and small
4. Write clear commit messages

Examples:
- `feat(frontend): improve dashboard loading UX`
- `fix(api): handle null sentiment payload`
- `docs: add backend local setup notes`

## Coding Guidelines

### Frontend (`frontend/`)

- Use TypeScript + React functional components
- Keep components reusable and composable
- Prefer existing UI patterns (`Card`, `LoadingState`, `QuickActions`)
- Ensure responsive behavior for mobile and desktop

### Backend (`backend/`)

- Use typed Pydantic models for request/response
- Keep API changes backward compatible where possible
- Avoid silent failures; return clear error messages
- Keep business logic testable and isolated

## Tests & Validation (Required Before PR)

Run relevant checks before opening a PR:

```bash
# Frontend
cd frontend
npm run lint
npm run build
npm test

# Optional e2e
npm run test:e2e
```

If your change touches backend behavior, validate API routes locally and include sample request/response in PR notes.

## Pull Request Checklist

Before submitting, confirm:

- [ ] I created/updated tests for my change (when applicable)
- [ ] I ran lint/build locally
- [ ] I kept the PR scoped to one topic
- [ ] I updated docs (`README.md` / comments) when needed
- [ ] I added screenshots/videos for UI changes
- [ ] I linked related issues (e.g., `Closes #123`)

## Issue Reporting Tips

Please include:

- Environment (OS, Node/Python versions)
- Steps to reproduce
- Expected vs actual behavior
- Logs/errors/screenshots

## Good First Issues

Look for labels like:

- `good first issue`
- `help wanted`
- `documentation`
- `frontend`
- `backend`

## Community Expectations

Be respectful and constructive in discussions and reviews.
Assume positive intent and focus feedback on code and product impact.

## Questions?

Open a Discussion or Issue with context, and maintainers will help triage.
