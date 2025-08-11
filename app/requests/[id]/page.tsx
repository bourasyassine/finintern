"use client"

import { useState } from "react"
import { ArrowLeft, Calendar, Clock, User, FileText, MessageSquare, Phone, Mail } from "lucide-react"
import MobileLayout from "@/components/mobile-layout"
import MobileCard from "@/components/mobile-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { mockLeaveRequests, mockEmployees } from "@/lib/data"

export default function RequestDetailsPage({ params }: { params: { id: string } }) {
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [comment, setComment] = useState("")

  const request = mockLeaveRequests.find((req) => req.id === params.id)
  const employee = mockEmployees.find((emp) => emp.id === request?.employeeId)

  if (!request || !employee) {
    return (
      <MobileLayout>
        <div className="p-4 text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Demande non trouvée</h1>
          <Button onClick={() => window.history.back()}>Retour</Button>
        </div>
      </MobileLayout>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
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
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const calculateDuration = () => {
    const start = new Date(request.startDate)
    const end = new Date(request.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Détails de la Demande</h1>
          </div>
          <Badge className={getStatusColor(request.status)}>{getStatusText(request.status)}</Badge>
        </div>

        {/* Request Info */}
        <MobileCard className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold capitalize">{request.type.replace("_", " ")}</h3>
              <span className="text-sm text-gray-500">#{request.id}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Date de début</p>
                  <p className="text-sm text-gray-600">{formatDate(request.startDate)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Date de fin</p>
                  <p className="text-sm text-gray-600">{formatDate(request.endDate)}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Durée</p>
                <p className="text-sm text-gray-600">
                  {calculateDuration()} jour{calculateDuration() > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        </MobileCard>

        {/* Employee Info */}
        <MobileCard className="p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Employé
          </h3>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-blue-600">
                {employee.firstName[0]}
                {employee.lastName[0]}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium">
                {employee.firstName} {employee.lastName}
              </p>
              <p className="text-sm text-gray-600">{employee.position}</p>
              <p className="text-sm text-gray-500">{employee.department}</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </MobileCard>

        {/* Reason */}
        <MobileCard className="p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Raison
          </h3>
          <p className="text-gray-700">{request.reason}</p>
        </MobileCard>

        {/* Rejection Reason */}
        {request.status === "rejected" && request.rejectionReason && (
          <MobileCard className="p-4 border-red-200 bg-red-50">
            <h3 className="text-lg font-semibold mb-3 text-red-900">Motif de Rejet</h3>
            <p className="text-red-800">{request.rejectionReason}</p>
          </MobileCard>
        )}

        {/* Timeline */}
        <MobileCard className="p-4">
          <h3 className="text-lg font-semibold mb-3">Historique</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Demande soumise</p>
                <p className="text-xs text-gray-500">{formatDate(request.submittedAt)}</p>
              </div>
            </div>
            {request.status !== "pending" && (
              <div className="flex items-center space-x-3">
                <div
                  className={`w-2 h-2 rounded-full ${request.status === "approved" ? "bg-green-500" : "bg-red-500"}`}
                ></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Demande {request.status === "approved" ? "approuvée" : "rejetée"}
                  </p>
                  <p className="text-xs text-gray-500">Il y a 2 jours</p>
                </div>
              </div>
            )}
          </div>
        </MobileCard>

        {/* Comments Section */}
        <MobileCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
              Commentaires
            </h3>
            <Button variant="outline" size="sm" onClick={() => setShowCommentForm(!showCommentForm)}>
              Ajouter
            </Button>
          </div>

          {showCommentForm && (
            <div className="space-y-3 mb-4">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ajouter un commentaire..."
                rows={3}
              />
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => setShowCommentForm(false)}>
                  Publier
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowCommentForm(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-600">SJ</span>
                </div>
                <span className="text-sm font-medium">Sarah Johnson</span>
                <span className="text-xs text-gray-500">Il y a 1 jour</span>
              </div>
              <p className="text-sm text-gray-700">Demande approuvée. Bon voyage !</p>
            </div>
          </div>
        </MobileCard>

        {/* Actions */}
        {request.status === "pending" && (
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-12">
              Modifier
            </Button>
            <Button variant="destructive" className="h-12">
              Annuler
            </Button>
          </div>
        )}
      </div>
    </MobileLayout>
  )
}
