"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, FileText, AlertCircle, ArrowLeft } from "lucide-react"
import EmployeeLayout from "@/components/layouts/employee-layout"
import MobileCard from "@/components/mobile-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RouteGuard } from "@/components/auth/route-guard"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

function NewRequestContent() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
    priority: "normal",
  })

  const leaveTypes = [
    { value: "annual_leave", label: "Congés Annuels" },
    { value: "sick_leave", label: "Congé Maladie" },
    { value: "personal_leave", label: "Congé Personnel" },
    { value: "maternity_leave", label: "Congé Maternité" },
    { value: "paternity_leave", label: "Congé Paternité" },
    { value: "emergency_leave", label: "Congé d'Urgence" },
  ]

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      return diffDays
    }
    return 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.type || !formData.startDate || !formData.endDate || !formData.reason) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast({
        title: "Erreur",
        description: "La date de fin doit être après la date de début",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simuler l'envoi de la demande
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Demande envoyée",
        description: "Votre demande de congé a été soumise avec succès",
      })

      router.push("/employee/requests")
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <EmployeeLayout activeTab="requests">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">Nouvelle Demande</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type de congé */}
          <MobileCard className="p-4">
            <div className="space-y-3">
              <Label htmlFor="type" className="text-sm font-medium flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Type de congé *
              </Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type de congé" />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </MobileCard>

          {/* Dates */}
          <MobileCard className="p-4">
            <div className="space-y-4">
              <Label className="text-sm font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Période de congé *
              </Label>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="startDate" className="text-xs text-gray-600">
                    Date de début
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate" className="text-xs text-gray-600">
                    Date de fin
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    min={formData.startDate || new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              {calculateDays() > 0 && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Durée:</strong> {calculateDays()} jour(s)
                  </p>
                </div>
              )}
            </div>
          </MobileCard>

          {/* Priorité */}
          <MobileCard className="p-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Priorité
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normale</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </MobileCard>

          {/* Motif */}
          <MobileCard className="p-4">
            <div className="space-y-3">
              <Label htmlFor="reason" className="text-sm font-medium">
                Motif de la demande *
              </Label>
              <Textarea
                id="reason"
                placeholder="Expliquez brièvement le motif de votre demande..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={4}
              />
              <p className="text-xs text-gray-500">{formData.reason.length}/500 caractères</p>
            </div>
          </MobileCard>

          {/* Informations importantes */}
          <MobileCard className="p-4 bg-amber-50 border-amber-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">À noter :</p>
                <ul className="space-y-1 text-xs">
                  <li>• Les demandes doivent être soumises au moins 48h à l'avance</li>
                  <li>• Les congés urgents nécessitent une justification</li>
                  <li>• Vous recevrez une notification une fois la demande traitée</li>
                </ul>
              </div>
            </div>
          </MobileCard>

          {/* Boutons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}
            </Button>
          </div>
        </form>
      </div>
    </EmployeeLayout>
  )
}

export default function NewEmployeeRequest() {
  return (
    <RouteGuard allowedRoles={["employee"]} requireAuth={true}>
      <NewRequestContent />
    </RouteGuard>
  )
}
