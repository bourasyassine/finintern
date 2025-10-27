import { type NextRequest, NextResponse } from "next/server"
import { mockLeaveRequests, mockEmployees } from "@/lib/data"

export const dynamic = "force-dynamic"

function decodeJwtPayload(token: string): any | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const payload = parts[1]
    const decoded = Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8")
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

// Helper function to verify JWT token
function verifyToken(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value
  if (!token) {
    throw new Error("Token manquant")
  }

  const decoded = decodeJwtPayload(token)
  if (!decoded) {
    throw new Error("Token invalide")
  }
  return decoded
}

// GET - Fetch leave requests
export async function GET(request: NextRequest) {
  try {
    const decoded = verifyToken(request)
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const employeeId = searchParams.get("employeeId")

    let requests = [...mockLeaveRequests]

    // Filter based on user role
    if (decoded.role === "employee") {
      // Employees can only see their own requests
      requests = requests.filter((req) => req.employeeId === decoded.userId)
    } else if (decoded.role === "manager") {
      // Managers can see their team's requests (simplified logic)
      const managerDept = mockEmployees.find((emp) => emp.id === decoded.userId)?.department
      const teamEmployees = mockEmployees.filter((emp) => emp.department === managerDept)
      const teamIds = teamEmployees.map((emp) => emp.id)
      requests = requests.filter((req) => teamIds.includes(req.employeeId))
    }
    // HR can see all requests (no filtering)

    // Apply additional filters
    if (status && status !== "all") {
      requests = requests.filter((req) => req.status === status)
    }

    if (employeeId) {
      requests = requests.filter((req) => req.employeeId === employeeId)
    }

    // Add employee details to requests
    const requestsWithEmployees = requests.map((request) => {
      const employee = mockEmployees.find((emp) => emp.id === request.employeeId)
      return {
        ...request,
        employee: employee
          ? {
              firstName: employee.firstName,
              lastName: employee.lastName,
              department: employee.department,
              position: employee.position,
            }
          : null,
      }
    })

    return NextResponse.json({
      success: true,
      requests: requestsWithEmployees,
    })
  } catch (error) {
    console.error("Get requests error:", error)
    return NextResponse.json({ success: false, error: "Accès non autorisé" }, { status: 401 })
  }
}

// POST - Create new leave request
export async function POST(request: NextRequest) {
  try {
    const decoded = verifyToken(request)
    const requestData = await request.json()

    // Validate required fields
    const { type, startDate, endDate, reason } = requestData
    if (!type || !startDate || !endDate || !reason) {
      return NextResponse.json({ success: false, error: "Tous les champs sont requis" }, { status: 400 })
    }

    // Validate dates
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (start >= end) {
      return NextResponse.json(
        { success: false, error: "La date de fin doit être après la date de début" },
        { status: 400 },
      )
    }

    // Create new request
    const newRequest = {
      id: (mockLeaveRequests.length + 101).toString(),
      employeeId: decoded.userId,
      type,
      startDate,
      endDate,
      reason,
      status: "pending" as const,
      submittedAt: new Date().toISOString().split("T")[0],
      priority: requestData.priority || "normal",
    }

    mockLeaveRequests.push(newRequest)

    // Add employee details for response
    const employee = mockEmployees.find((emp) => emp.id === decoded.userId)
    const requestWithEmployee = {
      ...newRequest,
      employee: employee
        ? {
            firstName: employee.firstName,
            lastName: employee.lastName,
            department: employee.department,
            position: employee.position,
          }
        : null,
    }

    return NextResponse.json({
      success: true,
      request: requestWithEmployee,
    })
  } catch (error) {
    console.error("Create request error:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de la création de la demande" }, { status: 500 })
  }
}
