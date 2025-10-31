# Network Diagnostic Guide

## 🔴 Current Issue

**Error:** `connect ETIMEDOUT 9.61.3.174:8080`

The proxy is working, but **cannot connect** to the API server.

## 🔍 Diagnostic Steps

### Step 1: Test Server Connectivity

**In PowerShell:**
```powershell
Test-NetConnection -ComputerName 9.61.3.174 -Port 8080
```

**Or in Command Prompt:**
```cmd
telnet 9.61.3.174 8080
```

**Or test with curl:**
```bash
curl -v http://9.61.3.174:8080/complains?email=test@example.com
```

### Step 2: Check Postman Configuration

In Postman, when the request works:

1. **What exact URL are you using?**
   - Is it exactly `http://9.61.3.174:8080/complains`?
   - Or something different?

2. **Check Postman Settings:**
   - Go to Postman → Settings → Proxy
   - Is there a proxy configured?
   - What proxy settings?

3. **Check Request Details:**
   - In Postman, go to the request
   - Click "Code" (bottom right)
   - Select "cURL" - what does it show?
   - Copy the exact cURL command

### Step 3: Compare Network Access

**Test 1: Direct Browser Access**
```
Open browser → http://9.61.3.174:8080/complains?email=test@example.com
```
Does this work?

**Test 2: Node.js/NPM can reach it?**
```bash
node -e "require('http').get('http://9.61.3.174:8080/complains?email=test@example.com', (r) => console.log(r.statusCode)).on('error', console.error)"
```

## 🛠️ Possible Solutions

### Solution 1: Postman Uses Proxy

If Postman has proxy settings:

1. **Get Postman's proxy:**
   - Settings → Proxy
   - Note the proxy host/port

2. **Configure Vite to use same proxy:**
   Update `vite.config.ts` proxy to forward through Postman's proxy, or:
   - Set system HTTP_PROXY environment variable
   - Or configure axios to use proxy

### Solution 2: Different Endpoint

If Postman uses different URL:

1. **Update `vite.config.ts`:**
   ```typescript
   proxy: {
     '/api-proxy': {
       target: 'http://ACTUAL_IP:PORT', // Use Postman's URL
       // ...
     }
   }
   ```

2. **Update `.env`:**
   ```env
   VITE_API_BASE_URL=http://ACTUAL_IP:PORT
   ```

### Solution 3: Server Requires VPN

If server needs VPN:

1. **Connect to required VPN**
2. **Test again**

### Solution 4: Network/Firewall Issue

1. **Check Windows Firewall:**
   - Allow Node.js through firewall
   - Allow outbound connections

2. **Check Corporate Firewall:**
   - May need IT to whitelist `9.61.3.174:8080`

3. **Try Different Network:**
   - Mobile hotspot
   - Different WiFi
   - Test if accessibility changes

### Solution 5: Server Binding Issue

Server might only accept `localhost` connections:

1. **Check if server is accessible from your IP**
2. **Ask backend team to bind to `0.0.0.0` instead of `127.0.0.1`**

## 📋 Quick Checklist

- [ ] Can you `ping 9.61.3.174`?
- [ ] Can you access `http://9.61.3.174:8080` in browser?
- [ ] Does `curl` work?
- [ ] What exact URL does Postman use?
- [ ] Does Postman use a proxy?
- [ ] Is VPN required?
- [ ] Can backend team confirm server is running?
- [ ] Can backend team confirm server is accessible?

## 🔧 Alternative: Use Postman's cURL Command

If Postman works, get the exact cURL command:

1. In Postman → Click "Code"
2. Select "cURL"
3. Copy the command
4. Run it in terminal
5. If it works, we can replicate those exact settings

## 📞 Next Steps

1. **Test server connectivity** (commands above)
2. **Compare Postman settings** with our configuration
3. **Check with backend team:**
   - Server status
   - Network requirements
   - Correct endpoint URL

---

**Note:** This is a network/infrastructure issue, not a code issue. Once connectivity is established, the proxy and file upload will work correctly.

