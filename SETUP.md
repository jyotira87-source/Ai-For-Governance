# PolisAI - Complete Setup Guide

## 🚀 Quick Start

This guide walks you through setting up and running the PolisAI application locally with authentication, user dashboard, and policy analysis features.

---

## **Phase 1: Backend Setup**

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**Packages installed:**
- FastAPI (API framework)
- SQLAlchemy (ORM)
- SQLite/PostgreSQL (Database)
- python-jose (JWT tokens)
- passlib + bcrypt (Password hashing)
- pydantic (Data validation)

### 2. Configure Environment

Create `.env` file in `backend/` directory:

```env
# Database (SQLite for dev, PostgreSQL for prod)
DATABASE_URL=sqlite:///./polisai.db

# Security (generate random 32+ character string for production)
SECRET_KEY=your-super-secret-key-change-this-in-production-at-least-32-chars

# AI Engine
GROQ_API_KEY=your-groq-api-key-here
```

### 3. Start Backend Server

```bash
cd backend
python3 -m uvicorn main:app --port 8000 --host 127.0.0.1
```

**Expected output:**
```
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000
```

**Test the backend:**
```bash
curl http://localhost:8000/health
# Expected response: {"status":"active","engine":"Llama-3-AI","version":"4.0 Ultimate"}
```

---

## **Phase 2: Frontend Setup**

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Create `.env.local` file in `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Start Frontend Server

```bash
npm run dev
```

**Expected output:**
```
▲ Next.js 14.2.5
- Local:        http://localhost:3000
```

---

## **Phase 3: Testing the Application**

### Access the Application

1. **Auth Page**: Open `http://localhost:3000/auth`
2. **Sign Up** a new account
3. **Login** with your credentials
4. **Dashboard**: View analytics at `http://localhost:3000/dashboard`
5. **Policy Analysis**: Analyze policies at `http://localhost:3000`

### API Endpoints (Backend)

#### Authentication

```bash
# Register new user
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "username":"testuser",
    "password":"password123",
    "full_name":"Test User"
  }'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "password":"password123"
  }'

# Get current user (requires Bearer token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/auth/me
```

#### Policy Analysis

```bash
# Analyze policy (requires Bearer token)
curl -X POST http://localhost:8000/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"policy":"Your policy text here..."}'

# Get sentiment analysis
curl -X POST http://localhost:8000/sentiment \
  -H "Content-Type: application/json" \
  -d '{"policy":"Your policy text here..."}'
```

---

## **Features Implemented**

### ✅ Authentication System
- User registration with validation
- Login with JWT tokens
- Secure password hashing (bcrypt)
- Token-based API authentication
- Protected routes with redirects

### ✅ User Dashboard
- Account information display
- Quick stats overview
- Logout functionality
- Navigation to analysis engine

### ✅ Database
- User management (users table)
- Policy analysis storage (policy_analyses table)
- Sentiment history tracking (sentiment_history table)
- Automatic table creation on first run

### ✅ Frontend Components
- Login form with validation
- Registration form with password confirmation
- Auth context for state management
- Protected page routing
- User info display across app

---

## **Database Schema**

### Users Table
```
- id (Primary Key)
- email (Unique)
- username (Unique)
- hashed_password
- full_name
- is_active
- created_at
- updated_at
```

### Policy Analyses Table
```
- id (Primary Key)
- user_id (Foreign Key → users)
- policy_title
- policy_text
- governance_score
- friction_score
- cost_estimate
- summary
- risks (JSON)
- references (JSON)
- impact (JSON)
- simulation (JSON)
- bias_matrix (JSON)
- recommendations (JSON)
- created_at
- updated_at
```

### Sentiment History Table
```
- id (Primary Key)
- user_id (Foreign Key → users)
- policy_id (Foreign Key → policy_analyses)
- overall_approval
- key_themes (JSON)
- social_volume
- platforms (JSON)
- languages (JSON)
- created_at
```

---

## **Troubleshooting**

### Backend won't start
1. Check Python version: `python3 --version` (requires 3.11+)
2. Verify dependencies: `python3 -m pip list | grep -E "fastapi|sqlalchemy"`
3. Check port 8000 is free: `lsof -i :8000`

### Frontend won't connect to backend
1. Verify backend is running: `curl http://localhost:8000/health`
2. Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
3. Check CORS is enabled in backend (it is by default)

### Database errors
1. SQLite file will auto-create: `backend/polisai.db`
2. For PostgreSQL, ensure connection string is correct
3. Clear database: `rm backend/polisai.db` (SQLite only)

### "Module not found" errors
```bash
# Reinstall dependencies
pip install -r requirements.txt
npm install

# Clear caches
rm -rf frontend/.next
rm -rf backend/__pycache__
```

---

## **Next Steps**

1. **Save Policy Analyses**: Modify `/analyze` endpoint to save results to database
2. **Policy History**: Create page to view user's past analyses
3. **Export Reports**: Generate PDF/HTML reports of analyses
4. **Sharing**: Share analyses with other users
5. **Advanced Dashboard**: Add charts and analytics

---

## **File Structure**

```
cursor444/
├── backend/
│   ├── main.py              # FastAPI app with endpoints
│   ├── auth.py              # JWT and password utilities
│   ├── database.py          # SQLAlchemy models
│   ├── requirements.txt     # Python dependencies
│   └── .env.local          # Local environment config
├── frontend/
│   ├── app/
│   │   ├── page.tsx        # Main analysis page
│   │   ├── auth/
│   │   │   └── page.tsx    # Login/Signup page
│   │   └── dashboard/
│   │       └── page.tsx    # User dashboard
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── SentimentDashboard.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx # Auth state management
│   ├── lib/
│   │   └── api.ts          # API client functions
│   └── .env.local          # Frontend config
└── README.md               # This file
```

---

## **Production Deployment**

### Backend (Render/Heroku)
```bash
# Set environment variables:
DATABASE_URL=postgresql://...
SECRET_KEY=<random-32-char-string>
GROQ_API_KEY=<your-key>

# Deploy command: python3 -m uvicorn main:app --port $PORT
```

### Frontend (Vercel)
```bash
# Environment variables:
NEXT_PUBLIC_API_URL=https://your-backend-url.com

# Automatic deployment from Git
```

---

## **Support**

For issues or questions:
1. Check this README's Troubleshooting section
2. Review the error logs in terminal
3. Verify .env files are correctly configured
4. Ensure all dependencies are installed

---

**Happy Analyzing! 🎉**
