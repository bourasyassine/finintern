import { type NextRequest, NextResponse } from "next/server"
import { mockLeaveRequests, mockEmployees } from "@/lib/data"
import { verify } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

function verifyToken(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value
  if (!token) {
    throw new Error("Token manquant")
  }

  try {
    return verify(token, JWT_SECRET) as any
  } catch (error) {
    throw new Error("Token invalide")
  }
}

export async function GET(request: NextRequest) {
  try {
    const decoded = verifyToken(request)

    // Check if user has analytics permission
    if (!decoded.permissions.includes("view_analytics")) {
      return NextResponse.json({ success: false, error: "Permission insuffisante" }, { status: 403 })
    }

    // Calculate analytics
    const totalRequests = mockLeaveRequests.length
    const pendingRequests = mockLeaveRequests.filter((req) => req.status === "pending").length
    const approvedRequests = mockLeaveRequests.filter((req) => req.status === "approved").length
    const rejectedRequests = mockLeaveRequests.filter((req) => req.status === "rejected").length

    // Department statistics
    const departmentStats = mockEmployees.reduce(
      (acc, employee) => {
        const dept = employee.department
        if (!acc[dept]) {
          acc[dept] = {
            totalEmployees: 0,
            totalRequests: 0,
            approvedRequests: 0,
            pendingRequests: 0,
          }
        }

        acc[dept].totalEmployees++

        const employeeRequests = mockLeaveRequests.filter((req) => req.employeeId === employee.id)
        acc[dept].totalRequests += employeeRequests.length
        acc[dept].approvedRequests += employeeRequests.filter((req) => req.status === "approved").length
        acc[dept].pendingRequests += employeeRequests.filter((req) => req.status === "pending").length

        return acc
      },
      {} as Record<string, any>,
    )

    // Monthly trends (last 6 months)
    const monthlyTrends = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      const monthRequests = mockLeaveRequests.filter((req) => req.submittedAt.startsWith(monthKey))

      monthlyTrends.push({
        month: date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
        requests: monthRequests.length,
        approved: monthRequests.filter((req) => req.status === "approved").length,
        rejected: monthRequests.filter((req) => req.status === "rejected").length,
      })
    }

    // Leave type distribution
    const leaveTypes = mockLeaveRequests.reduce(
      (acc, req) => {
        acc[req.type] = (acc[req.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return NextResponse.json({
      success: true,
      analytics: {
        overview: {
          totalRequests,
          pendingRequests,
          approvedRequests,
          rejectedRequests,
          approvalRate: totalRequests > 0 ? Math.round((approvedRequests / totalRequests) * 100) : 0,
        },
        departmentStats,
        monthlyTrends,
        leaveTypes,
      },
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ success: false, error: "Accès non autorisé" }, { status: 401 })
  }
}
