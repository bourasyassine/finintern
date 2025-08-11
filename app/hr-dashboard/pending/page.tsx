"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, Filter, Clock, AlertTriangle, Check, X, User } from 'lucide-react'
import MobileLayout from "@/components/mobile-layout"
import MobileCard from "@/components/mobile-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { mockLeaveRequests, mockEmployees } from "@/lib/data"
import { useAuth } from "@/lib/auth"

export default function PendingRequestsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [requests, setRequests] = useState(mockLeaveRequests)

  // Authentication check
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login")
      } else if (user?.role !== "hr" && user?.role !== "manager") {
        router.push("/")
      }
    }
  }, [isAuthenticated, isLoading, router, user])

  const pendingRequests = requests.filter((req) => req.status === "pending")

  const filteredRequests = pendingRequests.filter((request) => {
    const employee = mockEmployees.find((emp) => emp.id === request.employeeId)
    const matchesSearch =
      employee?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter
    const matchesDepartment = departmentFilter === "all" || employee?.department === departmentFilter
    return matchesSearch && matchesPriority && matchesDepartment
  })

  const handleApprove = async (requestId: string) => {
    setIsProcessing(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state
      setRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status: "approved" as const } : req)))

      toast({
        title: "Demande approuvée",
        description: "La demande a été approuvée avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async (requestId: string) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Motif requis",
        description: "Veuillez saisir un motif de rejet",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state
      setRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, status: "rejected" as const, rejectionReason } : req)),
      )

      toast({
        title: "Demande rejetée",
        description: "La demande a été rejetée",
      })
      setSelectedRequest(null)
      setRejectionReason("")
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
    })
  }

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "normal":
        return "bg-blue-100 text-blue-800"
      case "low":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || (user?.role !== "hr" && user?.role !== "manager")) {
    return null
  }

  return (
    <MobileLayout activeTab="team" userRole="hr">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => router.push("/hr-dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-purple-900">Demandes en Attente</h1>
              <p className="text-sm text-purple-600">{filteredRequests.length} demande(s)</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            <Clock className="h-3 w-3 mr-1" />
            {pendingRequests.length}
          </Badge>
        </div>

        {/* Search and Filters */}
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

          <div className="flex space-x-2">
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes priorités</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">Élevé</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Faible</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Département" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous départements</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Human Resources">RH</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Sales">Ventes</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Urgent Requests Alert */}
        {filteredRequests.some((req) => req.priority === "urgent") && (
          <MobileCard className="p-4 border-red-200 bg-red-50">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div className="flex-1">
                <p className="font-medium text-red-900">
                  {filteredRequests.filter((req) => req.priority === "urgent").length} demande(s) urgente(s)
                </p>
                <p className="text-sm text-red-700">Nécessite une attention immédiate</p>
              </div>
            </div>
          </MobileCard>
        )}

        {/* Requests List */}
        <div className="space-y-3">
          {filteredRequests.map((request) => {
            const employee = mockEmployees.find((emp) => emp.id === request.employeeId)
            return (
              <MobileCard
                key={request.id}
                className={`p-4 ${request.priority === "urgent" ? "border-red-200 bg-red-50" : ""}`}
              >
                <div className="space-y-4">
                  {/* Employee Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-600">
                          {employee?.firstName[0]}
                          {employee?.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {employee?.firstName} {employee?.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{employee?.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(request.priority)} variant="secondary">
                        {request.priority}
                      </Badge>
                      {request.priority === "urgent" && <AlertTriangle className="h-4 w-4 text-red-600" />}
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold capitalize">{request.type.replace("_", " ")}</h3>
                      <span className="text-sm text-gray-500">#{request.id}</span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">{request.reason}</p>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>
                        {formatDate(request.startDate)} - {formatDate(request.endDate)}
                      </span>
                      <span>
                        {calculateDuration(request.startDate, request.endDate)} jour
                        {calculateDuration(request.startDate, request.endDate) > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(request.id)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                      ) : (
                        <Check className="h-4 w-4 mr-1" />
                      )}
                      Approuver
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          onClick={() => setSelectedRequest(request.id)}
                          disabled={isProcessing}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Rejeter
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Rejeter la demande</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-2">
                              Demande de {employee?.firstName} {employee?.lastName}
                            </p>
                            <p className="text-sm font-medium">{request.type.replace("_", " ")}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Motif de rejet *</label>
                            <Textarea
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              placeholder="Expliquez pourquoi cette demande est rejetée..."
                              rows={3}
                              className="mt-1"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleReject(request.id)}
                              disabled={isProcessing || !rejectionReason.trim()}
                              variant="destructive"
                              className="flex-1"
                            >
                              {isProcessing ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                              ) : null}
                              Confirmer le rejet
                            </Button>
                            <Button variant="outline" className="flex-1" onClick={() => setSelectedRequest(null)}>
                              Annuler
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/hr-dashboard/requests/${request.id}`)}
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </MobileCard>
            )
          })}
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune demande en attente</h3>
            <p className="text-gray-600">
              {searchTerm || priorityFilter !== "all" || departmentFilter !== "all"
                ? "Aucune demande ne correspond à vos filtres"
                : "Toutes les demandes ont été traitées"}
            </p>
          </div>
        )}
      </div>
    </MobileLayout>
  )
}
