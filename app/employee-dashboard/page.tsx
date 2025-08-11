"use client"

import { useState } from "react"
import { Plus, Calendar, Clock, TrendingUp, AlertCircle, FileText } from "lucide-react"
import EmployeeLayout from "@/components/layouts/employee-layout"
import MobileCard from "@/components/mobile-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RouteGuard } from "@/components/auth/route-guard"
import { mockLeaveRequests } from "@/lib/data"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"

function EmployeeDashboardContent() {
  const { user } = useAuth()
  const router = useRouter()
  const [userRequests] = useState(mockLeaveRequests.filter((req) => req.employeeId === (user?.id || "1")))

  const leaveBalance = {
    annual: { used: 8, total: 25 },
    sick: { used: 2, total: 10 },
    personal: { used: 1, total: 5 },
  }

  const pendingRequests = userRequests.filter((req) => req.status === "pending").length
  const upcomingLeave = userRequests.filter(
    (req) => req.status === "approved" && new Date(req.startDate) > new Date(),
  ).length

  return (
    <EmployeeLayout activeTab="home">
      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <div className="text-center py-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-blue-600">
              {user?.firstName?.[0] || "U"}
              {user?.lastName?.[0] || "U"}
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Bonjour, {user?.firstName || "Utilisateur"} !</h2>
          <p className="text-gray-600">{user?.department || "Département"}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <MobileCard className="p-4" interactive>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{pendingRequests}</p>
                <p className="text-sm text-gray-600">En attente</p>
              </div>
            </div>
          </MobileCard>

          <MobileCard className="p-4" interactive>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{upcomingLeave}</p>
                <p className="text-sm text-gray-600">À venir</p>
              </div>
            </div>
          </MobileCard>
        </div>

        {/* Leave Balance */}
        <MobileCard className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Solde de Congés
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Congés Annuels</span>
                <span className="text-sm text-gray-600">
                  {leaveBalance.annual.used}/{leaveBalance.annual.total} jours
                </span>
              </div>
              <Progress value={(leaveBalance.annual.used / leaveBalance.annual.total) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Congés Maladie</span>
                <span className="text-sm text-gray-600">
                  {leaveBalance.sick.used}/{leaveBalance.sick.total} jours
                </span>
              </div>
              <Progress value={(leaveBalance.sick.used / leaveBalance.sick.total) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Congés Personnels</span>
                <span className="text-sm text-gray-600">
                  {leaveBalance.personal.used}/{leaveBalance.personal.total} jours
                </span>
              </div>
              <Progress value={(leaveBalance.personal.used / leaveBalance.personal.total) * 100} className="h-2" />
            </div>
          </div>
        </MobileCard>

        {/* Recent Requests */}
        <MobileCard className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Demandes Récentes
          </h3>
          <div className="space-y-3">
            {userRequests.slice(0, 3).map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => router.push(`/employee/requests/${request.id}`)}
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{request.type}</p>
                  <p className="text-xs text-gray-600">
                    {new Date(request.startDate).toLocaleDateString("fr-FR")} -{" "}
                    {new Date(request.endDate).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <Badge
                  variant={
                    request.status === "approved"
                      ? "default"
                      : request.status === "rejected"
                        ? "destructive"
                        : "secondary"
                  }
                  className="text-xs"
                >
                  {request.status === "approved" ? "Approuvé" : request.status === "rejected" ? "Rejeté" : "En attente"}
                </Badge>
              </div>
            ))}
          </div>
        </MobileCard>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            className="h-16 flex flex-col items-center justify-center space-y-1"
            onClick={() => router.push("/employee/requests/new")}
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs">Nouvelle Demande</span>
          </Button>
          <Button
            variant="outline"
            className="h-16 flex flex-col items-center justify-center space-y-1"
            onClick={() => router.push("/employee/requests")}
          >
            <Calendar className="h-5 w-5" />
            <span className="text-xs">Mes Demandes</span>
          </Button>
        </div>

        {/* Notifications */}
        {pendingRequests > 0 && (
          <MobileCard className="p-4 border-orange-200 bg-orange-50">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <p className="font-medium text-orange-900">
                  Vous avez {pendingRequests} demande{pendingRequests > 1 ? "s" : ""} en attente
                </p>
                <p className="text-sm text-orange-700">Vérifiez le statut de vos demandes récentes</p>
              </div>
            </div>
          </MobileCard>
        )}
      </div>
    </EmployeeLayout>
  )
}

export default function EmployeeDashboard() {
  return (
    <RouteGuard allowedRoles={["employee"]} requireAuth={true}>
      <EmployeeDashboardContent />
    </RouteGuard>
  )
}
