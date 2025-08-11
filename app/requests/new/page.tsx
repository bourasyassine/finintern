"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, AlertTriangle, FileText, ArrowLeft, Send } from "lucide-react"
import MobileLayout from "@/components/mobile-layout"
import MobileCard from "@/components/mobile-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { submitLeaveRequest } from "@/lib/actions"

export default function NewRequestPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
    priority: "normal",
    isHalfDay: false,
    halfDayPeriod: "morning",
    handoverNotes: "",
    emergencyContact: "",
    emergencyPhone: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const leaveTypes = [
    { value: "annual_leave", label: "Congé Annuel" },
    { value: "sick_leave", label: "Congé Maladie" },
    { value: "personal_leave", label: "Congé Personnel" },
    { value: "maternity_leave", label: "Congé Maternité" },
    { value: "paternity_leave", label: "Congé Paternité" },
    { value: "unpaid_leave", label: "Congé Sans Solde" },
    { value: "emergency_leave", label: "Congé d'Urgence" },
    { value: "other", label: "Autre" },
  ]

  const priorities = [
    { value: "low", label: "Faible", color: "bg-gray-100 text-gray-800" },
    { value: "normal", label: "Normal", color: "bg-blue-100 text-blue-800" },
    { value: "high", label: "Élevé", color: "bg-orange-100 text-orange-800" },
    { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-800" },
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.type) newErrors.type = "Le type de congé est requis"
    if (!formData.startDate) newErrors.startDate = "La date de début est requise"
    if (!formData.endDate) newErrors.endDate = "La date de fin est requise"
    if (!formData.reason.trim()) newErrors.reason = "La raison est requise"

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate)
      const endDate = new Date(formData.endDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (startDate < today) {
        newErrors.startDate = "La date de début ne peut pas être dans le passé"
      }
      if (endDate < startDate) {
        newErrors.endDate = "La date de fin doit être après la date de début"
      }
    }

    if (formData.type === "emergency_leave") {
      if (!formData.emergencyContact.trim()) {
        newErrors.emergencyContact = "Contact d'urgence requis"
      }
      if (!formData.emergencyPhone.trim()) {
        newErrors.emergencyPhone = "Téléphone d'urgence requis"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return 0
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return formData.isHalfDay ? 0.5 : diffDays
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez corriger les erreurs dans le formulaire",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await submitLeaveRequest(formData)
      toast({
        title: "Demande soumise !",
        description: "Votre demande de congé a été envoyée avec succès",
      })
      window.location.href = "/requests"
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const duration = calculateDuration()
  const remainingBalance = 25 - 8 // Mock data

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Nouvelle Demande</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Leave Type & Priority */}
          <MobileCard className="p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Type de Congé
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="type">Type de congé *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-sm text-red-600 mt-1">{errors.type}</p>}
              </div>

              <div>
                <Label htmlFor="priority">Priorité</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <div className="flex items-center space-x-2">
                          <Badge className={priority.color}>{priority.label}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </MobileCard>

          {/* Dates */}
          <MobileCard className="p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Dates
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="halfDay">Demi-journée</Label>
                <Switch
                  checked={formData.isHalfDay}
                  onCheckedChange={(checked) => setFormData({ ...formData, isHalfDay: checked })}
                />
              </div>

              {formData.isHalfDay && (
                <div>
                  <Label>Période</Label>
                  <Select
                    value={formData.halfDayPeriod}
                    onValueChange={(value) => setFormData({ ...formData, halfDayPeriod: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Matin</SelectItem>
                      <SelectItem value="afternoon">Après-midi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Date de début *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className={errors.startDate ? "border-red-500" : ""}
                  />
                  {errors.startDate && <p className="text-sm text-red-600 mt-1">{errors.startDate}</p>}
                </div>
                <div>
                  <Label htmlFor="endDate">Date de fin *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className={errors.endDate ? "border-red-500" : ""}
                  />
                  {errors.endDate && <p className="text-sm text-red-600 mt-1">{errors.endDate}</p>}
                </div>
              </div>

              {duration > 0 && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-900">Durée demandée:</span>
                    <span className="text-sm font-bold text-blue-900">
                      {duration} jour{duration > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-blue-700">Solde restant:</span>
                    <span
                      className={`text-sm font-medium ${remainingBalance - duration < 0 ? "text-red-600" : "text-blue-700"}`}
                    >
                      {remainingBalance - duration} jours
                    </span>
                  </div>
                  {remainingBalance - duration < 0 && (
                    <div className="flex items-center space-x-2 mt-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-600">Solde insuffisant</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </MobileCard>

          {/* Details */}
          <MobileCard className="p-4">
            <h3 className="text-lg font-semibold mb-4">Détails</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reason">Raison *</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Expliquez la raison de votre demande..."
                  rows={3}
                  className={errors.reason ? "border-red-500" : ""}
                />
                {errors.reason && <p className="text-sm text-red-600 mt-1">{errors.reason}</p>}
              </div>

              <div>
                <Label htmlFor="handover">Notes de passation (optionnel)</Label>
                <Textarea
                  id="handover"
                  value={formData.handoverNotes}
                  onChange={(e) => setFormData({ ...formData, handoverNotes: e.target.value })}
                  placeholder="Instructions pour vos collègues pendant votre absence..."
                  rows={2}
                />
              </div>
            </div>
          </MobileCard>

          {/* Emergency Contact (for emergency leave) */}
          {formData.type === "emergency_leave" && (
            <MobileCard className="p-4 border-orange-200 bg-orange-50">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-orange-900">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Contact d'Urgence
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="emergencyContact">Nom du contact *</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    placeholder="Nom complet"
                    className={errors.emergencyContact ? "border-red-500" : ""}
                  />
                  {errors.emergencyContact && <p className="text-sm text-red-600 mt-1">{errors.emergencyContact}</p>}
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Téléphone *</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    placeholder="Numéro de téléphone"
                    className={errors.emergencyPhone ? "border-red-500" : ""}
                  />
                  {errors.emergencyPhone && <p className="text-sm text-red-600 mt-1">{errors.emergencyPhone}</p>}
                </div>
              </div>
            </MobileCard>
          )}

          {/* Submit Button */}
          <div className="sticky bottom-20 bg-white p-4 border-t">
            <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Envoi en cours...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Send className="h-5 w-5" />
                  <span>Soumettre la Demande</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </MobileLayout>
  )
}
