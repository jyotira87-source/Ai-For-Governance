# Next Steps: Fixing Auth on Production

## Current Issue
The auth endpoints return "Internal Server Error" on Render because **SQLite database doesn't persist on Render's ephemeral filesystem**.

## Solution: Use PostgreSQL

Follow these steps to fix auth:

### Step 1: Create PostgreSQL Database
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "PostgreSQL"
3. Configure:
   - Name: `polisai-db`
   - Database: `polisai`
   - User: `polisai_user`
   - Region: `us-east-1` (same as backend)
4. Click Create
5. Wait 2-3 minutes for provisioning

### Step 2: Get Connection URL
1. Open your new PostgreSQL database
2. Copy the **Internal Database URL**
3. Format: `postgresql://user:password@hostname:5432/dbname`

### Step 3: Update Backend Environment
1. Go to your **backend service** on Render
2. Click Settings → Environment
3. Add/Update:
   - **Key**: `DATABASE_URL`
   - **Value**: `[paste the URL from Step 2]`
4. Click Save
5. Render will auto-redeploy (3-5 minutes)

### Step 4: Verify It Works
```bash
# After redeployment, test:
curl https://ai-for-governance.onrender.com/debug/db

# Should return:
# {"status":"connected","user_count":0,"database_url":"postgresql://..."}
```

### Step 5: Test Auth
```bash
# Try signup
curl -X POST https://ai-for-governance.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test@12345",
    "full_name": "Test User"
  }'

# Should return 201 with user info (not 500 error)
```

## Expected Timeline
- PostgreSQL creation: 2-3 minutes
- Backend redeployment: 3-5 minutes
- **Total: 5-8 minutes**

## Testing Full Auth Flow
After PostgreSQL is set up:
1. Visit https://ai-for-governance.vercel.app
2. Click Sign Up
3. Fill form and submit
4. Should redirect to dashboard
5. Your account is saved!

## If Still Failing
1. Check Render logs for detailed error
2. Verify PostgreSQL is "Available" status
3. Verify DATABASE_URL is set (no typos)
4. Try curl command to /debug/db endpoint
5. Check backend has redeployed

## Documentation
- Full setup guide: [DATABASE_SETUP.md](DATABASE_SETUP.md)
- Auth documentation: [AUTH_README.md](AUTH_README.md)
- Troubleshooting: [AUTH_TROUBLESHOOTING.md](AUTH_TROUBLESHOOTING.md)

## Need Help?
1. Check DATABASE_SETUP.md for detailed instructions
2. Review your Render logs for error messages
3. Verify PostgreSQL database is running
4. Ensure DATABASE_URL environment variable matches PostgreSQL URL
