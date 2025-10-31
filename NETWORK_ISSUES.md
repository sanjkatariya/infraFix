# Network Connectivity Issues

## 🔴 Current Problem

The proxy is working correctly, but it **cannot connect** to the API server at `9.61.3.174:8080`.

Error: `Proxy Error: connect ETIMEDOUT 9.61.3.174:8080`

This means:
- ✅ CORS is fixed (proxy is working)
- ❌ Network connectivity to API server is failing

## 🔍 Diagnostic Steps

### 1. Test API Server Accessibility

Open **Command Prompt** or **PowerShell** and test if the server is reachable:

```bash
# Test if server responds
curl http://9.61.3.174:8080/complains?email=test@example.com

# Or use ping (though this won't test port 8080)
ping 9.61.3.174
```

### 2. Check in Browser

Open directly in browser:
```
http://9.61.3.174:8080/complains?email=test@example.com
```

If this **doesn't work** in browser/Postman either, the server is:
- Down/not running
- Not accessible from your network
- Blocked by firewall

### 3. Common Causes

#### Server is Down
- API server might be stopped
- Contact backend team to verify server status

#### Network/Firewall
- Your network might block access to `9.61.3.174`
- Corporate firewall blocking outbound connections
- VPN might be required

#### Wrong IP/Port
- Verify the IP address `9.61.3.174:8080` is correct
- Check if port `8080` is the right port
- API might be on different port

#### Server Only Allows Local Access
- Server might only accept connections from `localhost`
- Server needs to bind to `0.0.0.0` not `127.0.0.1`

## ✅ Solutions

### Option 1: Verify Server is Running

Ask backend team:
1. Is the server running?
2. What IP and port should we use?
3. Can you access it from your location?

### Option 2: Use Different Endpoint

If server is on different address:
1. Update `.env` file:
   ```env
   VITE_USE_PROXY=true
   VITE_API_BASE_URL=http://CORRECT_IP:PORT
   ```

2. Update `vite.config.ts` proxy target:
   ```typescript
   proxy: {
     '/api-proxy': {
       target: 'http://CORRECT_IP:PORT',  // Update this
       // ...
     }
   }
   ```

3. Restart dev server

### Option 3: Use VPN or Network Access

If server requires VPN:
1. Connect to required VPN
2. Try again

### Option 4: Test with Postman

If Postman works:
- Note the exact URL used in Postman
- Verify it matches what we're using
- Check if Postman uses any special headers/proxy

### Option 5: Temporary Mock API

For development, you can use a mock API temporarily:

1. Create a simple Express server (in `server/` folder):
```javascript
// server/mock-api.js
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/complains', (req, res) => {
  res.json([]);
});

app.post('/complains', (req, res) => {
  console.log('Received complaint:', req.body);
  res.json({ success: true, id: 'MOCK-' + Date.now() });
});

app.listen(8081, () => {
  console.log('Mock API on http://localhost:8081');
});
```

2. Update `.env`:
```env
VITE_USE_PROXY=true
VITE_API_BASE_URL=http://localhost:8081
```

3. Update `vite.config.ts` proxy target to `http://localhost:8081`

## 📋 Checklist

- [ ] Can you ping `9.61.3.174`?
- [ ] Can you access `http://9.61.3.174:8080` in browser?
- [ ] Does Postman work? (What exact URL does it use?)
- [ ] Is VPN required?
- [ ] Is firewall blocking the connection?
- [ ] Is the API server actually running?
- [ ] Is the IP/port correct?

## 🆘 Still Not Working?

1. **Check with backend team:**
   - Server status
   - Correct endpoint URL
   - Network requirements (VPN, firewall rules)

2. **Check your network:**
   - Try from different network
   - Try from mobile hotspot
   - Check firewall settings

3. **Verify endpoint:**
   - Test in Postman with exact same URL
   - Check if any special authentication needed

## 📝 Note

Once network connectivity is established, the proxy setup is correct and will work. The issue is purely network-related, not code-related.

