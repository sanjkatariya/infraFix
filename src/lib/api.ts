import axios from 'axios'

// Use proxy in development, direct URL in production
const USE_PROXY = import.meta.env.DEV && import.meta.env.VITE_USE_PROXY === 'true'
export const API_BASE_URL = USE_PROXY 
  ? '/api-proxy'  // Use Vite proxy to avoid CORS
  : (import.meta.env.VITE_API_BASE_URL || 'https://application-27.225wzs8oba88.us-east.codeengine.appdomain.cloud')

// Log configuration on startup
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:')
  console.log('  Using Proxy:', USE_PROXY)
  console.log('  API Base URL:', API_BASE_URL)
  console.log('  VITE_USE_PROXY:', import.meta.env.VITE_USE_PROXY)
  console.log('  VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
  if (!USE_PROXY && import.meta.env.DEV) {
    console.warn('⚠️  CORS issues? Set VITE_USE_PROXY=true in .env file to use proxy')
  }
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
  // Allow credentials if needed
  withCredentials: false,
})

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  // Important: Don't modify Content-Type for FormData - browser needs to set boundary
  if (config.data instanceof FormData) {
    // Remove Content-Type header to let browser set it automatically with boundary
    delete config.headers['Content-Type']
  }
  
  // Log request in development
  if (import.meta.env.DEV) {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      baseURL: config.baseURL,
      params: config.params,
      data: config.data instanceof FormData ? `FormData (${Array.from(config.data.entries()).length} entries)` : config.data,
      contentType: config.headers['Content-Type'],
    })
  }
  
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      })
    }
    return response
  },
  (error) => {
    // Enhanced error logging
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('❌ Network Error - Possible causes:')
      console.error('1. CORS issue - API server needs to allow requests from this origin')
      console.error('2. API server is not accessible from this network')
      console.error('3. Firewall blocking the connection')
      console.error('4. API server might be down')
      console.error(`API URL: ${error.config?.baseURL || API_BASE_URL}`)
      console.error(`Request URL: ${error.config?.url}`)
      console.error(`Full URL: ${error.config?.baseURL}${error.config?.url}`)
      console.error(`Origin: ${window.location.origin}`)
      
      // Suggest using proxy
      if (!USE_PROXY && import.meta.env.DEV) {
        console.warn('💡 Tip: Try using Vite proxy by setting VITE_USE_PROXY=true in .env')
      }
    }
    
    if (error.code === 'ECONNABORTED') {
      console.error('❌ Request timeout - Server took too long to respond')
    }
    
    if (error.response) {
      // Server responded with error status
      console.error(`❌ API Error ${error.response.status}:`, error.response.data)
    }
    
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
  // Create complaint with multipart/form-data
  create: (formData: FormData) => {
    // Verify FormData has file before sending
    const hasFile = Array.from(formData.entries()).some(([_, value]) => value instanceof File);
    if (!hasFile) {
      console.warn('⚠️ FormData does not contain a file!');
    }
    
    // Log FormData contents
    console.log('📦 FormData contents:');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}:`, `File(${value.name}, ${value.type}, ${value.size} bytes)`);
      } else {
        console.log(`  ${key}:`, value);
      }
    }
    
    // Use direct axios.post to ensure FormData is sent as multipart/form-data
    // NOT as JSON body - this is critical for file uploads
    // Don't use the api instance which has default JSON headers
    return axios.post(
      `${API_BASE_URL}/complains`,
      formData,
      {
        // CRITICAL: Do NOT set Content-Type header - let browser/axios set it automatically
        // When you pass FormData, axios will automatically:
        // 1. Detect it's FormData
        // 2. Set Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...
        // 3. Send it as form-data, NOT as JSON body
        headers: {
          // Explicitly remove any Content-Type so browser can set it with boundary
          // OR just don't include Content-Type at all
        },
        timeout: 60000, // 60 seconds for file upload
        maxContentLength: Infinity, // No limit on content length
        maxBodyLength: Infinity, // No limit on body length
      }
    )
  },
  // Get complaints by email
  getByEmail: (email: string) => 
    api.get(`/complains/email/${encodeURIComponent(email)}`, { 
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    }),
  // Legacy endpoints (for local development)
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
