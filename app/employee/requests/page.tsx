"use client"

import { useState } from "react"
import { Search, Plus, Calendar, Clock, CheckCircle, XCircle } from "lucide-react"
import EmployeeLayout from "@/components/layouts/employee-layout"
import MobileCard from "@/components/mobile-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { RouteGuard } from "@/components/auth/route-guard"
import { mockLeaveRequests } from "@/lib/data"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"

function EmployeeRequestsContent() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Filtrer les demandes pour l'employé connecté uniquement
  const userRequests = mockLeaveRequests.filter((req) => req.employeeId === (user?.id || "1"))

  const filteredRequests = userRequests.filter((request) => {
    const matchesSearch =
      request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || request.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-orange-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approuvé"
      case "rejected":
        return "Rejeté"
      case "pending":
        return "En attente"
      default:
        return status
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default"
      case "rejected":
        return "destructive"
      case "pending":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <EmployeeLayout activeTab="requests">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Mes Demandes</h1>
          <Button onClick={() => router.push("/employee/requests/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher mes demandes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2">
            {["all", "pending", "approved", "rejected"].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className="whitespace-nowrap"
              >
                {status === "all" ? "Toutes" : getStatusText(status)}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <MobileCard className="p-3 text-center">
            <div className="text-lg font-bold text-orange-600">
              {userRequests.filter((r) => r.status === "pending").length}
            </div>
            <div className="text-xs text-gray-600">En attente</div>
          </MobileCard>
          <MobileCard className="p-3 text-center">
            <div className="text-lg font-bold text-green-600">
              {userRequests.filter((r) => r.status === "approved").length}
            </div>
            <div className="text-xs text-gray-600">Approuvées</div>
          </MobileCard>
          <MobileCard className="p-3 text-center">
            <div className="text-lg font-bold text-red-600">
              {userRequests.filter((r) => r.status === "rejected").length}
            </div>
            <div className="text-xs text-gray-600">Rejetées</div>
          </MobileCard>
        </div>

        {/* Requests List */}
        <div className="space-y-3">
          {filteredRequests.length === 0 ? (
            <MobileCard className="p-6 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">Aucune demande trouvée</p>
              <p className="text-sm text-gray-500">
                {searchTerm || filterStatus !== "all"
                  ? "Essayez de modifier vos critères de recherche"
                  : "Créez votre première demande de congé"}
              </p>
              {!searchTerm && filterStatus === "all" && (
                <Button className="mt-3" onClick={() => router.push("/employee/requests/new")}>
                  Créer une demande
                </Button>
              )}
            </MobileCard>
          ) : (
            filteredRequests.map((request) => (
              <MobileCard
                key={request.id}
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => router.push(`/employee/requests/${request.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 capitalize">{request.type.replace("_", " ")}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Du {new Date(request.startDate).toLocaleDateString("fr-FR")} au{" "}
                      {new Date(request.endDate).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(request.status)}
                    <Badge variant={getStatusVariant(request.status)} className="text-xs">
                      {getStatusText(request.status)}
                    </Badge>
                  </div>
                </div>

                {request.reason && <p className="text-sm text-gray-700 mb-3 line-clamp-2">{request.reason}</p>}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    Durée:{" "}
                    {Math.ceil(
                      (new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    jour(s)
                  </span>
                  <span>Créée le {new Date(request.createdAt).toLocaleDateString("fr-FR")}</span>
                </div>
              </MobileCard>
            ))
          )}
        </div>
      </div>
    </EmployeeLayout>
  )
}

export default function EmployeeRequests() {
  return (
    <RouteGuard allowedRoles={["employee"]} requireAuth={true}>
      <EmployeeRequestsContent />
    </RouteGuard>
  )
}
