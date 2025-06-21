import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for file uploads
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth headers here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 413) {
      error.message = 'File too large. Please choose a smaller file.'
    } else if (error.response?.status === 400) {
      error.message = error.response.data?.detail || 'Invalid request'
    } else if (error.response?.status === 404) {
      error.message = 'File not found'
    } else if (error.response?.status >= 500) {
      error.message = 'Server error. Please try again later.'
    } else {
      error.message = error.response?.data?.detail || 'An error occurred'
    }
    return Promise.reject(error)
  }
)

// API functions
export const fileApi = {
  // Upload file
  upload: async (file: File, description?: string) => {
    const formData = new FormData()
    formData.append('file', file)
    if (description) {
      formData.append('description', description)
    }
    
    const response = await api.post('/api/v1/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Get files list
  getFiles: async (page = 1, perPage = 20) => {
    const response = await api.get('/api/v1/files', {
      params: { page, per_page: perPage },
    })
    return response.data
  },

  // Get file info
  getFile: async (fileId: string) => {
    const response = await api.get(`/api/v1/files/${fileId}`)
    return response.data
  },

  // Download file
  download: async (fileId: string) => {
    const response = await api.get(`/api/v1/download/${fileId}`, {
      responseType: 'blob',
    })
    return response.data
  },

  // Delete file
  delete: async (fileId: string) => {
    const response = await api.delete(`/api/v1/files/${fileId}`)
    return response.data
  },

  // Get stats
  getStats: async () => {
    const response = await api.get('/api/v1/stats')
    return response.data
  },
} 