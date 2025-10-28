import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const complaintsAPI = {
  create: (data: FormData) => api.post('/complaints', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAll: () => api.get('/complaints'),
  getById: (id: string) => api.get(`/complaints/${id}`),
  updateStatus: (id: string, status: string) => api.patch(`/complaints/${id}/status`, { status }),
}

export const workordersAPI = {
  getAll: () => api.get('/workorders'),
  getById: (id: string) => api.get(`/workorders/${id}`),
  create: (data: any) => api.post('/workorders', data),
  update: (id: string, data: any) => api.patch(`/workorders/${id}`, data),
}

export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getStats: () => api.get('/analytics/stats'),
}

