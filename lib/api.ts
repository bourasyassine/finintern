const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

class ApiService {
  private getAuthHeaders() {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth-token") : null
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Network error" }))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }
    return response.json()
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    return this.handleResponse(response)
  }

  async logout() {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async verifyToken() {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  // Leave Requests
  async getMyRequests() {
    const response = await fetch(`${API_BASE_URL}/leave-requests/my-requests`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async getAllRequests() {
    const response = await fetch(`${API_BASE_URL}/leave-requests`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async getPendingRequests() {
    const response = await fetch(`${API_BASE_URL}/leave-requests/pending`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async createLeaveRequest(requestData: {
    leaveType: string
    startDate: string
    endDate: string
    reason: string
    priority?: string
  }) {
    const response = await fetch(`${API_BASE_URL}/leave-requests`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        ...requestData,
        priority: requestData.priority || "NORMAL",
      }),
    })
    return this.handleResponse(response)
  }

  async approveRequest(requestId: string, comments?: string) {
    const response = await fetch(`${API_BASE_URL}/leave-requests/${requestId}/approve`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ comments: comments || "" }),
    })
    return this.handleResponse(response)
  }

  async rejectRequest(requestId: string, comments: string) {
    const response = await fetch(`${API_BASE_URL}/leave-requests/${requestId}/reject`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ comments }),
    })
    return this.handleResponse(response)
  }

  // Users
  async getUsers() {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async getUserById(userId: string) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  // Analytics (Next.js API)
  async getAnalytics() {
    const response = await fetch(`/api/analytics`, {
      // Ensure cookies are sent for middleware-protected route
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return this.handleResponse(response)
  }
}

export const apiService = new ApiService()
