"use client"

import { useState } from "react"
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Edit, Save, X } from "lucide-react"
import EmployeeLayout from "@/components/layouts/employee-layout"
import MobileCard from "@/components/mobile-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { RouteGuard } from "@/components/auth/route-guard"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

function EmployeeProfileContent() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    phone: "+33 6 12 34 56 78",
    address: "123 Rue de la Paix, 75001 Paris",
    emergencyContact: "Marie Doe - +33 6 87 65 43 21",
  })

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simuler la sauvegarde
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès",
      })

      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const leaveBalance = {
    annual: { used: 8, total: 25, remaining: 17 },
    sick: { used: 2, total: 10, remaining: 8 },
    personal: { used: 1, total: 5, remaining: 4 },
  }

  return (
    <EmployeeLayout activeTab="profile">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Mon Profil</h1>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "..." : "Sauver"}
              </Button>
            </div>
          )}
        </div>

        {/* Photo et infos principales */}
        <MobileCard className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-blue-600">
                {user?.firstName?.[0] || "U"}
                {user?.lastName?.[0] || "U"}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-600">{user?.position}</p>
              <Badge variant="secondary" className="mt-2">
                {user?.department}
              </Badge>
            </div>
          </div>
        </MobileCard>

        {/* Informations personnelles */}
        <MobileCard className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Informations Personnelles
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <div className="flex-1">
                <Label className="text-xs text-gray-500">Email</Label>
                <p className="text-sm font-medium">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-gray-400" />
              <div className="flex-1">
                <Label className="text-xs text-gray-500">Téléphone</Label>
                {isEditing ? (
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm font-medium">{formData.phone}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-gray-400" />
              <div className="flex-1">
                <Label className="text-xs text-gray-500">Adresse</Label>
                {isEditing ? (
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm font-medium">{formData.address}</p>
                )}
              </div>
            </div>
          </div>
        </MobileCard>

        {/* Informations professionnelles */}
        <MobileCard className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
            Informations Professionnelles
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-gray-500">Poste</Label>
                <p className="text-sm font-medium">{user?.position}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Département</Label>
                <p className="text-sm font-medium">{user?.department}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-gray-500">Date d'embauche</Label>
                <p className="text-sm font-medium">15 Mars 2022</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Ancienneté</Label>
                <p className="text-sm font-medium">2 ans 9 mois</p>
              </div>
            </div>
          </div>
        </MobileCard>

        {/* Contact d'urgence */}
        <MobileCard className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Phone className="h-5 w-5 mr-2 text-red-600" />
            Contact d'Urgence
          </h3>
          <div>
            <Label className="text-xs text-gray-500">Personne à contacter</Label>
            {isEditing ? (
              <Input
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                className="mt-1"
                placeholder="Nom - Téléphone"
              />
            ) : (
              <p className="text-sm font-medium">{formData.emergencyContact}</p>
            )}
          </div>
        </MobileCard>

        {/* Solde de congés */}
        <MobileCard className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-green-600" />
            Solde de Congés
          </h3>
          <div className="space-y-4">
            {Object.entries(leaveBalance).map(([type, balance]) => (
              <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm capitalize">
                    {type === "annual" ? "Congés Annuels" : type === "sick" ? "Congés Maladie" : "Congés Personnels"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {balance.used} utilisés / {balance.total} total
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">{balance.remaining}</p>
                  <p className="text-xs text-gray-600">restants</p>
                </div>
              </div>
            ))}
          </div>
        </MobileCard>
      </div>
    </EmployeeLayout>
  )
}

export default function EmployeeProfile() {
  return (
    <RouteGuard allowedRoles={["employee"]} requireAuth={true}>
      <EmployeeProfileContent />
    </RouteGuard>
  )
}
