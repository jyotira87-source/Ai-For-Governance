# Database Setup Guide for PolisAI

## Issue: "Internal Server Error" on Auth Endpoints

The primary issue is that **SQLite doesn't persist on Render's ephemeral filesystem**. When the service restarts or redeploys, the SQLite database file (`polisai.db`) is lost, causing registration failures.

## Solution: Use PostgreSQL

### Step 1: Create PostgreSQL Database on Render

1. Log in to [Render.com](https://render.com)
2. Go to your dashboard
3. Click "New +" → "PostgreSQL"
4. Fill in the form:
   - **Name**: `polisai-db` (or any name)
   - **Database**: `polisai`
   - **User**: `polisai_user`
   - **Region**: Same as your backend service (e.g., `us-east-1`)
   - **PostgreSQL Version**: Keep default (latest)
5. Click "Create Database"
6. Wait for provisioning (2-3 minutes)

### Step 2: Get PostgreSQL Connection String

1. After creation, click on your PostgreSQL database
2. Find the "External Database URL" section
3. Copy the **Internal Database URL** (use for same-region connection)
4. It will look like: `postgresql://user:password@hostname:5432/dbname`

### Step 3: Update Backend Environment Variables

1. Go to your backend service on Render
2. Click "Settings" → "Environment"
3. Add/Update the following:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the PostgreSQL URL from Step 2
4. Click "Save Changes"
5. Render will automatically redeploy the backend

### Step 4: Verify Database Connection

After redeployment (2-3 minutes), test the database endpoint:

```bash
curl https://your-backend-url.onrender.com/debug/db
```

Expected response:
```json
{
  "status": "connected",
  "user_count": 0,
  "database_url": "postgresql://user:password@..."
}
```

If you see an error, check:
- PostgreSQL is running on Render
- DATABASE_URL environment variable is set correctly
- Backend has redeployed after setting the variable

## Local Development

For local development, SQLite is fine and works automatically. No configuration needed.

## Testing Auth After Database Setup

```bash
# Test registration
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@12345",
    "username": "testuser",
    "full_name": "Test User"
  }'

# Test login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@12345"
  }'
```

## Troubleshooting

### "Connection refused" or "Can't connect to database"
- Verify PostgreSQL database is running on Render
- Check DATABASE_URL is correct
- Ensure backend has redeployed after setting environment variable

### "Internal Server Error" on auth endpoints
- Check backend logs on Render for detailed error messages
- Try the `/debug/db` endpoint to verify database connectivity
- Verify database user has proper permissions

### Still seeing SQLite errors
- Make sure DATABASE_URL is set (not using default SQLite)
- Wait for backend redeployment to complete (check Render logs)
- Clear browser cache and localStorage to force fresh connection

## Migration Path

If you already have data in SQLite locally:

1. Export data from SQLite:
   ```bash
   sqlite3 backend/polisai.db ".dump" > backup.sql
   ```

2. Import to PostgreSQL:
   ```bash
   psql YOUR_POSTGRESQL_URL < backup.sql
   ```

3. Verify data exists:
   ```bash
   curl https://your-backend-url.onrender.com/debug/db
   ```

## Next Steps

After database is working:
1. Test full signup flow on frontend
2. Verify login works and token is stored
3. Check dashboard loads correctly
4. Test policy analysis saves to database
