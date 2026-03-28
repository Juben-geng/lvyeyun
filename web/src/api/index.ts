import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000
})

// 请求拦截器 - 添加 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lvyeyun_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lvyeyun_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  login: (data: { email?: string; password?: string; wechatCode?: string }) =>
    api.post('/auth/login', data),
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile')
}

export const agentApi = {
  getAgents: () => api.get('/agents'),
  chat: (agent: string, message: string) =>
    api.post('/chat', { agent, message })
}

export const cmsApi = {
  getConfig: () => api.get('/cms/config'),
  getNavigation: () => api.get('/cms/navigation'),
  getPage: (id: string) => api.get(`/cms/pages/${id}`)
}

export const itineraryApi = {
  list: () => api.get('/itinerary'),
  create: (data: any) => api.post('/itinerary', data),
  update: (id: string, data: any) => api.put(`/itinerary/${id}`, data),
  delete: (id: string) => api.delete(`/itinerary/${id}`)
}

export const miniappApi = {
  getInfo: () => api.get('/miniapp/info'),
  chat: (message: string, sessionId?: string) =>
    api.post('/miniapp/chat', { message, sessionId })
}

export default api
