"use client"

import { useState } from "react"
import { RouteGuard } from "@/components/auth/route-guard"
import HRLayout from "@/components/layouts/hr-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Download, Eye, Check, X, Clock, Calendar, User } from "lucide-react"
import { mockLeaveRequests } from "@/lib/data"

export default function HRRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const allRequests = mockLeaveRequests
  const pendingRequests = allRequests.filter((req) => req.status === "pending")
  const approvedRequests = allRequests.filter((req) => req.status === "approved")
  const rejectedRequests = allRequests.filter((req) => req.status === "rejected")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approuvée"
      case "rejected":
        return "Rejetée"
      case "pending":
        return "En attente"
      default:
        return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const RequestCard = ({ request }: { request: any }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">{request.employeeName}</h3>
              <p className="text-sm text-gray-600">{request.department}</p>
            </div>
          </div>
          <Badge className={getStatusColor(request.status)}>{getStatusText(request.status)}</Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {request.startDate} - {request.endDate}
            </span>
            <span className="ml-2 font-medium">({request.duration} jours)</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>Demandé le {request.requestDate}</span>
          </div>
          <p className="text-sm">
            <strong>Type:</strong> {request.type}
          </p>
          <p className="text-sm">
            <strong>Raison:</strong> {request.reason}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${getPriorityColor(request.priority)}`}>
              Priorité {request.priority === "high" ? "Haute" : request.priority === "medium" ? "Moyenne" : "Basse"}
            </span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              Voir
            </Button>
            {request.status === "pending" && (
              <>
                <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                  <Check className="h-4 w-4 mr-1" />
                  Approuver
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <X className="h-4 w-4 mr-1" />
                  Rejeter
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <RouteGuard allowedRoles={["hr", "manager"]}>
      <HRLayout activeTab="requests">
        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Demandes</h1>
              <p className="text-gray-600">Toutes les demandes de congés</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrer
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par nom, département, type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{allRequests.length}</p>
                <p className="text-sm text-gray-600">Total</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</p>
                <p className="text-sm text-gray-600">En Attente</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{approvedRequests.length}</p>
                <p className="text-sm text-gray-600">Approuvées</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-red-600">{rejectedRequests.length}</p>
                <p className="text-sm text-gray-600">Rejetées</p>
              </CardContent>
            </Card>
          </div>

          {/* Requests Tabs */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Toutes ({allRequests.length})</TabsTrigger>
              <TabsTrigger value="pending">En Attente ({pendingRequests.length})</TabsTrigger>
              <TabsTrigger value="approved">Approuvées ({approvedRequests.length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejetées ({rejectedRequests.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-4">
                {allRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pending">
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="approved">
              <div className="space-y-4">
                {approvedRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="rejected">
              <div className="space-y-4">
                {rejectedRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </HRLayout>
    </RouteGuard>
  )
}
