"use client"

import { useState } from "react"
import { RouteGuard } from "@/components/auth/route-guard"
import HRLayout from "@/components/layouts/hr-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, TrendingDown, Users, Clock, Download, Filter } from "lucide-react"

export default function HRAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const analyticsData = {
    overview: {
      totalRequests: 156,
      approvedRequests: 142,
      pendingRequests: 8,
      rejectedRequests: 6,
      averageProcessingTime: "2.3 jours",
    },
    departmentStats: [
      { name: "Engineering", requests: 45, approved: 42, pending: 2, rejected: 1, utilizationRate: 78 },
      { name: "Marketing", requests: 32, approved: 30, pending: 1, rejected: 1, utilizationRate: 65 },
      { name: "Sales", requests: 28, approved: 25, pending: 2, rejected: 1, utilizationRate: 72 },
      { name: "HR", requests: 18, approved: 17, pending: 1, rejected: 0, utilizationRate: 85 },
      { name: "Finance", requests: 15, approved: 14, pending: 1, rejected: 0, utilizationRate: 68 },
      { name: "Operations", requests: 18, approved: 14, pending: 1, rejected: 3, utilizationRate: 55 },
    ],
    monthlyTrends: [
      { month: "Jan", requests: 45, approved: 42 },
      { month: "Fév", requests: 52, approved: 48 },
      { month: "Mar", requests: 48, approved: 45 },
      { month: "Avr", requests: 38, approved: 35 },
      { month: "Mai", requests: 42, approved: 40 },
      { month: "Juin", requests: 35, approved: 32 },
    ],
    leaveTypes: [
      { type: "Congés payés", count: 89, percentage: 57 },
      { type: "Congés maladie", count: 28, percentage: 18 },
      { type: "Congés maternité", count: 12, percentage: 8 },
      { type: "Congés formation", count: 15, percentage: 10 },
      { type: "Autres", count: 12, percentage: 7 },
    ],
  }

  return (
    <RouteGuard allowedRoles={["hr", "manager"]}>
      <HRLayout activeTab="analytics">
        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics RH</h1>
              <p className="text-gray-600">Analyses et rapports des congés</p>
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

          {/* Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Demandes</p>
                    <p className="text-2xl font-bold">{analyticsData.overview.totalRequests}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+12% ce mois</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Approuvées</p>
                    <p className="text-2xl font-bold text-green-600">{analyticsData.overview.approvedRequests}</p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600">
                    {Math.round((analyticsData.overview.approvedRequests / analyticsData.overview.totalRequests) * 100)}
                    % du total
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">En Attente</p>
                    <p className="text-2xl font-bold text-orange-600">{analyticsData.overview.pendingRequests}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600">
                    Traitement moyen: {analyticsData.overview.averageProcessingTime}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Rejetées</p>
                    <p className="text-2xl font-bold text-red-600">{analyticsData.overview.rejectedRequests}</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-600" />
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600">
                    {Math.round((analyticsData.overview.rejectedRequests / analyticsData.overview.totalRequests) * 100)}
                    % du total
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <Tabs defaultValue="departments" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="departments">Par Département</TabsTrigger>
              <TabsTrigger value="trends">Tendances</TabsTrigger>
              <TabsTrigger value="types">Types de Congés</TabsTrigger>
            </TabsList>

            <TabsContent value="departments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques par Département</CardTitle>
                  <CardDescription>Utilisation des congés par département</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.departmentStats.map((dept) => (
                      <div key={dept.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{dept.name}</span>
                          <div className="flex space-x-2">
                            <Badge variant="outline">{dept.requests} demandes</Badge>
                            <Badge variant="secondary">{dept.utilizationRate}% utilisation</Badge>
                          </div>
                        </div>
                        <Progress value={dept.utilizationRate} className="h-2" />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Approuvées: {dept.approved}</span>
                          <span>En attente: {dept.pending}</span>
                          <span>Rejetées: {dept.rejected}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tendances Mensuelles</CardTitle>
                  <CardDescription>Évolution des demandes sur les 6 derniers mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.monthlyTrends.map((month) => (
                      <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{month.month}</span>
                        <div className="flex items-center space-x-4">
                          <div className="text-sm">
                            <span className="text-gray-600">Demandes: </span>
                            <span className="font-medium">{month.requests}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">Approuvées: </span>
                            <span className="font-medium text-green-600">{month.approved}</span>
                          </div>
                          <div className="w-20">
                            <Progress value={(month.approved / month.requests) * 100} className="h-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="types" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Types de Congés</CardTitle>
                  <CardDescription>Répartition par type de congé</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.leaveTypes.map((type) => (
                      <div key={type.type} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{type.type}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">{type.count} demandes</span>
                            <Badge variant="outline">{type.percentage}%</Badge>
                          </div>
                        </div>
                        <Progress value={type.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </HRLayout>
    </RouteGuard>
  )
}
