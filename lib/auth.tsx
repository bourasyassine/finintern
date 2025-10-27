"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "employee" | "manager" | "hr"
  department: string
  annualLeaveBalance: number
  sickLeaveBalance: number
  permissions: string[]
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  loginAsDemo: (role: "employee" | "manager" | "hr") => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

function base64UrlEncode(obj: unknown): string {
  const json = JSON.stringify(obj)
  const base64 = typeof btoa === "function" ? btoa(unescape(encodeURIComponent(json))) : Buffer.from(json, "utf-8").toString("base64")
  return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
}

function base64UrlDecodeToJson(input: string): any | null {
  try {
    const base64 = input.replace(/-/g, "+").replace(/_/g, "/")
    const padded = base64 + "===".slice((base64.length + 3) % 4)
    const decoded = typeof atob === "function" ? atob(padded) : Buffer.from(padded, "base64").toString("binary")
    const bytes = typeof TextDecoder !== "undefined" ? Uint8Array.from(decoded, c => c.charCodeAt(0)) : decoded
    const json = typeof TextDecoder !== "undefined" ? new TextDecoder().decode(bytes as Uint8Array) : decoded
    return JSON.parse(json as string)
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const setToken = (token: string) => {
    localStorage.setItem("auth-token", token)
    document.cookie = `auth-token=${token}; path=/; SameSite=Strict${process.env.NODE_ENV === "production" ? "; Secure" : ""}`
  }

  const clearToken = () => {
    localStorage.removeItem("auth-token")
    document.cookie = "auth-token=; Max-Age=0; path=/; SameSite=Strict"
  }

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("auth-token")
      if (!token) {
        setIsLoading(false)
        return
      }

      const parts = token.split(".")
      if (parts.length !== 3) {
        clearToken()
        setIsLoading(false)
        return
      }

      const decoded = base64UrlDecodeToJson(parts[1])
      if (!decoded) {
        clearToken()
        setIsLoading(false)
        return
      }

      const storedUser = localStorage.getItem("auth-user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      clearToken()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.token) {
        setToken(data.token)
        const mappedUser = mapBackendUserToFrontend(data.user)
        setUser(mappedUser)
        localStorage.setItem("auth-user", JSON.stringify(mappedUser))

        if (mappedUser.role === "hr") {
          router.push("/hr-dashboard")
        } else {
          router.push("/employee-dashboard")
        }

        return { success: true }
      } else {
        return { success: false, error: data.error || "Login failed" }
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Network error occurred" }
    }
  }

  const loginAsDemo = async (role: "employee" | "manager" | "hr") => {
    try {
      const permissions = getPermissionsByRole(role)
      const mockUser = {
        id: "demo",
        email: `${role}@demo.local`,
        firstName: role === "hr" ? "Hélène" : role === "manager" ? "Marc" : "Emma",
        lastName: "Demo",
        role,
        department: role === "hr" ? "Human Resources" : role === "manager" ? "Engineering" : "Engineering",
        annualLeaveBalance: 25,
        sickLeaveBalance: 10,
        permissions,
      } as User

      const header = { alg: "none", typ: "JWT" }
      const payload = { userId: mockUser.id, email: mockUser.email, role: mockUser.role, permissions: mockUser.permissions }
      const token = `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.`

      setToken(token)
      setUser(mockUser)
      localStorage.setItem("auth-user", JSON.stringify(mockUser))

      return { success: true }
    } catch (error) {
      console.error("Demo login error:", error)
      return { success: false, error: "Unable to create demo session" }
    }
  }

  const logout = async () => {
    try {
      await fetch(`/api/auth/logout`, { method: "POST" })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      clearToken()
      setUser(null)
      localStorage.removeItem("auth-user")
      router.push("/login")
    }
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return user.permissions.includes(permission)
  }

  const mapBackendUserToFrontend = (backendUser: any): User => {
    const roleMap: { [key: string]: "employee" | "manager" | "hr" } = {
      EMPLOYEE: "employee",
      MANAGER: "manager",
      HR: "hr",
    }

    const permissions = getPermissionsByRole(roleMap[backendUser.role] || "employee")

    return {
      id: backendUser.id?.toString?.() || backendUser.id,
      email: backendUser.email,
      firstName: backendUser.firstName,
      lastName: backendUser.lastName,
      role: roleMap[backendUser.role] || backendUser.role,
      department: backendUser.department,
      annualLeaveBalance: backendUser.annualLeaveBalance || 25,
      sickLeaveBalance: backendUser.sickLeaveBalance || 10,
      permissions,
    }
  }

  const getPermissionsByRole = (role: string): string[] => {
    const permissions = {
      employee: ["view_own_requests", "create_request", "edit_profile"],
      manager: ["view_own_requests", "create_request", "edit_profile", "view_team_requests", "approve_team_requests"],
      hr: [
        "view_all_requests",
        "approve_requests",
        "reject_requests",
        "manage_employees",
        "view_analytics",
        "manage_teams",
      ],
    }
    return permissions[role as keyof typeof permissions] || permissions.employee
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, login, loginAsDemo, logout, isLoading, isAuthenticated, hasPermission }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
