"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, Phone, Building, Calendar, Edit, Save, X } from "lucide-react"
import MobileLayout from "@/components/mobile-layout"
import MobileCard from "@/components/mobile-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/lib/auth"
import { mockEmployees } from "@/lib/data"

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [currentUser, setCurrentUser] = useState(mockEmployees[0])
  const [editedUser, setEditedUser] = useState(mockEmployees[0])

  // Handle authentication and user data
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login")
        return
      }

      // Find the current user data from mock data or use auth user
      const userData = user ? mockEmployees.find((emp) => emp.id === user.id) || mockEmployees[0] : mockEmployees[0]
      setCurrentUser(userData)
      setEditedUser(userData)
    }
  }, [isAuthenticated, isLoading, router, user])

  const handleSave = () => {
    setCurrentUser(editedUser)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedUser(currentUser)
    setIsEditing(false)
  }

  const leaveStats = {
    totalRequests: 12,
    approvedRequests: 10,
    pendingRequests: 1,
    rejectedRequests: 1,
    daysUsed: 18,
    daysRemaining: 7,
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  return (
    <MobileLayout activeTab="profile">
      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <MobileCard className="p-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-blue-600">
                {currentUser.firstName[0]}
                {currentUser.lastName[0]}
              </span>
            </div>
            {isEditing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={editedUser.firstName}
                    onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })}
                    placeholder="Prénom"
                  />
                  <Input
                    value={editedUser.lastName}
                    onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
                    placeholder="Nom"
                  />
                </div>
                <Input
                  value={editedUser.position}
                  onChange={(e) => setEditedUser({ ...editedUser, position: e.target.value })}
                  placeholder="Poste"
                />
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {currentUser.firstName} {currentUser.lastName}
                </h2>
                <p className="text-gray-600">{currentUser.position}</p>
                <p className="text-sm text-gray-500">{currentUser.department}</p>
              </div>
            )}

            <div className="flex justify-center space-x-2 mt-4">
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" />
                    Sauvegarder
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-1" />
                    Annuler
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Modifier
                </Button>
              )}
            </div>
          </div>
        </MobileCard>

        {/* Contact Information */}
        <MobileCard className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Informations de Contact
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              {isEditing ? (
                <Input
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                  type="email"
                  className="flex-1"
                />
              ) : (
                <span className="text-gray-700">{currentUser.email}</span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              {isEditing ? (
                <Input
                  value={editedUser.phone || ""}
                  onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                  placeholder="Numéro de téléphone"
                  className="flex-1"
                />
              ) : (
                <span className="text-gray-700">{currentUser.phone || "Non renseigné"}</span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <Building className="h-5 w-5 text-gray-400" />
              <span className="text-gray-700">{currentUser.department}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span className="text-gray-700">
                Embauché le {new Date(currentUser.hireDate).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>
        </MobileCard>

        {/* Leave Statistics */}
        <MobileCard className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Statistiques de Congés
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{leaveStats.totalRequests}</p>
              <p className="text-sm text-blue-700">Total demandes</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{leaveStats.approvedRequests}</p>
              <p className="text-sm text-green-700">Approuvées</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{leaveStats.daysUsed}</p>
              <p className="text-sm text-orange-700">Jours utilisés</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{leaveStats.daysRemaining}</p>
              <p className="text-sm text-purple-700">Jours restants</p>
            </div>
          </div>
        </MobileCard>

        {/* Preferences */}
        <MobileCard className="p-4">
          <h3 className="text-lg font-semibold mb-4">Préférences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Notifications Email</Label>
                <p className="text-sm text-gray-600">Recevoir les mises à jour par email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Notifications Push</Label>
                <p className="text-sm text-gray-600">Alertes sur votre appareil</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Rappels de Congés</Label>
                <p className="text-sm text-gray-600">Rappels avant les congés</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </MobileCard>

        {/* Bio Section */}
        {isEditing && (
          <MobileCard className="p-4">
            <h3 className="text-lg font-semibold mb-4">À propos</h3>
            <div className="space-y-2">
              <Label htmlFor="bio">Biographie</Label>
              <Textarea
                id="bio"
                value={editedUser.bio || ""}
                onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                placeholder="Parlez-nous de vous..."
                rows={4}
              />
            </div>
          </MobileCard>
        )}

        {!isEditing && currentUser.bio && (
          <MobileCard className="p-4">
            <h3 className="text-lg font-semibold mb-4">À propos</h3>
            <p className="text-gray-700">{currentUser.bio}</p>
          </MobileCard>
        )}

        {/* Security Settings */}
        <MobileCard className="p-4">
          <h3 className="text-lg font-semibold mb-4">Sécurité</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Changer le mot de passe
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Authentification à deux facteurs
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700"
              onClick={() => {
                if (confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
                  router.push("/login")
                }
              }}
            >
              Se déconnecter
            </Button>
          </div>
        </MobileCard>
      </div>
    </MobileLayout>
  )
}
