"use client"

import { useState } from "react"
import { ArrowLeft, Search, Filter, FileText, Calendar, Users, TrendingUp } from "lucide-react"
import MobileLayout from "@/components/mobile-layout"
import MobileCard from "@/components/mobile-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockLeaveRequests, mockEmployees } from "@/lib/data"

export default function AllRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const filteredRequests = mockLeaveRequests.filter((request) => {
    const employee = mockEmployees.find((emp) => emp.id === request.employeeId)
    const matchesSearch =
      employee?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesDepartment = departmentFilter === "all" || employee?.department === departmentFilter
    return matchesSearch && matchesStatus && matchesDepartment
  })

  const stats = {
    total: mockLeaveRequests.length,
    pending: mockLeaveRequests.filter((req) => req.status === "pending").length,
    approved: mockLeaveRequests.filter((req) => req.status === "approved").length,
    rejected: mockLeaveRequests.filter((req) => req.status === "rejected").length,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
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
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  return (
    <MobileLayout activeTab="team" userRole="hr">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/hr-dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-purple-900">Toutes les Demandes</h1>
            <p className="text-sm text-purple-600">{filteredRequests.length} demande(s)</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <MobileCard className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                <p className="text-sm text-blue-700">Total</p>
              </div>
            </div>
          </MobileCard>

          <MobileCard className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-900">{stats.pending}</p>
                <p className="text-sm text-orange-700">En attente</p>
              </div>
            </div>
          </MobileCard>

          <MobileCard className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-900">{stats.approved}</p>
                <p className="text-sm text-green-700">Approuvées</p>
              </div>
            </div>
          </MobileCard>

          <MobileCard className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
                <p className="text-sm text-red-700">Rejetées</p>
              </div>
            </div>
          </MobileCard>
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Approuvé</SelectItem>
                <SelectItem value="rejected">Rejeté</SelectItem>
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
          </div>

          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Plus de filtres
            </Button>
            <Button variant="outline" size="sm">
              Exporter
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
            {filteredRequests.map((request) => {
              const employee = mockEmployees.find((emp) => emp.id === request.employeeId)
              return (
                <MobileCard
                  key={request.id}
                  className="p-4"
                  interactive
                  onClick={() => (window.location.href = `/hr-dashboard/requests/${request.id}`)}
                >
                  <div className="space-y-3">
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
                      <Badge className={getStatusColor(request.status)} variant="secondary">
                        {getStatusText(request.status)}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-semibold capitalize">{request.type.replace("_", " ")}</h3>
                      <p className="text-sm text-gray-700 line-clamp-2">{request.reason}</p>
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

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>#{request.id}</span>
                      <span>Soumis le {formatDate(request.submittedAt)}</span>
                    </div>
                  </div>
                </MobileCard>
              )
            })}
          </TabsContent>

          <TabsContent value="pending" className="space-y-3 mt-4">
            {filteredRequests
              .filter((req) => req.status === "pending")
              .map((request) => {
                const employee = mockEmployees.find((emp) => emp.id === request.employeeId)
                return (
                  <MobileCard
                    key={request.id}
                    className="p-4 border-orange-200 bg-orange-50"
                    interactive
                    onClick={() => (window.location.href = `/hr-dashboard/requests/${request.id}`)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-orange-600">
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
                        <Badge className="bg-orange-100 text-orange-800" variant="secondary">
                          En attente
                        </Badge>
                      </div>
                      <div>
                        <h3 className="font-semibold capitalize">{request.type.replace("_", " ")}</h3>
                        <p className="text-sm text-gray-700">{request.reason}</p>
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
                )
              })}
          </TabsContent>

          <TabsContent value="approved" className="space-y-3 mt-4">
            {filteredRequests
              .filter((req) => req.status === "approved")
              .map((request) => {
                const employee = mockEmployees.find((emp) => emp.id === request.employeeId)
                return (
                  <MobileCard
                    key={request.id}
                    className="p-4 border-green-200 bg-green-50"
                    interactive
                    onClick={() => (window.location.href = `/hr-dashboard/requests/${request.id}`)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-green-600">
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
                        <Badge className="bg-green-100 text-green-800" variant="secondary">
                          Approuvé
                        </Badge>
                      </div>
                      <div>
                        <h3 className="font-semibold capitalize">{request.type.replace("_", " ")}</h3>
                        <p className="text-sm text-gray-700">{request.reason}</p>
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
                )
              })}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-3 mt-4">
            {filteredRequests
              .filter((req) => req.status === "rejected")
              .map((request) => {
                const employee = mockEmployees.find((emp) => emp.id === request.employeeId)
                return (
                  <MobileCard
                    key={request.id}
                    className="p-4 border-red-200 bg-red-50"
                    interactive
                    onClick={() => (window.location.href = `/hr-dashboard/requests/${request.id}`)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-red-600">
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
                        <Badge className="bg-red-100 text-red-800" variant="secondary">
                          Rejeté
                        </Badge>
                      </div>
                      <div>
                        <h3 className="font-semibold capitalize">{request.type.replace("_", " ")}</h3>
                        <p className="text-sm text-gray-700">{request.reason}</p>
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
                )
              })}
          </TabsContent>
        </Tabs>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune demande trouvée</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all" || departmentFilter !== "all"
                ? "Aucune demande ne correspond à vos filtres"
                : "Aucune demande n'a été soumise"}
            </p>
          </div>
        )}
      </div>
    </MobileLayout>
  )
}
