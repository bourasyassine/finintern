"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import type { UserRole } from "@/lib/auth-types"

interface RouteGuardProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  requireAuth?: boolean
  redirectTo?: string
}

export function RouteGuard({ children, allowedRoles = [], requireAuth = true, redirectTo }: RouteGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    // Check if authentication is required
    if (requireAuth && !isAuthenticated) {
      router.push("/login")
      return
    }

    // Check role-based access
    if (isAuthenticated && allowedRoles.length > 0 && user) {
      const hasPermission = allowedRoles.includes(user.role)

      if (!hasPermission) {
        // Redirect based on user role
        const defaultRedirect = user.role === "hr" || user.role === "manager" ? "/hr-dashboard" : "/employee-dashboard"

        router.push(redirectTo || defaultRedirect)
        return
      }
    }
  }, [isAuthenticated, isLoading, user, router, allowedRoles, requireAuth, redirectTo])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Vérification des autorisations...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated and auth is required
  if (requireAuth && !isAuthenticated) {
    return null
  }

  // Don't render if user doesn't have required role
  if (isAuthenticated && allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
