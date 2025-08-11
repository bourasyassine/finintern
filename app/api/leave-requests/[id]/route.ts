import { type NextRequest, NextResponse } from "next/server"
import { mockLeaveRequests } from "@/lib/data"
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

// GET - Get specific request
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const decoded = verifyToken(request)
    const requestId = params.id

    const leaveRequest = mockLeaveRequests.find((req) => req.id === requestId)
    if (!leaveRequest) {
      return NextResponse.json({ success: false, error: "Demande non trouvée" }, { status: 404 })
    }

    // Check permissions
    if (decoded.role === "employee" && leaveRequest.employeeId !== decoded.userId) {
      return NextResponse.json({ success: false, error: "Accès non autorisé" }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      request: leaveRequest,
    })
  } catch (error) {
    console.error("Get request error:", error)
    return NextResponse.json({ success: false, error: "Accès non autorisé" }, { status: 401 })
  }
}

// PATCH - Update request (approve/reject)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const decoded = verifyToken(request)
    const requestId = params.id
    const { action, rejectionReason } = await request.json()

    // Check if user has permission to approve/reject
    if (!decoded.permissions.includes("approve_requests") && !decoded.permissions.includes("approve_team_requests")) {
      return NextResponse.json({ success: false, error: "Permission insuffisante" }, { status: 403 })
    }

    const leaveRequest = mockLeaveRequests.find((req) => req.id === requestId)
    if (!leaveRequest) {
      return NextResponse.json({ success: false, error: "Demande non trouvée" }, { status: 404 })
    }

    // Update request status
    if (action === "approve") {
      leaveRequest.status = "approved"
      leaveRequest.approvedBy = decoded.userId
      leaveRequest.approvedAt = new Date().toISOString()
    } else if (action === "reject") {
      if (!rejectionReason) {
        return NextResponse.json({ success: false, error: "Raison de rejet requise" }, { status: 400 })
      }
      leaveRequest.status = "rejected"
      leaveRequest.rejectionReason = rejectionReason
      leaveRequest.rejectedBy = decoded.userId
      leaveRequest.rejectedAt = new Date().toISOString()
    } else {
      return NextResponse.json({ success: false, error: "Action invalide" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      request: leaveRequest,
    })
  } catch (error) {
    console.error("Update request error:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de la mise à jour" }, { status: 500 })
  }
}
