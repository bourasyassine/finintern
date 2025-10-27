import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define protected routes and their allowed roles
const protectedRoutes: Record<string, Array<"employee" | "manager" | "hr">> = {
	"/hr": ["hr", "manager"],
	"/hr-dashboard": ["hr", "manager"],
	"/employee": ["employee"],
	"/employee-dashboard": ["employee"],
	"/api/leave-requests": ["employee", "manager", "hr"],
	"/api/analytics": ["hr", "manager"],
}

function base64UrlDecode(input: string): string {
	const base64 = input.replace(/-/g, "+").replace(/_/g, "/")
	if (typeof atob === "function") {
		const decoded = atob(base64)
		const bytes = Uint8Array.from(decoded, (c) => c.charCodeAt(0))
		return new TextDecoder().decode(bytes)
	}
	// @ts-ignore Node fallback for local builds
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

		const decoded = decodeJwtPayload(token)
		if (!decoded) {
			return NextResponse.redirect(new URL("/login", request.url))
		}

		const roleLower = String(decoded.role || "").toLowerCase()
		const allowedRoles = protectedRoutes[protectedRoute as keyof typeof protectedRoutes]

		if (!allowedRoles.includes(roleLower as any)) {
			// Redirect based on role
			if (roleLower === "hr" || roleLower === "manager") {
				return NextResponse.redirect(new URL("/hr-dashboard", request.url))
			}
			return NextResponse.redirect(new URL("/employee-dashboard", request.url))
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
