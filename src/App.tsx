import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminWorkorders from './pages/admin/AdminWorkorders'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import CitizenComplaint from './pages/citizen/CitizenComplaint'
import CitizenStatus from './pages/citizen/CitizenStatus'
import CitizenDashboard from './pages/citizen/CitizenDashboard'
import InstallPrompt from './components/InstallPrompt'

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode, requiredRole?: 'admin' | 'citizen' }) {
  const { isAuthenticated, user } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/citizen/dashboard'} replace />
  }
  
  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <InstallPrompt />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><Layout /></ProtectedRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="workorders" element={<AdminWorkorders />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>
        
        <Route path="/citizen" element={<ProtectedRoute requiredRole="citizen"><Layout /></ProtectedRoute>}>
          <Route path="dashboard" element={<CitizenDashboard />} />
          <Route path="complaint" element={<CitizenComplaint />} />
          <Route path="status" element={<CitizenStatus />} />
        </Route>
        
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
