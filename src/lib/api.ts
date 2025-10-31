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

// Auth API
export const authAPI = {
  login: (data: { email?: string; password?: string; role: 'admin' | 'citizen' }) => 
    api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
}

// Complaints API
export const complaintsAPI = {
  create: (data: any) => api.post('/complaints', data),
  getAll: (params?: { status?: string; category?: string; userId?: string }) => 
    api.get('/complaints', { params }),
  getById: (id: string) => api.get(`/complaints/${id}`),
  update: (id: string, data: any) => api.patch(`/complaints/${id}`, data),
  updateStatus: (id: string, status: string, progress?: number) => 
    api.patch(`/complaints/${id}/status`, { status, progress }),
  delete: (id: string) => api.delete(`/complaints/${id}`),
  getByUser: (userId: string) => api.get(`/complaints/user/${userId}`),
}

// Workorders API
export const workordersAPI = {
  getAll: (params?: { status?: string; crewId?: string; complaintId?: string }) => 
    api.get('/workorders', { params }),
  getById: (id: string) => api.get(`/workorders/${id}`),
  create: (data: any) => api.post('/workorders', data),
  update: (id: string, data: any) => api.patch(`/workorders/${id}`, data),
  updateStatus: (id: string, status: string, progress?: number) => 
    api.patch(`/workorders/${id}/status`, { status, progress }),
  delete: (id: string) => api.delete(`/workorders/${id}`),
  getByComplaint: (complaintId: string) => api.get(`/workorders/complaint/${complaintId}`),
}

// Crew API
export const crewAPI = {
  getAll: (params?: { status?: string; skill?: string }) => 
    api.get('/crew', { params }),
  getById: (id: string) => api.get(`/crew/${id}`),
  create: (data: any) => api.post('/crew', data),
  update: (id: string, data: any) => api.patch(`/crew/${id}`, data),
  updateStatus: (id: string, status: string, currentAssignment?: string) => 
    api.patch(`/crew/${id}/status`, { status, currentAssignment }),
  delete: (id: string) => api.delete(`/crew/${id}`),
  getAvailable: () => api.get('/crew/available/list'),
}

// Inventory API
export const inventoryAPI = {
  getAll: (params?: { category?: string; lowStock?: string }) => 
    api.get('/inventory', { params }),
  getById: (id: string) => api.get(`/inventory/${id}`),
  create: (data: any) => api.post('/inventory', data),
  update: (id: string, data: any) => api.patch(`/inventory/${id}`, data),
  updateStock: (id: string, quantity: number, action: 'add' | 'subtract' | 'set' = 'set') => 
    api.patch(`/inventory/${id}/stock`, { quantity, action }),
  delete: (id: string) => api.delete(`/inventory/${id}`),
  getByCategory: (category: string) => api.get(`/inventory/category/${category}`),
}

// Resources API
export const resourcesAPI = {
  getAll: (params?: { type?: string; status?: string }) => 
    api.get('/resources', { params }),
  getById: (id: string) => api.get(`/resources/${id}`),
  create: (data: any) => api.post('/resources', data),
  update: (id: string, data: any) => api.patch(`/resources/${id}`, data),
  assign: (id: string, assignedTo: string, workorderId?: string) => 
    api.patch(`/resources/${id}/assign`, { assignedTo, workorderId }),
  release: (id: string) => api.patch(`/resources/${id}/release`),
  delete: (id: string) => api.delete(`/resources/${id}`),
}

// Status API
export const statusAPI = {
  getComplaintStatus: (id: string) => api.get(`/status/complaint/${id}`),
  getWorkorderStatus: (id: string) => api.get(`/status/workorder/${id}`),
  getOverview: () => api.get('/status/overview'),
}

// Analytics API
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getStats: () => api.get('/analytics/stats'),
  getCategories: () => api.get('/analytics/categories'),
  getTrends: (days?: number) => api.get('/analytics/trends', { params: { days } }),
}

