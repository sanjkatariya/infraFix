# InfraFix - Frontend (PWA)

AI-powered citizen complaint management system built with React + Vite + PWA.

## 🚀 Features

- **Progressive Web App (PWA)** - Installable, offline-capable
- **Dual Interface** - Separate Admin and Citizen views
- **Real-time Maps** - Leaflet.js integration for location selection
- **Analytics Dashboard** - Recharts for data visualization
- **Responsive Design** - TailwindCSS + shadcn/ui components
- **TypeScript** - Full type safety

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn

## 🛠️ Installation

```bash
cd frontend
npm install
```

## 🏃 Running the App

### Development Mode
```bash
npm run dev
```
Open http://localhost:5173

### Production Build
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/          # Reusable UI components (Button, Card, Input)
│   │   └── Layout.tsx   # Main layout with sidebar navigation
│   ├── pages/
│   │   ├── admin/       # Admin pages (Dashboard, Workorders, Analytics)
│   │   ├── citizen/     # Citizen pages (Dashboard, Complaint, Status)
│   │   └── LoginPage.tsx
│   ├── lib/
│   │   ├── api.ts       # API client and endpoints
│   │   └── utils.ts     # Utility functions
│   ├── store/
│   │   └── authStore.ts # Zustand state management
│   ├── App.tsx          # Main app with routing
│   └── main.tsx         # Entry point
├── public/              # Static assets
├── vite.config.ts       # Vite + PWA configuration
└── tailwind.config.js   # TailwindCSS configuration
```

## 🔐 Authentication

The app uses role-based authentication:
- **Admin**: Access to dashboard, workorders, and analytics
- **Citizen**: Access to complaint submission and status tracking

Demo mode: Use any email/password to login (no real backend required)

## 🌐 API Integration

Update the API base URL in `src/lib/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
```

Create a `.env` file:
```
VITE_API_BASE_URL=http://your-backend-url/api
```

## 📱 PWA Features

- **Offline Support**: Service worker caches app assets
- **Install Prompt**: Add to home screen on mobile/desktop
- **Background Sync**: Queue requests when offline
- **Push Notifications**: Ready for Web Push API integration

## 🎨 UI Components

Built with:
- **TailwindCSS** - Utility-first CSS
- **shadcn/ui** - High-quality React components
- **Lucide React** - Icon library
- **Recharts** - Charts and graphs
- **Leaflet** - Interactive maps

## 🔄 State Management

- **Zustand** - Lightweight state management
- **React Query** - Server state and caching
- **React Router** - Client-side routing

## 📊 Admin Features

- Dashboard with complaint statistics
- Workorder management
- Analytics and reporting
- Crew assignment

## 👥 Citizen Features

- File complaints with photo + location
- Track complaint status
- View update timeline
- Location-based issue reporting

## 🚢 Deployment

### Netlify/Vercel
```bash
npm run build
# Deploy dist/ folder
```

### Environment Variables
Set `VITE_API_BASE_URL` in your deployment platform

## 📝 License

MIT
