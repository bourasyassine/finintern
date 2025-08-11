import { type NextRequest, NextResponse } from "next/server"
import { mockEmployees } from "@/lib/data"
import { sign } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email et mot de passe requis" }, { status: 400 })
    }

    // Find user
    const user = mockEmployees.find((emp) => emp.email === email)
    if (!user) {
      return NextResponse.json({ success: false, error: "Utilisateur non trouvé" }, { status: 401 })
    }

    // Mock password validation (in real app, use bcrypt)
    if (password.length < 6) {
      return NextResponse.json({ success: false, error: "Mot de passe incorrect" }, { status: 401 })
    }

    // Determine user role and permissions
    let role = "employee"
    let permissions = ["view_own_requests", "create_request", "edit_profile"]

    if (user.department === "Human Resources") {
      role = "hr"
      permissions = [
        "view_all_requests",
        "approve_requests",
        "reject_requests",
        "manage_employees",
        "view_analytics",
        "manage_teams",
      ]
    } else if (user.position.toLowerCase().includes("manager")) {
      role = "manager"
      permissions = [
        "view_own_requests",
        "create_request",
        "edit_profile",
        "view_team_requests",
        "approve_team_requests",
      ]
    }

    const userWithRole = {
      ...user,
      role,
      permissions,
    }

    // Create JWT token
    const token = sign(
      {
        userId: user.id,
        email: user.email,
        role,
        permissions,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    )

    // Create response with httpOnly cookie
    const response = NextResponse.json({
      success: true,
      user: userWithRole,
      token,
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 24 hours
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 })
  }
}
