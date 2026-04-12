#!/usr/bin/env bash
set -euo pipefail

OWNER="jyotira87-source"
REPO="Ai-For-Governance"
API="https://api.github.com/repos/${OWNER}/${REPO}"
REPO_DESCRIPTION="AI-powered governance policy analysis platform with constitutional risk checks, sentiment insights, and predictive implementation analytics."

if [[ -z "${GITHUB_TOKEN:-}" ]]; then
  echo "❌ GITHUB_TOKEN is not set."
  echo "Create a classic token with 'repo' scope, then run:"
  echo "export GITHUB_TOKEN=ghp_xxx"
  exit 1
fi

auth_header=( -H "Authorization: Bearer ${GITHUB_TOKEN}" -H "Accept: application/vnd.github+json" )

json_escape() {
  local value="$1"
  python3 - <<'PY' "$value"
import json, sys
print(json.dumps(sys.argv[1]))
PY
}

api_call() {
  local method="$1"
  local url="$2"
  local data="${3:-}"
  local body_file
  body_file="$(mktemp)"

  local status
  if [[ -n "$data" ]]; then
    status=$(curl -sS -o "$body_file" -w "%{http_code}" -X "$method" "${auth_header[@]}" "$url" -d "$data")
  else
    status=$(curl -sS -o "$body_file" -w "%{http_code}" -X "$method" "${auth_header[@]}" "$url")
  fi

  if [[ "$status" -lt 200 || "$status" -ge 300 ]]; then
    echo "❌ GitHub API error (${status}) for ${method} ${url}" >&2
    cat "$body_file" >&2
    rm -f "$body_file"
    return 1
  fi

  cat "$body_file"
  rm -f "$body_file"
}

validate_auth() {
  local resp
  resp=$(api_call GET "$API")
  if ! echo "$resp" | grep -q '"full_name"'; then
    echo "❌ Unable to verify repo access for ${OWNER}/${REPO}." >&2
    echo "$resp" >&2
    exit 1
  fi
  echo "✅ GitHub token and repo access verified"
}

create_label() {
  local name="$1"
  local color="$2"
  local description="$3"

  if curl -sS "${auth_header[@]}" "${API}/labels/${name}" | grep -q '"name"'; then
    echo "ℹ️  Label exists: ${name}"
    return
  fi

  local payload
  payload="{\"name\":$(json_escape "$name"),\"color\":$(json_escape "$color"),\"description\":$(json_escape "$description")}"
  api_call POST "${API}/labels" "$payload" >/dev/null
  echo "✅ Created label: ${name}"
}

create_issue() {
  local title="$1"
  local body="$2"
  local labels_json="$3"

  local payload
  payload=$(python3 - <<'PY' "$title" "$body" "$labels_json"
import json, sys
title = sys.argv[1]
body = sys.argv[2]
labels = json.loads(sys.argv[3])
print(json.dumps({"title": title, "body": body, "labels": labels}))
PY
)

  local response
  response=$(api_call POST "${API}/issues" "$payload")
  python3 - <<'PY' "$response"
import json, sys
data = json.loads(sys.argv[1])
print(f"✅ Created issue: {data.get('html_url', 'unknown-url')}")
PY
}

command -v python3 >/dev/null || { echo "❌ python3 is required."; exit 1; }

validate_auth

echo "🚀 Creating labels..."
create_label "good first issue" "7057ff" "Great for first-time contributors"
create_label "help wanted" "008672" "Maintainers welcome community help"
create_label "documentation" "0e8a16" "Docs and contribution docs updates"
create_label "frontend" "1d76db" "Next.js / UI / UX changes"
create_label "backend" "d93f0b" "FastAPI / API / data-model changes"

echo "🚀 Updating repository description..."
api_call PATCH "${API}" "{\"description\":$(json_escape "$REPO_DESCRIPTION")}" >/dev/null
echo "✅ Repository description updated"

echo "🚀 Creating starter issues..."

create_issue \
  "Improve Auth page UX consistency with new glass theme" \
"## Goal
Align `/frontend/app/auth/page.tsx` visuals with the new dashboard/history styles.

## Scope
- Update spacing, card treatment, and button hierarchy
- Improve mobile responsiveness
- Keep existing auth logic unchanged

## Acceptance Criteria
- [ ] Page matches current visual system used in dashboard/history
- [ ] No TypeScript or lint errors
- [ ] `npm run build` passes in `frontend/`

## Notes
Keep changes focused on UI only." \
"[\"good first issue\",\"help wanted\",\"frontend\"]"

create_issue \
  "Add empty-state illustrations and microcopy to Sentiment page" \
"## Goal
Improve first-time user experience on `/frontend/app/sentiment/page.tsx`.

## Scope
- Add polished empty-state sections before analysis results
- Improve helper microcopy and CTA clarity
- Keep existing API calls and logic unchanged

## Acceptance Criteria
- [ ] Empty state appears before first analysis
- [ ] CTA text clearly explains next action
- [ ] Lint/build pass in frontend

## Notes
No backend changes needed." \
"[\"good first issue\",\"help wanted\",\"frontend\"]"

create_issue \
  "Add backend `/history` endpoint for persisted analysis records" \
"## Goal
Expose analysis history from backend so frontend can replace placeholder data.

## Scope
- Add GET endpoint (e.g. `/history`) in `backend/main.py`
- Return records from DB model used for analyses
- Include auth check for current user

## Acceptance Criteria
- [ ] Endpoint returns only the requesting user’s records
- [ ] Response model is typed and documented
- [ ] Basic error handling for empty history and DB issues
- [ ] Existing endpoints continue working

## Notes
Coordinate expected response shape with frontend history page." \
"[\"help wanted\",\"backend\"]"

create_issue \
  "Document local development troubleshooting guide" \
"## Goal
Expand docs for common setup and runtime issues.

## Scope
- Add section to `README.md` or `CONTRIBUTING.md`
- Cover: env vars, missing dependencies, lint/build failures, API connection issues
- Include copy-paste verification commands

## Acceptance Criteria
- [ ] Troubleshooting section added and organized by symptom
- [ ] Commands tested on macOS/zsh
- [ ] Docs links remain valid

## Notes
Keep it concise and beginner-friendly." \
"[\"good first issue\",\"documentation\"]"

create_issue \
  "Add unit tests for `QuickActions` interaction behavior" \
"## Goal
Increase frontend test coverage for navigation action cards.

## Scope
- Add tests for `/frontend/components/QuickActions.tsx`
- Verify internal route navigation behavior
- Verify external link behavior for `external: true`

## Acceptance Criteria
- [ ] Tests cover click interactions and rendering states
- [ ] Existing test suite still passes
- [ ] No behavior regression in component API

## Notes
Use existing test setup (Jest + RTL)." \
"[\"good first issue\",\"help wanted\",\"frontend\"]"

echo "🎉 Done. Labels and starter issues created."
