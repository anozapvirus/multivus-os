import axios from "axios"
import Cookies from "js-cookie"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("auth_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("auth_token")
      Cookies.remove("user_data")
      window.location.href = "/"
    }
    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  login: (email: string, password: string, companyCode?: string) =>
    api.post("/auth/login", { email, password, companyCode }),

  clientLogin: (document: string, verificationCode: string) =>
    api.post("/auth/client/login", { document, verificationCode }),

  register: (data: any) => api.post("/auth/register", data),

  getProfile: () => api.get("/auth/profile"),
}

// Companies API
export const companiesAPI = {
  getAll: () => api.get("/companies"),
  getById: (id: string) => api.get(`/companies/${id}`),
  create: (data: any) => api.post("/companies", data),
  update: (id: string, data: any) => api.put(`/companies/${id}`, data),
  toggleStatus: (id: string) => api.patch(`/companies/${id}/toggle-status`),
}

// Work Orders API
export const workOrdersAPI = {
  getAll: (params?: any) => api.get("/work-orders", { params }),
  getById: (id: string) => api.get(`/work-orders/${id}`),
  create: (data: any) => api.post("/work-orders", data),
  update: (id: string, data: any) => api.put(`/work-orders/${id}`, data),
  delete: (id: string) => api.delete(`/work-orders/${id}`),

  // Client specific
  getClientOrders: (params?: any) => api.get("/work-orders/client", { params }),
  approveBudget: (id: string) => api.post(`/work-orders/${id}/approve-budget`),
  rejectBudget: (id: string, reason: string) => api.post(`/work-orders/${id}/reject-budget`, { reason }),
}

// Customers API
export const customersAPI = {
  getAll: (params?: any) => api.get("/customers", { params }),
  getById: (id: string) => api.get(`/customers/${id}`),
  create: (data: any) => api.post("/customers", data),
  update: (id: string, data: any) => api.put(`/customers/${id}`, data),
  delete: (id: string) => api.delete(`/customers/${id}`),
}

// Plans API
export const plansAPI = {
  getAll: () => api.get("/plans"),
  getById: (id: string) => api.get(`/plans/${id}`),
  create: (data: any) => api.post("/plans", data),
  update: (id: string, data: any) => api.put(`/plans/${id}`, data),
  delete: (id: string) => api.delete(`/plans/${id}`),
}

// Notifications API
export const notificationsAPI = {
  getAll: (params?: any) => api.get("/notifications", { params }),
  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),
  sendVerificationCode: (phone: string) => api.post("/notifications/send-verification", { phone }),
}
