"use client"

import { Users, Clock, CheckCircle, AlertTriangle, FileText, BarChart3 } from "lucide-react"
import MobileCard from "@/components/mobile-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { mockLeaveRequests, mockEmployees } from "@/lib/data"
import { useRouter } from "next/navigation"
import HRLayout from "@/components/layouts/hr-layout"
import { RouteGuard } from "@/components/auth/route-guard"

export function HRDashboardContent() {
  const router = useRouter()

  const totalRequests = mockLeaveRequests.length
  const pendingRequests = mockLeaveRequests.filter((req) => req.status === "pending").length
  const approvedRequests = mockLeaveRequests.filter((req) => req.status === "approved").length
  const rejectedRequests = mockLeaveRequests.filter((req) => req.status === "rejected").length
  const totalEmployees = mockEmployees.length

  const urgentRequests = mockLeaveRequests.filter((req) => req.status === "pending" && req.priority === "urgent").length

  const approvalRate = Math.round((approvedRequests / Math.max(approvedRequests + rejectedRequests, 1)) * 100)

  const recentRequests = mockLeaveRequests.filter((req) => req.status === "pending").slice(0, 3)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
    })
  }

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <HRLayout activeTab="dashboard">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="text-center py-4">
          <h1 className="text-2xl font-bold text-purple-900 mb-2">Tableau de Bord RH</h1>
          <p className="text-purple-600">Gestion des congés et équipes</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <MobileCard
            className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
            interactive
            onClick={() => handleNavigation("/hr-dashboard/pending")}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-900">{pendingRequests}</p>
                <p className="text-sm text-purple-700">En attente</p>
              </div>
            </div>
          </MobileCard>

          <MobileCard
            className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
            interactive
            onClick={() => handleNavigation("/hr-dashboard/pending")}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-900">{urgentRequests}</p>
                <p className="text-sm text-orange-700">Urgentes</p>
              </div>
            </div>
          </MobileCard>

          <MobileCard
            className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200"
            interactive
            onClick={() => handleNavigation("/hr-dashboard/requests")}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-900">{approvedRequests}</p>
                <p className="text-sm text-green-700">Approuvées</p>
              </div>
            </div>
          </MobileCard>

          <MobileCard
            className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
            interactive
            onClick={() => handleNavigation("/hr-dashboard/teams")}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">{totalEmployees}</p>
                <p className="text-sm text-blue-700">Employés</p>
              </div>
            </div>
          </MobileCard>
        </div>

        {/* Performance Metrics */}
        <MobileCard className="p-4" interactive onClick={() => handleNavigation("/hr-dashboard/analytics")}>
          <h3 className="text-lg font-semibold mb-4 flex items-center text-purple-900">
            <BarChart3 className="h-5 w-5 mr-2" />
            Performance
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Taux d'approbation</span>
                <span className="text-sm text-gray-600">{approvalRate}%</span>
              </div>
              <Progress value={approvalRate} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-green-600">{approvedRequests}</p>
                <p className="text-xs text-gray-600">Approuvées</p>
              </div>
              <div>
                <p className="text-lg font-bold text-orange-600">{pendingRequests}</p>
                <p className="text-xs text-gray-600">En attente</p>
              </div>
              <div>
                <p className="text-lg font-bold text-red-600">{rejectedRequests}</p>
                <p className="text-xs text-gray-600">Rejetées</p>
              </div>
            </div>
          </div>
        </MobileCard>

        {/* Recent Pending Requests */}
        <MobileCard className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center text-purple-900">
              <FileText className="h-5 w-5 mr-2" />
              Demandes Récentes
            </h3>
            <Button size="sm" variant="outline" onClick={() => handleNavigation("/hr-dashboard/pending")}>
              Voir tout
            </Button>
          </div>
          <div className="space-y-3">
            {recentRequests.map((request) => {
              const employee = mockEmployees.find((emp) => emp.id === request.employeeId)
              return (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleNavigation(`/hr-dashboard/requests/${request.id}`)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-purple-600">
                        {employee?.firstName[0]}
                        {employee?.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {employee?.firstName} {employee?.lastName}
                      </p>
                      <p className="text-xs text-gray-600 capitalize">
                        {request.type.replace("_", " ")} • {formatDate(request.startDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {request.priority === "urgent" && (
                      <Badge variant="destructive" className="text-xs">
                        Urgent
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      En attente
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </MobileCard>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            className="h-16 flex flex-col items-center justify-center space-y-1 bg-purple-600 hover:bg-purple-700"
            onClick={() => handleNavigation("/hr-dashboard/pending")}
          >
            <Clock className="h-5 w-5" />
            <span className="text-xs">Traiter Demandes</span>
          </Button>
          <Button
            variant="outline"
            className="h-16 flex flex-col items-center justify-center space-y-1"
            onClick={() => handleNavigation("/hr-dashboard/analytics")}
          >
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs">Voir Analytics</span>
          </Button>
        </div>

        {/* Urgent Alerts */}
        {urgentRequests > 0 && (
          <MobileCard className="p-4 border-red-200 bg-red-50">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div className="flex-1">
                <p className="font-medium text-red-900">
                  {urgentRequests} demande{urgentRequests > 1 ? "s" : ""} urgente{urgentRequests > 1 ? "s" : ""}
                </p>
                <p className="text-sm text-red-700">Nécessite une attention immédiate</p>
              </div>
              <Button size="sm" variant="destructive" onClick={() => handleNavigation("/hr-dashboard/pending")}>
                Traiter
              </Button>
            </div>
          </MobileCard>
        )}
      </div>
    </HRLayout>
  )
}

export default function HRDashboard() {
  return (
    <RouteGuard allowedRoles={["hr", "manager"]} requireAuth={true}>
      <HRDashboardContent />
    </RouteGuard>
  )
}
