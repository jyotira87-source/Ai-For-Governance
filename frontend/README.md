# PolisAI Frontend (Next.js + Tailwind)

## Setup

```bash
cd frontend
npm install
```

## Configure backend URL

By default the UI calls `http://localhost:8000`.

To override, set:

```bash
export NEXT_PUBLIC_API_URL="http://localhost:8000"
```

You can also create a `.env.local` manually (not committed) with:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

See `env.example`.

## Run

```bash
npm run dev
```

Open `http://localhost:3000`.

