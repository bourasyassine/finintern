"use client"

import { useState } from "react"
import { ArrowLeft, Settings, Bell, Shield, Users, Calendar, Globe, Zap } from "lucide-react"
import MobileLayout from "@/components/mobile-layout"
import MobileCard from "@/components/mobile-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    companyName: "Mon Entreprise",
    timezone: "Europe/Paris",
    dateFormat: "DD/MM/YYYY",
    workingDays: 5,
    annualLeaveEntitlement: 25,
    sickLeaveEntitlement: 10,
    emailNotifications: true,
    smsNotifications: false,
    desktopNotifications: true,
    autoApproval: false,
    requireManagerApproval: true,
    twoFactorAuth: false,
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    console.log("Saving settings:", settings)
    // Mock save functionality
  }

  return (
    <MobileLayout activeTab="team" userRole="hr">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/hr-dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-purple-900">Paramètres</h1>
              <p className="text-sm text-purple-600">Configuration système</p>
            </div>
          </div>
          <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
            Sauvegarder
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="policies">Politiques</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            {/* Company Settings */}
            <MobileCard className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-purple-600" />
                Paramètres Généraux
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Nom de l'entreprise</Label>
                  <Input
                    id="companyName"
                    value={settings.companyName}
                    onChange={(e) => handleSettingChange("companyName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Fuseau horaire</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange("timezone", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Paris">Europe/Paris (GMT+1)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT+0)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (GMT-5)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo (GMT+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dateFormat">Format de date</Label>
                  <Select
                    value={settings.dateFormat}
                    onValueChange={(value) => handleSettingChange("dateFormat", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="workingDays">Jours de travail par semaine</Label>
                  <Select
                    value={settings.workingDays.toString()}
                    onValueChange={(value) => handleSettingChange("workingDays", Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 jours</SelectItem>
                      <SelectItem value="6">6 jours</SelectItem>
                      <SelectItem value="7">7 jours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </MobileCard>

            {/* Regional Settings */}
            <MobileCard className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-purple-600" />
                Paramètres Régionaux
              </h3>
              <div className="space-y-4">
                <div>
                  <Label>Langue</Label>
                  <Select defaultValue="fr">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Devise</Label>
                  <Select defaultValue="eur">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </MobileCard>
          </TabsContent>

          <TabsContent value="policies" className="space-y-4 mt-4">
            {/* Leave Policies */}
            <MobileCard className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                Politiques de Congés
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="annualLeave">Congés annuels (jours/an)</Label>
                  <Input
                    id="annualLeave"
                    type="number"
                    value={settings.annualLeaveEntitlement}
                    onChange={(e) => handleSettingChange("annualLeaveEntitlement", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="sickLeave">Congés maladie (jours/an)</Label>
                  <Input
                    id="sickLeave"
                    type="number"
                    value={settings.sickLeaveEntitlement}
                    onChange={(e) => handleSettingChange("sickLeaveEntitlement", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Périodes d'interdiction</Label>
                  <Textarea placeholder="Ex: 15 décembre - 5 janvier (période de fin d'année)" rows={3} />
                </div>
              </div>
            </MobileCard>

            {/* Approval Workflow */}
            <MobileCard className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-purple-600" />
                Workflow d'Approbation
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Approbation automatique</Label>
                    <p className="text-sm text-gray-600">Pour les demandes de moins de 2 jours</p>
                  </div>
                  <Switch
                    checked={settings.autoApproval}
                    onCheckedChange={(checked) => handleSettingChange("autoApproval", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Approbation manager requise</Label>
                    <p className="text-sm text-gray-600">Toutes les demandes nécessitent une approbation</p>
                  </div>
                  <Switch
                    checked={settings.requireManagerApproval}
                    onCheckedChange={(checked) => handleSettingChange("requireManagerApproval", checked)}
                  />
                </div>
                <div>
                  <Label>Hiérarchie d'approbation</Label>
                  <Select defaultValue="manager">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manager">Manager direct</SelectItem>
                      <SelectItem value="hr">RH uniquement</SelectItem>
                      <SelectItem value="both">Manager + RH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </MobileCard>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 mt-4">
            {/* Notification Settings */}
            <MobileCard className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-purple-600" />
                Notifications
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications Email</Label>
                    <p className="text-sm text-gray-600">Recevoir les alertes par email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications SMS</Label>
                    <p className="text-sm text-gray-600">Alertes urgentes par SMS</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange("smsNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications Desktop</Label>
                    <p className="text-sm text-gray-600">Notifications navigateur</p>
                  </div>
                  <Switch
                    checked={settings.desktopNotifications}
                    onCheckedChange={(checked) => handleSettingChange("desktopNotifications", checked)}
                  />
                </div>
              </div>
            </MobileCard>

            {/* Email Templates */}
            <MobileCard className="p-4">
              <h3 className="text-lg font-semibold mb-4">Templates Email</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Template d'approbation
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Template de rejet
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Template de rappel
                </Button>
              </div>
            </MobileCard>

            {/* Security Settings */}
            <MobileCard className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-purple-600" />
                Sécurité
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Authentification à deux facteurs</Label>
                    <p className="text-sm text-gray-600">Sécurité renforcée pour les admins</p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSettingChange("twoFactorAuth", checked)}
                  />
                </div>
                <div>
                  <Label>Politique de mot de passe</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Faible (6 caractères min)</SelectItem>
                      <SelectItem value="medium">Moyenne (8 caractères + chiffres)</SelectItem>
                      <SelectItem value="high">Élevée (12 caractères + symboles)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Durée de session</Label>
                  <Select defaultValue="8h">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 heure</SelectItem>
                      <SelectItem value="4h">4 heures</SelectItem>
                      <SelectItem value="8h">8 heures</SelectItem>
                      <SelectItem value="24h">24 heures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </MobileCard>

            {/* Integrations */}
            <MobileCard className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-purple-600" />
                Intégrations
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Slack</p>
                    <p className="text-sm text-gray-600">Notifications dans Slack</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Microsoft Teams</p>
                    <p className="text-sm text-gray-600">Intégration calendrier</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Google Calendar</p>
                    <p className="text-sm text-gray-600">Synchronisation automatique</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </MobileCard>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  )
}
