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
  logout: () => void
  isLoading: boolean
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("auth-token")
      if (!token) {
        setIsLoading(false)
        return
      }

      // Verify token with backend
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const userData = await response.json()
        const mapped = mapBackendUserToFrontend(userData.user)
        setUser(mapped)
        localStorage.setItem("auth-user-id", mapped.id)
      } else {
        localStorage.removeItem("auth-token")
        localStorage.removeItem("auth-user-id")
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      localStorage.removeItem("auth-token")
      localStorage.removeItem("auth-user-id")
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
        localStorage.setItem("auth-token", data.token)
        const mappedUser = mapBackendUserToFrontend(data.user)
        setUser(mappedUser)
        localStorage.setItem("auth-user-id", mappedUser.id)

        // Redirect based on role
        if (mappedUser.role === "hr") {
          router.push("/hr-dashboard")
        } else {
          router.push("/employee-dashboard")
        }

        return { success: true }
      } else {
        return { success: false, error: data.message || "Login failed" }
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Network error occurred" }
    }
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem("auth-token")
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("auth-token")
      localStorage.removeItem("auth-user-id")
      setUser(null)
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
      id: backendUser.id.toString(),
      email: backendUser.email,
      firstName: backendUser.firstName,
      lastName: backendUser.lastName,
      role: roleMap[backendUser.role] || "employee",
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

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasPermission }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
