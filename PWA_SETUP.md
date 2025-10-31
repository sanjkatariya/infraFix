# PWA Setup Guide for InfraFix

This guide will help you set up the Progressive Web App (PWA) functionality for InfraFix, allowing users to install the app on their desktop and mobile devices.

## 📋 Prerequisites

- Node.js installed
- npm or yarn package manager

## 🎨 Step 1: Generate PWA Icons

The PWA requires icon files in different sizes. You have two options:

### Option A: Using the Icon Generator Script (Recommended)

1. Install the required dependency:
   ```bash
   npm install --save-dev sharp
   ```

2. Run the icon generator:
   ```bash
   npm run generate-icons
   ```

This will generate all required icon files from `public/icon.svg`:
- `pwa-64x64.png`
- `pwa-192x192.png`
- `pwa-512x512.png`
- `apple-touch-icon.png`
- `favicon.png`

### Option B: Manual Icon Creation

If you prefer to create icons manually:

1. Use an image editor (like Figma, Photoshop, or online tools)
2. Create icons in the following sizes and save them in the `public/` folder:
   - `pwa-64x64.png` (64x64 pixels)
   - `pwa-192x192.png` (192x192 pixels) 
   - `pwa-512x512.png` (512x512 pixels)
   - `apple-touch-icon.png` (180x180 pixels for iOS)

3. The icons should have:
   - A clear, recognizable design representing InfraFix
   - Good contrast for visibility on different backgrounds
   - Rounded corners (optional but recommended)

## 🔧 Step 2: Build the Application

Build the application with PWA support:

```bash
npm run build
```

This will:
- Generate the service worker
- Create the web manifest
- Include all PWA assets

## 🚀 Step 3: Test the PWA

### Testing Locally

1. Start a local server to test the PWA:
   ```bash
   npm run preview
   ```

2. Open your browser and navigate to `http://localhost:4173`

3. Check the browser console for any PWA-related errors

### Testing Installation

#### Desktop (Chrome/Edge):
1. Look for the install icon in the address bar (usually appears after visiting the site)
2. Or look for an install prompt/banner
3. Click "Install" to add to desktop

#### Mobile (Android):
1. Open Chrome browser
2. Visit the site
3. Tap the menu (three dots)
4. Select "Add to Home Screen" or "Install App"

#### iOS (Safari):
1. Open Safari browser
2. Visit the site
3. Tap the Share button
4. Scroll down and tap "Add to Home Screen"
5. Customize the name if needed and tap "Add"

## 📱 PWA Features

Once installed, the app includes:

- **Offline Support**: Basic caching for faster loading
- **App-like Experience**: Runs in standalone mode (no browser UI)
- **Quick Access**: App shortcuts for common actions
- **Auto-updates**: App updates automatically when new version is deployed

## 🛠️ Configuration

PWA settings are configured in `vite.config.ts`:

- **Manifest**: App name, icons, theme colors, display mode
- **Service Worker**: Caching strategies, offline support
- **Install Prompt**: Automatic detection and user prompts

## 🔍 Troubleshooting

### Icons not showing:
- Ensure all icon files exist in the `public/` folder
- Check that file names match exactly (case-sensitive)
- Verify file formats are PNG

### Install prompt not appearing:
- Service worker must be registered (check in DevTools > Application > Service Workers)
- App must be served over HTTPS (or localhost)
- User must visit the site multiple times (browser behavior)

### Service worker issues:
- Clear browser cache and reload
- Check browser console for errors
- Verify `vite-plugin-pwa` is installed correctly

## 📚 Additional Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [MDN: Web App Manifests](https://developer.mozilla.org/en-US/docs/Web/Manifest)

## ✅ Checklist

- [ ] Icons generated and placed in `public/` folder
- [ ] Build completed successfully (`npm run build`)
- [ ] Service worker registered (check DevTools)
- [ ] Install prompt appears on supported browsers
- [ ] App installs successfully on desktop
- [ ] App installs successfully on mobile
- [ ] Offline functionality works (after initial load)

---

**Note**: For production deployment, ensure your hosting supports HTTPS, as PWAs require a secure connection (except for localhost during development).

