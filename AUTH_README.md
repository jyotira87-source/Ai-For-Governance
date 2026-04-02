# PolisAI Authentication System

## Overview

PolisAI now includes a complete authentication system with:
- User registration and login
- JWT-based token authentication
- Protected routes
- User dashboard
- Persistent user accounts
- Real-time sentiment analysis integration

## Quick Start

### 1. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export GROQ_API_KEY="your-groq-api-key"
export DATABASE_URL="postgresql://user:password@host:5432/db"  # For production
# Or use SQLite locally (default)

# Run backend
python -m uvicorn main:app --reload
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set environment variables in .env.local
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:8000" > .env.local

# Run frontend
npm run dev
```

### 3. Access the App

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Authentication Flow

### Signup Flow
1. User fills signup form: email, username, password, full name
2. Frontend validates input
3. POST to `/auth/register` with user data
4. Backend:
   - Validates email/username uniqueness
   - Hashes password with bcrypt
   - Creates user in database
   - Returns user info
5. Frontend auto-logs user in
6. Frontend stores token in localStorage
7. Redirect to dashboard

### Login Flow
1. User enters email and password
2. Frontend validates input
3. POST to `/auth/login` with credentials
4. Backend:
   - Queries user by email
   - Verifies password hash
   - Creates JWT token (30-minute expiration)
   - Returns token
5. Frontend stores token in localStorage
6. Add token to all subsequent API requests as Bearer token
7. Redirect to dashboard

### Protected Requests
1. Frontend includes Authorization header: `Bearer <token>`
2. Backend verifies token signature and expiration
3. If valid: process request
4. If invalid: return 401 Unauthorized

## API Endpoints

### Authentication Endpoints

#### Register
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "Password@123",
  "full_name": "Full Name"
}

Response: 201 Created
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "full_name": "Full Name",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00Z"
}
```

#### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password@123"
}

Response: 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

#### Get Current User
```bash
GET /auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "full_name": "Full Name",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Policy Analysis (Protected)
```bash
POST /analyze
Authorization: Bearer <token>
Content-Type: application/json

{
  "policy": "Policy text here..."
}

Response: 200 OK
{
  "governance_score": 8.5,
  "friction_score": 3.2,
  "cost_estimate": "₹ 5 crore",
  "summary": "...",
  "risks": [...],
  ...
}
```

### Sentiment Analysis (Protected)
```bash
POST /sentiment
Authorization: Bearer <token>
Content-Type: application/json

{
  "policy": "Policy text here..."
}

Response: 200 OK
{
  "overall_approval": 0.72,
  "key_themes": [...],
  "social_volume": 15000,
  ...
}
```

## Database Schema

### Users Table
- `id` (Primary Key)
- `email` (Unique)
- `username` (Unique)
- `hashed_password`
- `full_name`
- `is_active` (Default: true)
- `created_at`
- `updated_at`

### Policy Analyses Table
- `id` (Primary Key)
- `user_id` (Foreign Key → Users)
- `policy_title`
- `policy_text`
- `governance_score`
- `friction_score`
- `cost_estimate`
- `summary`
- `risks` (JSON)
- `impact` (JSON)
- `created_at`
- `updated_at`

### Sentiment History Table
- `id` (Primary Key)
- `user_id` (Foreign Key → Users)
- `policy_id` (Foreign Key → PolicyAnalyses)
- `overall_approval` (0-1)
- `key_themes` (JSON)
- `social_volume`
- `platforms` (JSON)
- `created_at`

## Frontend Components

### AuthContext (`contexts/AuthContext.tsx`)
Global authentication state management with:
- `login()` - Authenticate user
- `register()` - Create new account
- `logout()` - Sign out user
- `isAuthenticated` - Boolean flag
- `user` - Current user object
- `token` - JWT token

Usage:
```tsx
const { user, isAuthenticated, login, logout } = useAuth();
```

### LoginForm & SignupForm
User-friendly forms with:
- Input validation
- Password visibility toggle
- Error message display
- Loading states
- Automatic redirect on success

### Dashboard
Protected route showing:
- User profile info
- Analysis history
- Account settings
- Logout button

## Environment Variables

### Backend (.env or .env.local)
```
GROQ_API_KEY=your-groq-api-key
DATABASE_URL=postgresql://user:pass@host:5432/db  # Optional, defaults to SQLite
```

### Frontend (.env.local)
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
# Or for production:
# NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
```

## Deployment

### Render Deployment

See [DATABASE_SETUP.md](DATABASE_SETUP.md) for PostgreSQL setup on Render.

1. Backend: https://ai-for-governance.onrender.com
2. Frontend: https://ai-for-governance.vercel.app

## Security

### Password Security
- Passwords hashed with bcrypt (12 rounds)
- Never stored in plaintext
- Verified on login attempt

### Token Security
- JWT tokens with HS256 signature
- 30-minute expiration
- User ID and email in token claims
- Invalid tokens rejected with 401 Unauthorized

### CORS
- All origins allowed (adjust for production)
- Credentials enabled
- Custom headers allowed

### Best Practices
- Use HTTPS in production
- Set strong GROQ_API_KEY
- Rotate JWT secret regularly
- Monitor suspicious login attempts
- Implement rate limiting on auth endpoints
- Use strong database passwords

## Troubleshooting

### "NetworkError when attempting to fetch"
- Check backend URL is correct in frontend `.env.local`
- Verify backend is running and accessible
- Check CORS headers are being sent
- See [AUTH_TROUBLESHOOTING.md](AUTH_TROUBLESHOOTING.md)

### "Internal Server Error" on registration
- Check database is properly configured (see [DATABASE_SETUP.md](DATABASE_SETUP.md))
- Verify PostgreSQL is running on Render
- Check environment variables are set
- Review backend logs for detailed error

### Token expired
- User needs to log in again
- Implement refresh token endpoint for better UX (future enhancement)

### "Unauthorized" on protected endpoints
- Verify token is sent in Authorization header
- Format must be: `Bearer <token>`
- Check token hasn't expired (30 minutes)
- Verify token is valid

## Testing

### Test Signup
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test@12345",
    "full_name": "Test User"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@12345"
  }'
```

### Test Protected Endpoint
```bash
TOKEN="your-token-from-login"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/auth/me
```

## Future Enhancements

- [ ] Email verification
- [ ] Password reset flow
- [ ] Refresh tokens
- [ ] Multi-factor authentication
- [ ] OAuth integration (Google, GitHub)
- [ ] Rate limiting
- [ ] Audit logging
- [ ] Account deactivation
- [ ] API key management

## Support

For issues or questions:
1. Check [AUTH_TROUBLESHOOTING.md](AUTH_TROUBLESHOOTING.md)
2. Check [DATABASE_SETUP.md](DATABASE_SETUP.md)
3. Review backend logs on Render
4. Check browser console for frontend errors
