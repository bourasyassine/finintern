"use client"

import { useState } from "react"
import { Clock, CheckCircle, XCircle, AlertTriangle, Search, User } from "lucide-react"
import HRLayout from "@/components/layouts/hr-layout"
import MobileCard from "@/components/mobile-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { RouteGuard } from "@/components/auth/route-guard"
import { mockLeaveRequests, mockEmployees } from "@/lib/data"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

function HRPendingContent() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPriority, setFilterPriority] = useState("all")
  const [processingId, setProcessingId] = useState<string | null>(null)

  // Filtrer seulement les demandes en attente
  const pendingRequests = mockLeaveRequests.filter((req) => req.status === "pending")

  const filteredRequests = pendingRequests.filter((request) => {
    const employee = mockEmployees.find((emp) => emp.id === request.employeeId)
    const employeeName = `${employee?.firstName} ${employee?.lastName}`.toLowerCase()

    const matchesSearch =
      employeeName.includes(searchTerm.toLowerCase()) || request.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === "all" || request.priority === filterPriority

    return matchesSearch && matchesPriority
  })

  const handleApprove = async (requestId: string) => {
    setProcessingId(requestId)
    try {
      // Simuler le traitement
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Demande approuvée",
        description: "La demande de congé a été approuvée avec succès",
      })

      // Rafraîchir ou rediriger
      window.location.reload()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'approbation",
        variant: "destructive",
      })
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (requestId: string) => {
    setProcessingId(requestId)
    try {
      // Simuler le traitement
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Demande rejetée",
        description: "La demande de congé a été rejetée",
        variant: "destructive",
      })

      // Rafraîchir ou rediriger
      window.location.reload()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du rejet",
        variant: "destructive",
      })
    } finally {
      setProcessingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  return (
    <HRLayout activeTab="pending">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-purple-900">Demandes en Attente</h1>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            {pendingRequests.length} en attente
          </Badge>
        </div>

        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par employé ou type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2">
            {["all", "urgent", "normal"].map((priority) => (
              <Button
                key={priority}
                variant={filterPriority === priority ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterPriority(priority)}
                className="whitespace-nowrap"
              >
                {priority === "all" ? "Toutes" : priority === "urgent" ? "Urgentes" : "Normales"}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-2 gap-3">
          <MobileCard className="p-3 text-center bg-orange-50 border-orange-200">
            <div className="text-lg font-bold text-orange-600">
              {pendingRequests.filter((r) => r.priority === "urgent").length}
            </div>
            <div className="text-xs text-orange-700">Urgentes</div>
          </MobileCard>
          <MobileCard className="p-3 text-center bg-blue-50 border-blue-200">
            <div className="text-lg font-bold text-blue-600">
              {pendingRequests.filter((r) => r.priority === "normal").length}
            </div>
            <div className="text-xs text-blue-700">Normales</div>
          </MobileCard>
        </div>

        {/* Liste des demandes */}
        <div className="space-y-3">
          {filteredRequests.length === 0 ? (
            <MobileCard className="p-6 text-center">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">Aucune demande en attente</p>
              <p className="text-sm text-gray-500">
                {searchTerm || filterPriority !== "all"
                  ? "Aucune demande ne correspond à vos critères"
                  : "Toutes les demandes ont été traitées"}
              </p>
            </MobileCard>
          ) : (
            filteredRequests.map((request) => {
              const employee = mockEmployees.find((emp) => emp.id === request.employeeId)
              const isProcessing = processingId === request.id

              return (
                <MobileCard key={request.id} className="p-4">
                  {/* En-tête avec employé et priorité */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-600">
                          {employee?.firstName[0]}
                          {employee?.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {employee?.firstName} {employee?.lastName}
                        </p>
                        <p className="text-xs text-gray-600">{employee?.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {request.priority === "urgent" && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Urgent
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        En attente
                      </Badge>
                    </div>
                  </div>

                  {/* Détails de la demande */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{request.type.replace("_", " ")}</span>
                      <span className="text-sm text-gray-600">
                        {calculateDays(request.startDate, request.endDate)} jour(s)
                      </span>
                    </div>

                    <div className="text-sm text-gray-600">
                      Du {formatDate(request.startDate)} au {formatDate(request.endDate)}
                    </div>

                    {request.reason && (
                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700">
                        <strong>Motif:</strong> {request.reason}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => router.push(`/hr/requests/${request.id}`)}
                      disabled={isProcessing}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Détails
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleReject(request.id)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "..." : <XCircle className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(request.id)}
                      disabled={isProcessing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isProcessing ? "..." : <CheckCircle className="h-4 w-4" />}
                    </Button>
                  </div>

                  {/* Indicateur de traitement */}
                  {isProcessing && (
                    <div className="mt-3 flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Traitement en cours...</span>
                    </div>
                  )}
                </MobileCard>
              )
            })
          )}
        </div>
      </div>
    </HRLayout>
  )
}

export default function HRPending() {
  return (
    <RouteGuard allowedRoles={["hr", "manager"]} requireAuth={true}>
      <HRPendingContent />
    </RouteGuard>
  )
}
