"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"

export default function Home() {
  const { isAuthenticated, user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login")
      } else if (user) {
        // Redirect based on user role
        switch (user.role) {
          case "hr":
          case "manager":
            router.push("/hr-dashboard")
            break
          case "employee":
            router.push("/employee-dashboard")
            break
          default:
            router.push("/login")
        }
      }
    }
  }, [isAuthenticated, isLoading, router, user])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Redirection en cours...</p>
        </div>
      </div>
    )
  }

  return null
}
