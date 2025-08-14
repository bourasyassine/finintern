import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

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

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/")
  if (typeof atob === "function") {
    // Edge runtime
    const decoded = atob(base64)
    // Convert binary string to UTF-8
    const bytes = Uint8Array.from(decoded, c => c.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  }
  // Node fallback
  // @ts-ignore
  return Buffer.from(base64, "base64").toString("utf-8")
}

function decodeJwtPayload(token: string): any | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const payload = parts[1]
    const json = base64UrlDecode(payload)
    return JSON.parse(json)
  } catch {
    return null
  }
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

    // Best-effort decode without verifying signature (verification happens in server routes)
    const decoded = decodeJwtPayload(token)
    if (!decoded) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

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
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
