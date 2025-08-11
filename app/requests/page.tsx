"use client"

import { useState } from "react"
import { Calendar, Clock, Filter, Search } from "lucide-react"
import MobileLayout from "@/components/mobile-layout"
import MobileCard from "@/components/mobile-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockLeaveRequests, mockEmployees } from "@/lib/data"

export default function RequestsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const currentUser = mockEmployees[0]
  const userRequests = mockLeaveRequests.filter((req) => req.employeeId === currentUser.id)

  const filteredRequests = userRequests.filter((request) => {
    const matchesSearch =
      request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  return (
    <MobileLayout activeTab="requests">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Mes Demandes</h1>
          <Button size="sm" onClick={() => (window.location.href = "/requests/new")}>
            Nouvelle
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher vos demandes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Approuvé</SelectItem>
                <SelectItem value="rejected">Rejeté</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="approved">Approuvées</TabsTrigger>
            <TabsTrigger value="rejected">Rejetées</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3 mt-4">
            {filteredRequests.map((request) => (
              <MobileCard
                key={request.id}
                className="p-4"
                interactive
                onClick={() => (window.location.href = `/requests/${request.id}`)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 capitalize">{request.type.replace("_", " ")}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{request.reason}</p>
                    </div>
                    <Badge variant={getStatusColor(request.status)} className="ml-2">
                      {getStatusText(request.status)}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(request.startDate)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {calculateDuration(request.startDate, request.endDate)} jour
                          {calculateDuration(request.startDate, request.endDate) > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(request.submittedAt)}</span>
                  </div>

                  {request.status === "rejected" && request.rejectionReason && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">
                        <strong>Motif de rejet:</strong> {request.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              </MobileCard>
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-3 mt-4">
            {filteredRequests
              .filter((req) => req.status === "pending")
              .map((request) => (
                <MobileCard
                  key={request.id}
                  className="p-4 border-orange-200 bg-orange-50"
                  interactive
                  onClick={() => (window.location.href = `/requests/${request.id}`)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 capitalize">{request.type.replace("_", " ")}</h3>
                        <p className="text-sm text-gray-600 mt-1">{request.reason}</p>
                      </div>
                      <Badge variant="secondary">En attente</Badge>
                    </div>
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
                </MobileCard>
              ))}
          </TabsContent>

          <TabsContent value="approved" className="space-y-3 mt-4">
            {filteredRequests
              .filter((req) => req.status === "approved")
              .map((request) => (
                <MobileCard
                  key={request.id}
                  className="p-4 border-green-200 bg-green-50"
                  interactive
                  onClick={() => (window.location.href = `/requests/${request.id}`)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 capitalize">{request.type.replace("_", " ")}</h3>
                        <p className="text-sm text-gray-600 mt-1">{request.reason}</p>
                      </div>
                      <Badge variant="default">Approuvé</Badge>
                    </div>
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
                </MobileCard>
              ))}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-3 mt-4">
            {filteredRequests
              .filter((req) => req.status === "rejected")
              .map((request) => (
                <MobileCard
                  key={request.id}
                  className="p-4 border-red-200 bg-red-50"
                  interactive
                  onClick={() => (window.location.href = `/requests/${request.id}`)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 capitalize">{request.type.replace("_", " ")}</h3>
                        <p className="text-sm text-gray-600 mt-1">{request.reason}</p>
                      </div>
                      <Badge variant="destructive">Rejeté</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>
                        {formatDate(request.startDate)} - {formatDate(request.endDate)}
                      </span>
                      <span>
                        {calculateDuration(request.startDate, request.endDate)} jour
                        {calculateDuration(request.startDate, request.endDate) > 1 ? "s" : ""}
                      </span>
                    </div>
                    {request.rejectionReason && (
                      <div className="p-2 bg-red-100 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                          <strong>Motif:</strong> {request.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>
                </MobileCard>
              ))}
          </TabsContent>
        </Tabs>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune demande trouvée</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Essayez de modifier vos filtres de recherche"
                : "Vous n'avez pas encore soumis de demandes de congé"}
            </p>
            <Button onClick={() => (window.location.href = "/requests/new")}>Créer une demande</Button>
          </div>
        )}
      </div>
    </MobileLayout>
  )
}
