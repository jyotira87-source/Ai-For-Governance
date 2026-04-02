# Auth Troubleshooting Guide

## 🔍 Common Issues & Solutions

### **Issue 1: "Email or username already registered" error on signup**
**Cause:** Trying to register with an email/username that already exists
**Solution:** 
- Use a different email address
- Clear the database: `rm backend/polisai.db`
- Or check if user actually exists in the database

### **Issue 2: Login returns 404 or "Not Found"**
**Cause:** Backend API is not running or endpoint path is wrong
**Solution:**
```bash
# Check backend is running
curl http://localhost:8000/health

# Verify endpoint exists
curl -i http://localhost:8000/auth/login
```

### **Issue 3: "Invalid email or password" after signup**
**Cause:** Password hash not being stored correctly or password verification failing
**Solution:**
- Verify bcrypt is installed: `python3 -c "import bcrypt; print('OK')"`
- Check password meets requirements (no special restrictions)
- Ensure database is saving the hashed password correctly

### **Issue 4: Login works but dashboard redirect fails**
**Cause:** Token not being stored or retrieved correctly
**Solution:**
1. Open browser DevTools (F12)
2. Go to "Application" → "Local Storage"
3. Check for `polisai:token` and `polisai:user` entries
4. Verify token value is not empty

### **Issue 5: "Authorization failed" or 401 errors**
**Cause:** Bearer token format is incorrect
**Solution:**
- Ensure header is: `Authorization: Bearer <token>`
- Token should be in localStorage
- Clear browser cache and retry

### **Issue 6: CORS errors in browser**
**Cause:** Frontend and backend on different URLs/ports
**Solution:**
- Verify `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Backend must have CORS enabled (it does by default)
- Check network tab in DevTools for actual error

---

## 🧪 Test Auth Manually

### **Test Registration:**
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "full_name": "Test User"
  }'
```

Expected Response:
```json
{
  "id": 1,
  "email": "test@example.com",
  "username": "testuser",
  "full_name": "Test User",
  "created_at": "2026-04-02T..."
}
```

### **Test Login:**
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Expected Response:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

### **Test Get User (with token from login):**
```bash
curl -X GET http://localhost:8000/auth/me \
  -H "Authorization: Bearer <TOKEN_FROM_LOGIN>"
```

---

## 📊 Debug Frontend Issues

### **Check browser console:**
1. Open Developer Tools (F12)
2. Go to "Console" tab
3. Look for any error messages
4. You should see auth logs like:
   - "Attempting login with: ..."
   - "Login successful"
   - "Attempting registration with: ..."

### **Check Network tab:**
1. Go to "Network" tab
2. Try signup/login
3. Look for requests to `/auth/register` and `/auth/login`
4. Check response status and body

### **Clear all data:**
```javascript
// In browser console:
localStorage.clear()
sessionStorage.clear()
location.reload()
```

---

## 🔧 Fix Checklist

- [ ] Backend is running: `curl http://localhost:8000/health` returns 200
- [ ] Frontend is running: Can access `http://localhost:3000`
- [ ] `.env.local` files are configured correctly
- [ ] Database exists or auto-creates: `ls backend/polisai.db`
- [ ] No CORS errors in browser console
- [ ] Token is being saved to localStorage
- [ ] Passwords meet requirements (6+ chars)
- [ ] Email format is valid

---

## 🚀 If Still Not Working

**Step 1:** Check backend console for errors
```bash
cd backend
python3 -m uvicorn main:app --port 8000
# Look for any error messages
```

**Step 2:** Test API endpoint directly
```bash
curl -v -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"test","password":"pass123"}'
```

**Step 3:** Check database
```bash
cd backend
python3 -c "
from database import SessionLocal, User
db = SessionLocal()
users = db.query(User).all()
print(f'Total users: {len(users)}')
for u in users:
    print(f'  - {u.username}: {u.email}')
"
```

**Step 4:** Verify imports and syntax
```bash
cd backend
python3 -c "from main import app; print('Backend OK')"
cd ../frontend
npm run build 2>&1 | head -20
```

---

## 📝 Report with Details

If issues persist, provide:
1. Error message from browser console
2. HTTP status code from failed request
3. Response body of failed request
4. Which exact step fails (signup/login/redirect)
5. Output from `curl` tests above
