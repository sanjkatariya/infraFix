import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const selectRole = async (role: 'admin' | 'citizen') => {
    setIsLoading(true)
    // Simulate async loading
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Create mock user based on role
    const mockUser = {
      id: '1',
      email: role === 'admin' ? 'admin@infrafix.com' : 'citizen@infrafix.com',
      role,
      name: role === 'admin' ? 'Admin User' : 'Citizen User',
    }
    const mockToken = 'mock-jwt-token'
    
    login(mockUser, mockToken)
    navigate(role === 'admin' ? '/admin/dashboard' : '/citizen/dashboard')
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border shadow-lg w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl">🛠️</span>
          </div>
          <h1 className="text-3xl mb-2">InfraFix</h1>
          <p className="text-gray-600">Smart Infrastructure Management System</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => selectRole('admin')}
            disabled={isLoading}
            className="w-full h-20 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-3 text-lg disabled:opacity-50"
          >
            <span className="text-2xl">🛡️</span>
            Admin Portal
          </button>
          
          <button
            onClick={() => selectRole('citizen')}
            disabled={isLoading}
            className="w-full h-20 px-6 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 text-lg disabled:opacity-50"
          >
            <span className="text-2xl">👥</span>
            Citizen Portal
          </button>
        </div>
      </div>
    </div>
  )
}
