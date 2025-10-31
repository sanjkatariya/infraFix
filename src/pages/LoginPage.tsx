import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { complaintsAPI } from '@/lib/api'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [showEmailInput, setShowEmailInput] = useState(false)
  const [emailError, setEmailError] = useState('')
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleCitizenLogin = async () => {
    if (!showEmailInput) {
      // First click - show email input
      setShowEmailInput(true)
      return
    }

    // Validate email
    if (!email.trim()) {
      setEmailError('Please enter your email address')
      return
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    setEmailError('')

    try {
      // Fetch complaints by email
      const response = await complaintsAPI.getByEmail(email)
      const complaints = response.data || []
      
      // Create user object
      const user = {
        id: email,
        email: email,
        role: 'citizen' as const,
        name: email.split('@')[0],
        complaints: complaints,
      }
      
      const token = `token-${Date.now()}`
      
      login(user, token)
      navigate('/citizen/dashboard')
    } catch (error: any) {
      // If API fails or returns error, still allow login but with empty complaints
      console.error('Error fetching complaints:', error)
      const user = {
        id: email,
        email: email,
        role: 'citizen' as const,
        name: email.split('@')[0],
        complaints: [],
      }
      const token = `token-${Date.now()}`
      
      login(user, token)
      navigate('/citizen/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const selectRole = async (role: 'admin' | 'citizen') => {
    if (role === 'citizen') {
      handleCitizenLogin()
      return
    }

    // Admin login (unchanged)
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const mockUser = {
      id: '1',
      email: 'admin@infrafix.com',
      role,
      name: 'Admin User',
    }
    const mockToken = 'mock-jwt-token'
    
    login(mockUser, mockToken)
    navigate('/admin/dashboard')
    setIsLoading(false)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setEmailError('')
  }

  const handleBack = () => {
    setShowEmailInput(false)
    setEmail('')
    setEmailError('')
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
        
        {!showEmailInput ? (
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
              onClick={handleCitizenLogin}
              disabled={isLoading}
              className="w-full h-20 px-6 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 text-lg disabled:opacity-50"
            >
              <span className="text-2xl">👥</span>
              Citizen Portal
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Your Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="your.email@example.com"
                disabled={isLoading}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                autoFocus
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-600">{emailError}</p>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleBack}
                disabled={isLoading}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handleCitizenLogin}
                disabled={isLoading || !email.trim()}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading...' : 'Continue'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
