import { type NextRequest, NextResponse } from "next/server"
import { mockLeaveRequests } from "@/lib/data"

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
    if (!decoded.permissions?.includes("approve_requests") && !decoded.permissions?.includes("approve_team_requests")) {
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
