"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, BarChart3, TrendingUp, Users, Calendar, Clock, CheckCircle } from "lucide-react"
import MobileLayout from "@/components/mobile-layout"
import MobileCard from "@/components/mobile-card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockLeaveRequests } from "@/lib/data"
import { useAuth } from "@/lib/auth"

export default function AnalyticsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Authentication check
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login")
      } else if (user?.role !== "hr" && user?.role !== "manager") {
        router.push("/")
      }
    }
  }, [isAuthenticated, isLoading, router, user])

  const totalRequests = mockLeaveRequests.length
  const approvedRequests = mockLeaveRequests.filter((req) => req.status === "approved").length
  const rejectedRequests = mockLeaveRequests.filter((req) => req.status === "rejected").length
  const pendingRequests = mockLeaveRequests.filter((req) => req.status === "pending").length

  const approvalRate = Math.round((approvedRequests / Math.max(approvedRequests + rejectedRequests, 1)) * 100)
  const avgProcessingTime = 2.5 // Mock data in days
  const employeeSatisfaction = 4.2 // Mock rating out of 5

  const leaveTypeStats = [
    { type: "Congé Annuel", count: 8, percentage: 50 },
    { type: "Congé Maladie", count: 3, percentage: 19 },
    { type: "Congé Personnel", count: 2, percentage: 13 },
    { type: "Autres", count: 3, percentage: 18 },
  ]

  const monthlyTrends = [
    { month: "Jan", requests: 5, approved: 4 },
    { month: "Fév", requests: 8, approved: 7 },
    { month: "Mar", requests: 6, approved: 5 },
    { month: "Avr", requests: 9, approved: 8 },
    { month: "Mai", requests: 7, approved: 6 },
    { month: "Juin", requests: 4, approved: 4 },
  ]

  const departmentAnalytics = [
    { name: "Engineering", requests: 12, approval: 92, avgDays: 3.2 },
    { name: "Human Resources", requests: 8, approval: 88, avgDays: 2.8 },
    { name: "Marketing", requests: 6, approval: 83, avgDays: 3.5 },
    { name: "Sales", requests: 4, approval: 100, avgDays: 2.1 },
  ]

  const handleExport = (type: "monthly" | "excel") => {
    // Mock export functionality
    alert(`Export ${type} en cours...`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Chargement des analytics...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || (user?.role !== "hr" && user?.role !== "manager")) {
    return null
  }

  return (
    <MobileLayout activeTab="team" userRole="hr">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => router.push("/hr-dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-purple-900">Analyses & Rapports</h1>
            <p className="text-sm text-purple-600">Insights et métriques</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <MobileCard className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-900">{approvalRate}%</p>
                <p className="text-sm text-green-700">Taux d&apos;approbation</p>
              </div>
            </div>
          </MobileCard>

          <MobileCard className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">{avgProcessingTime}j</p>
                <p className="text-sm text-blue-700">Temps moyen</p>
              </div>
            </div>
          </MobileCard>

          <MobileCard className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-900">{employeeSatisfaction}</p>
                <p className="text-sm text-purple-700">Satisfaction /5</p>
              </div>
            </div>
          </MobileCard>

          <MobileCard className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-900">{totalRequests}</p>
                <p className="text-sm text-orange-700">Total demandes</p>
              </div>
            </div>
          </MobileCard>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
            <TabsTrigger value="trends">Tendances</TabsTrigger>
            <TabsTrigger value="departments">Départements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Leave Types Distribution */}
            <MobileCard className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                Types de Congés
              </h3>
              <div className="space-y-3">
                {leaveTypeStats.map((stat) => (
                  <div key={stat.type} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{stat.type}</span>
                      <span className="text-sm text-gray-600">
                        {stat.count} ({stat.percentage}%)
                      </span>
                    </div>
                    <Progress value={stat.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </MobileCard>

            {/* Status Breakdown */}
            <MobileCard className="p-4">
              <h3 className="text-lg font-semibold mb-4">Répartition des Statuts</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{approvedRequests}</p>
                  <p className="text-sm text-green-700">Approuvées</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{pendingRequests}</p>
                  <p className="text-sm text-orange-700">En attente</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{rejectedRequests}</p>
                  <p className="text-sm text-red-700">Rejetées</p>
                </div>
              </div>
            </MobileCard>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4 mt-4">
            {/* Monthly Trends */}
            <MobileCard className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                Tendances Mensuelles
              </h3>
              <div className="space-y-3">
                {monthlyTrends.map((trend) => (
                  <div key={trend.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{trend.month}</p>
                      <p className="text-sm text-gray-600">{trend.requests} demandes</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">{trend.approved} approuvées</p>
                      <p className="text-xs text-gray-500">
                        {Math.round((trend.approved / trend.requests) * 100)}% taux
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </MobileCard>

            {/* Forecasting */}
            <MobileCard className="p-4">
              <h3 className="text-lg font-semibold mb-4">Prévisions</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="font-medium text-blue-900">Juillet - Prévision</p>
                  <p className="text-sm text-blue-700">~12 demandes attendues (+30% vs juin)</p>
                  <p className="text-xs text-blue-600">Période de vacances d&apos;été</p>
                </div>
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="font-medium text-orange-900">Août - Alerte</p>
                  <p className="text-sm text-orange-700">Pic attendu: ~18 demandes</p>
                  <p className="text-xs text-orange-600">Planification recommandée</p>
                </div>
              </div>
            </MobileCard>
          </TabsContent>

          <TabsContent value="departments" className="space-y-4 mt-4">
            {/* Department Analytics */}
            <MobileCard className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-purple-600" />
                Analyse par Département
              </h3>
              <div className="space-y-3">
                {departmentAnalytics.map((dept) => (
                  <div key={dept.name} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{dept.name}</h4>
                      <span className="text-sm text-gray-600">{dept.requests} demandes</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Taux d&apos;approbation</p>
                        <p className="font-bold text-green-600">{dept.approval}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Temps moyen</p>
                        <p className="font-bold text-blue-600">{dept.avgDays}j</p>
                      </div>
                    </div>
                    <Progress value={dept.approval} className="h-2 mt-2" />
                  </div>
                ))}
              </div>
            </MobileCard>

            {/* Department Comparison */}
            <MobileCard className="p-4">
              <h3 className="text-lg font-semibold mb-4">Comparaison des Performances</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Meilleur taux d&apos;approbation</span>
                  <span className="font-bold text-green-600">Sales (100%)</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Traitement le plus rapide</span>
                  <span className="font-bold text-blue-600">Sales (2.1j)</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Plus actif</span>
                  <span className="font-bold text-purple-600">Engineering (12 demandes)</span>
                </div>
              </div>
            </MobileCard>
          </TabsContent>
        </Tabs>

        {/* Export Options */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-12" onClick={() => handleExport("monthly")}>
            <Calendar className="h-5 w-5 mr-2" />
            Rapport Mensuel
          </Button>
          <Button variant="outline" className="h-12" onClick={() => handleExport("excel")}>
            <BarChart3 className="h-5 w-5 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>
    </MobileLayout>
  )
}
