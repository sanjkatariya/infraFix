# CORS Issue Fix Guide

If you're getting `ERR_CONNECTION_TIMED_OUT` or `Network Error` but Postman works, it's likely a **CORS (Cross-Origin Resource Sharing)** issue.

## 🔍 Problem
- ✅ Postman works - Requests succeed
- ❌ Browser fails - `ERR_CONNECTION_TIMED_OUT` or `ERR_NETWORK`

This happens because browsers enforce CORS policies, while Postman doesn't.

## 🛠️ Solution Options

### Option 1: Use Vite Proxy (Recommended for Development)

This bypasses CORS by proxying requests through the Vite dev server.

1. **Create `.env` file** in the root directory:
   ```env
   VITE_USE_PROXY=true
   VITE_API_BASE_URL=http://9.61.3.174:8080
   ```

2. **Restart dev server:**
   ```bash
   npm run dev
   ```

3. The app will now use `/api-proxy/complains` which Vite will proxy to `http://9.61.3.174:8080/complains`

### Option 2: Fix CORS on Backend (Recommended for Production)

Ask your backend team to add CORS headers to allow requests from your frontend:

**For Express.js backend:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://yourdomain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'multipart/form-data'],
}));
```

**For Flask (Python):**
```python
from flask_cors import CORS

CORS(app, resources={
    r"/complains": {
        "origins": ["http://localhost:5173", "http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})
```

**Manual CORS headers:**
```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // In production, use specific domain
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
```

### Option 3: Disable CORS in Browser (Development Only - Not Recommended)

⚠️ **Warning: Only for development, not production!**

**Chrome:**
```bash
chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security --disable-features=VizDisplayCompositor
```

**Better: Use a CORS browser extension:**
- Chrome: "CORS Unblock" or "Allow CORS"
- Firefox: "CORS Everywhere"

## 🔍 Debugging Steps

1. **Check Network Tab:**
   - Open DevTools (F12)
   - Go to Network tab
   - Try the request
   - Check the failed request:
     - Status code?
     - Response headers?
     - Error message?

2. **Check Console:**
   - Look for detailed error logs (now enhanced in the code)
   - Check for CORS-related errors

3. **Verify API is Accessible:**
   ```bash
   curl http://9.61.3.174:8080/complains?email=test@example.com
   ```

4. **Check Request Headers:**
   Compare browser request headers with Postman:
   - Are they the same?
   - Any missing headers?
   - Content-Type correct?

## 📋 Current Configuration

- **API Base URL:** `http://9.61.3.174:8080`
- **Endpoint:** `/complains`
- **Method:** GET (for fetch), POST (for create)
- **Content-Type:** `multipart/form-data` (for POST with file)

## ✅ Test After Fix

1. **Login with email** - Should fetch complaints
2. **Submit complaint** - Should upload file and create complaint
3. **Check Network tab** - Should see successful requests (200 status)

## 🚨 Common Issues

### Issue: Still getting timeout
- Check if API server is running
- Check network connectivity
- Verify firewall isn't blocking
- Try accessing API URL directly in browser

### Issue: 404 Not Found
- Verify endpoint path: `/complains` not `/complaints`
- Check API base URL

### Issue: 415 Unsupported Media Type
- Check Content-Type header
- For file upload, browser should set `multipart/form-data` with boundary
- Don't manually set Content-Type for FormData

### Issue: 500 Internal Server Error
- Check API server logs
- Verify file size limits
- Check required fields

## 📞 Need Help?

If none of these work, provide:
1. Browser console errors
2. Network tab screenshot
3. Backend server logs
4. Backend CORS configuration

