export type UserRole = "employee" | "hr" | "manager"

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  department: string
  position: string
  avatar?: string
  permissions: string[]
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  error?: string
  user?: User
}
