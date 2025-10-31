# Quick Fix Guide

## 🔴 Current Issue

**Error:** `Proxy Error: connect ETIMEDOUT 9.61.3.174:8080`

This means:
- ✅ Proxy is working (code is correct)
- ❌ **Cannot connect to API server**

## ✅ Quick Diagnostic

### Step 1: Test if API Server is Reachable

Open **Command Prompt** or **PowerShell**:

```bash
# Test connection
curl http://9.61.3.174:8080/complains?email=test@example.com

# Or ping the server
ping 9.61.3.174
```

**If this fails:**
- Server is not accessible from your network
- Server might be down
- Firewall is blocking

### Step 2: Test in Browser

Open directly:
```
http://9.61.3.174:8080/complains?email=test@example.com
```

**If this fails:** Same issues as above.

### Step 3: Compare with Postman

In Postman, when it works:
1. **What exact URL are you using?**
2. **Any special headers?**
3. **Any proxy settings in Postman?**

## 🛠️ Solutions

### Solution 1: Verify Server is Running

Contact backend team:
- Is server running?
- Can they access it?
- What's the correct endpoint?

### Solution 2: Check Network Access

1. **Try from different network:**
   - Mobile hotspot
   - Different WiFi
   - VPN connection

2. **Check firewall:**
   - Windows Firewall
   - Corporate firewall
   - Antivirus blocking

### Solution 3: Update API Endpoint

If Postman uses different URL:

1. Update `.env`:
   ```env
   VITE_USE_PROXY=true
   VITE_API_BASE_URL=http://CORRECT_IP:PORT
   ```

2. Update `vite.config.ts`:
   ```typescript
   target: 'http://CORRECT_IP:PORT',  // Change this
   ```

3. Restart dev server

### Solution 4: Use Postman's Exact Settings

If Postman works:
1. Check Postman's **Proxy** settings
2. Check **Headers** - any special ones?
3. Replicate in code

## 📋 Checklist

- [ ] Can you access `http://9.61.3.174:8080` in browser?
- [ ] Does `curl` command work?
- [ ] Is Postman using same URL?
- [ ] Is VPN required?
- [ ] Is server actually running?
- [ ] Check firewall/network settings

## 🆘 If Nothing Works

The issue is **network connectivity**, not code. You need to:

1. **Verify server is accessible:**
   - Test from command line
   - Test from browser
   - Compare with Postman

2. **Get correct endpoint:**
   - Ask backend team
   - Check if different IP/port
   - Check if requires VPN

3. **Check network:**
   - Try different network
   - Check firewall rules
   - Verify server allows your IP

## 📝 Note

The code and proxy setup are correct. The issue is purely network-related. Once you can connect to the server, everything will work.

