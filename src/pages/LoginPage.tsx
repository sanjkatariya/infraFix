import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'admin' | 'citizen'>('citizen')
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Mock login - replace with actual API call
    setTimeout(() => {
      const mockUser = {
        id: '1',
        email,
        role,
        name: role === 'admin' ? 'Admin User' : 'Citizen User',
      }
      const mockToken = 'mock-jwt-token'
      
      login(mockUser, mockToken)
      navigate(role === 'admin' ? '/admin/dashboard' : '/citizen/dashboard')
      setLoading(false)
    }, 500)
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary-600">InfraFix</CardTitle>
          <CardDescription>AI-Powered Citizen Complaint Management</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Login As
              </label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={role === 'citizen' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setRole('citizen')}
                >
                  Citizen
                </Button>
                <Button
                  type="button"
                  variant={role === 'admin' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setRole('admin')}
                >
                  Admin
                </Button>
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            
            <p className="text-xs text-center text-gray-500 mt-4">
              Demo Mode: Use any email/password to login
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

