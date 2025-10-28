# InfraFix Frontend - Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open http://localhost:5173

### 3. Build for Production
```bash
npm run build
npm run preview
```

## 📋 Project Overview

This is a **Progressive Web App (PWA)** built with:
- **React 19** + **TypeScript**
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first CSS
- **React Router** - Client-side routing
- **Zustand** - State management
- **React Query** - Server state management
- **Leaflet.js** - Maps
- **Recharts** - Charts/analytics

## 🏗️ Architecture

### Folder Structure
```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   └── Layout.tsx       # Main layout wrapper
├── pages/
│   ├── admin/          # Admin dashboard pages
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminWorkorders.tsx
│   │   └── AdminAnalytics.tsx
│   ├── citizen/        # Citizen pages
│   │   ├── CitizenDashboard.tsx
│   │   ├── CitizenComplaint.tsx
│   │   └── CitizenStatus.tsx
│   └── LoginPage.tsx
├── lib/
│   ├── api.ts          # API client & endpoints
│   └── utils.ts        # Utility functions
├── store/
│   └── authStore.ts    # Authentication state
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## 🔐 Authentication Flow

1. User logs in via `LoginPage.tsx`
2. Credentials validated (mock for now)
3. User data stored in Zustand store (persisted)
4. Protected routes check authentication
5. Role-based routing (Admin vs Citizen)

## 🌐 API Integration

### Current Setup
- Mock data is used for demo
- API client ready in `src/lib/api.ts`
- Endpoints configured for backend integration

### Backend Integration Steps

1. Update API base URL:
   ```typescript
   // src/lib/api.ts
   const API_BASE_URL = 'http://your-backend-url/api'
   ```

2. Create `.env` file:
   ```
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

3. Update API calls to use real endpoints:
   - `/api/complaints` - Create/get complaints
   - `/api/workorders` - Manage workorders
   - `/api/analytics` - Dashboard data

## 📱 PWA Features

### Service Worker
- Auto-registered via `vite-plugin-pwa`
- Caches app assets for offline use
- Background sync ready

### Manifest
- App name: "InfraFix"
- Theme color: Primary blue (#0ea5e9)
- Display: Standalone
- Icons: 192x192, 512x512 (add to public/)

### Install Prompt
- Automatic on supported browsers
- "Add to Home Screen" functionality

## 🎨 UI Components

### Available Components (shadcn/ui style)
- `Button` - Primary actions
- `Card` - Content containers
- `Input` - Form inputs

### Styling
- TailwindCSS utility classes
- Primary color: Blue (#0ea5e9)
- Responsive design (mobile-first)

## 🔄 State Management

### Zustand Store (`authStore.ts`)
- User authentication state
- Persisted to localStorage
- Auto-hydrates on page load

### React Query
- Server state caching
- Automatic refetching
- Loading/error states

## 🗺️ Maps Integration

### Leaflet.js Setup
- Interactive map for location selection
- Geocoding support
- Marker placement
- Current location detection

### Usage in CitizenComplaint
- Click map to select location
- Use "Current Location" button
- GPS coordinates captured

## 📊 Analytics Dashboard

### Charts (Recharts)
- Bar charts - Complaint volume
- Line charts - Resolution trends
- Pie charts - Priority distribution

### Data Sources
- Mock data currently
- Ready for API integration
- Auto-refresh capability

## 🚢 Deployment

### Netlify
```bash
npm run build
# Deploy dist/ folder
```

### Vercel
```bash
vercel --prod
```

### Environment Variables
Set `VITE_API_BASE_URL` in deployment platform

## 🐛 Common Issues

### Build Errors
- Check TailwindCSS config
- Verify PostCSS setup
- Ensure all dependencies installed

### PWA Not Working
- Ensure HTTPS (required for service worker)
- Check manifest.json exists
- Verify service worker registration

### Maps Not Loading
- Check Leaflet CSS imported
- Verify marker icon paths
- Ensure network access

## 📝 Next Steps

1. **Backend Integration**
   - Connect to IBM watsonx Orchestrate
   - Implement real API endpoints
   - Add authentication middleware

2. **Enhanced Features**
   - Push notifications
   - Background sync
   - Offline form submission
   - Image upload to storage

3. **Testing**
   - Unit tests (Vitest)
   - E2E tests (Playwright)
   - PWA testing (Lighthouse)

4. **Performance**
   - Code splitting
   - Lazy loading
   - Image optimization

## 📚 Resources

- [Vite Docs](https://vite.dev)
- [React Router](https://reactrouter.com)
- [TailwindCSS](https://tailwindcss.com)
- [PWA Guide](https://web.dev/progressive-web-apps/)
- [Leaflet Docs](https://leafletjs.com)

