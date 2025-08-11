import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verify } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Define protected routes and their required permissions
const protectedRoutes = {
  "/hr": ["view_all_requests", "approve_requests"],
  "/hr-dashboard": ["view_all_requests"],
  "/employee": ["view_own_requests"],
  "/employee-dashboard": ["view_own_requests"],
  "/api/leave-requests": ["view_own_requests"],
  "/api/analytics": ["view_analytics"],
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname === "/" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/logout")
  ) {
    return NextResponse.next()
  }

  // Check if route is protected
  const protectedRoute = Object.keys(protectedRoutes).find((route) => pathname.startsWith(route))

  if (protectedRoute) {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      const decoded = verify(token, JWT_SECRET) as any
      const requiredPermissions = protectedRoutes[protectedRoute as keyof typeof protectedRoutes]

      // Check if user has required permissions
      const hasPermission = requiredPermissions.some((permission) => decoded.permissions?.includes(permission))

      if (!hasPermission) {
        // Redirect based on user role
        if (decoded.role === "hr") {
          return NextResponse.redirect(new URL("/hr-dashboard", request.url))
        } else {
          return NextResponse.redirect(new URL("/employee-dashboard", request.url))
        }
      }
    } catch (error) {
      console.error("Token verification failed:", error)
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
