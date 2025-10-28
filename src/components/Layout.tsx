import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, FileText, BarChart3, PlusCircle, CheckCircle, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'

export default function Layout() {
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const isAdmin = user?.role === 'admin'
  
  const adminNav = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/workorders', label: 'Workorders', icon: FileText },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ]
  
  const citizenNav = [
    { path: '/citizen/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/citizen/complaint', label: 'File Complaint', icon: PlusCircle },
    { path: '/citizen/status', label: 'Track Status', icon: CheckCircle },
  ]
  
  const navItems = isAdmin ? adminNav : citizenNav
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">InfraFix</h1>
              <span className="ml-2 text-sm text-gray-500">{isAdmin ? 'Admin' : 'Citizen'}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">{user?.name || user?.email}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex">
        {/* Sidebar */}
        <aside className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-64 bg-white shadow-sm min-h-[calc(100vh-4rem)] border-r`}>
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

