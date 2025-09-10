import Cookies from "js-cookie"
import { authAPI } from "./api"

export interface User {
  id: string
  email: string
  name: string
  role: string
  companyId?: string
  company?: any
}

export interface Customer {
  id: string
  name: string
  document: string
  companyId: string
  company?: any
}

export const auth = {
  // Admin/Employee login
  async login(email: string, password: string, companyCode?: string) {
    try {
      const response = await authAPI.login(email, password, companyCode)
      const { access_token, user } = response.data

      Cookies.set("auth_token", access_token, { expires: 7 })
      Cookies.set("user_data", JSON.stringify(user), { expires: 7 })

      return { success: true, user }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao fazer login",
      }
    }
  },

  // Client login
  async clientLogin(document: string, verificationCode: string) {
    try {
      const response = await authAPI.clientLogin(document, verificationCode)
      const { access_token, customer } = response.data

      Cookies.set("auth_token", access_token, { expires: 7 })
      Cookies.set("user_data", JSON.stringify({ ...customer, role: "CLIENT" }), { expires: 7 })

      return { success: true, customer }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao fazer login",
      }
    }
  },

  // Get current user
  getCurrentUser(): User | Customer | null {
    try {
      const userData = Cookies.get("user_data")
      return userData ? JSON.parse(userData) : null
    } catch {
      return null
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!Cookies.get("auth_token")
  },

  // Check user role
  hasRole(role: string): boolean {
    const user = this.getCurrentUser()
    return user?.role === role
  },

  // Check if user is admin or higher
  isAdmin(): boolean {
    const user = this.getCurrentUser()
    return ["SUPERADMIN", "ADMIN", "MANAGER"].includes(user?.role || "")
  },

  // Check if user is client
  isClient(): boolean {
    return this.hasRole("CLIENT")
  },

  // Logout
  logout() {
    Cookies.remove("auth_token")
    Cookies.remove("user_data")
    window.location.href = "/"
  },

  // Check if company plan is active
  isCompanyActive(): boolean {
    const user = this.getCurrentUser()
    if (!user || user.role === "SUPERADMIN") return true

    return user.company?.isActive === true
  },
}
