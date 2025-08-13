"use server"

import { apiService } from "./api"
import { redirect } from "next/navigation"

export async function signIn(email: string, password: string) {
  try {
    const response = await apiService.login(email, password)
    return {
      success: true,
      user: response.user,
      token: response.token,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Login failed",
    }
  }
}

export async function signOut() {
  try {
    await apiService.logout()
  } catch (error) {
    console.error("Logout error:", error)
  }
  redirect("/login")
}

export async function submitLeaveRequest(requestData: {
  leaveType: string
  startDate: string
  endDate: string
  reason: string
  priority?: string
}) {
  try {
    const response = await apiService.createLeaveRequest(requestData)
    return { success: true, request: response }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to submit request",
    }
  }
}

export async function approveRequest(requestId: string, comments?: string) {
  try {
    const response = await apiService.approveRequest(requestId, comments)
    return { success: true, request: response }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to approve request",
    }
  }
}

export async function rejectRequest(requestId: string, comments: string) {
  try {
    const response = await apiService.rejectRequest(requestId, comments)
    return { success: true, request: response }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to reject request",
    }
  }
}

export async function getLeaveRequests(type: "my" | "all" | "pending" = "my") {
  try {
    let response
    switch (type) {
      case "all":
        response = await apiService.getAllRequests()
        break
      case "pending":
        response = await apiService.getPendingRequests()
        break
      default:
        response = await apiService.getMyRequests()
    }
    return { success: true, requests: response }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch requests",
    }
  }
}
