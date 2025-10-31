# Proxy Setup Guide - Fix CORS Issues

## 🚨 Current Issue
You're getting `ERR_CONNECTION_TIMED_OUT` because the browser is blocking cross-origin requests (CORS).

## ✅ Quick Fix - Use Vite Proxy

### Step 1: Create `.env` file

Create a file named `.env` in the **root directory** (same level as `package.json`):

```env
VITE_USE_PROXY=true
VITE_API_BASE_URL=http://9.61.3.174:8080
```

### Step 2: Restart Dev Server

**IMPORTANT:** You MUST restart the dev server for `.env` changes to take effect!

1. **Stop the current server** (Ctrl+C in terminal)
2. **Start it again:**
   ```bash
   npm run dev
   ```

### Step 3: Verify Proxy is Working

After restart, check the browser console. You should see:
```
🔧 API Configuration:
  Using Proxy: true
  API Base URL: /api-proxy
```

When you make requests, you should see proxy logs:
```
📤 [Proxy] POST /complains → 9.61.3.174:8080/complains
📥 [Proxy] 200 POST /complains
```

## 🔍 Verify It's Working

1. **Check Network Tab:**
   - Open DevTools → Network tab
   - Make a request
   - The request URL should be: `http://localhost:5173/api-proxy/complains`
   - NOT: `http://9.61.3.174:8080/complains`

2. **Check Console:**
   - Look for `[Proxy]` logs
   - Should NOT see `ERR_CONNECTION_TIMED_OUT`

## 🐛 Troubleshooting

### Issue: Still seeing direct API calls
**Solution:**
- Make sure `.env` file is in root directory
- Make sure `VITE_USE_PROXY=true` (not quotes, just `true`)
- **Restart dev server** (Ctrl+C then `npm run dev`)

### Issue: Proxy not working
**Check:**
1. Is Vite server running on port 5173?
2. Check `vite.config.ts` has proxy configuration
3. Check console for proxy error messages

### Issue: Still getting timeout
**Possible causes:**
1. API server `9.61.3.174:8080` is not accessible from your machine
2. Firewall blocking connection
3. API server is down

**Test API directly:**
```bash
curl http://9.61.3.174:8080/complains?email=test@example.com
```

If curl works but browser doesn't, it's definitely CORS.

## 📝 File Upload (FormData) Fix

The code now correctly handles FormData:
- **Don't** set `Content-Type` header manually
- Browser automatically sets `multipart/form-data` with boundary
- File should upload correctly through proxy

## 🔄 After Proxy Works

Once proxy is working:
1. ✅ File uploads should work
2. ✅ GET requests should work
3. ✅ No more CORS errors
4. ✅ No more timeout errors

## ⚠️ Important Notes

- **Proxy only works in development** (`npm run dev`)
- **For production**, you need to:
  1. Fix CORS on backend server
  2. OR deploy both frontend and backend on same domain
  3. OR use a reverse proxy (nginx, etc.)

## 📞 Still Having Issues?

1. **Check `.env` file exists** in root directory
2. **Check `VITE_USE_PROXY=true`** (exactly like this, no quotes)
3. **Restart dev server** completely
4. **Check console logs** for proxy messages
5. **Try clearing browser cache** and hard refresh (Ctrl+Shift+R)

