"use client"

import { useState } from "react"
import { Users, Search, Mail, Briefcase } from "lucide-react"
import HRLayout from "@/components/layouts/hr-layout"
import MobileCard from "@/components/mobile-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { RouteGuard } from "@/components/auth/route-guard"
import { mockEmployees, mockLeaveRequests } from "@/lib/data"
import { useRouter } from "next/navigation"

function HRTeamsContent() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")

  const departments = [...new Set(mockEmployees.map((emp) => emp.department))]

  const filteredEmployees = mockEmployees.filter((employee) => {
    const matchesSearch =
      `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === "all" || employee.department === filterDepartment

    return matchesSearch && matchesDepartment
  })

  const getEmployeeStats = (employeeId: string) => {
    const requests = mockLeaveRequests.filter((req) => req.employeeId === employeeId)
    return {
      total: requests.length,
      pending: requests.filter((req) => req.status === "pending").length,
      approved: requests.filter((req) => req.status === "approved").length,
      rejected: requests.filter((req) => req.status === "rejected").length,
    }
  }

  const getStatusColor = (pendingCount: number) => {
    if (pendingCount > 2) return "text-red-600 bg-red-50"
    if (pendingCount > 0) return "text-orange-600 bg-orange-50"
    return "text-green-600 bg-green-50"
  }

  return (
    <HRLayout activeTab="teams">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-purple-900">Gestion des Équipes</h1>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            {mockEmployees.length} employés
          </Badge>
        </div>

        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un employé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2">
            <Button
              variant={filterDepartment === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterDepartment("all")}
              className="whitespace-nowrap"
            >
              Tous
            </Button>
            {departments.map((dept) => (
              <Button
                key={dept}
                variant={filterDepartment === dept ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterDepartment(dept)}
                className="whitespace-nowrap"
              >
                {dept}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats par département */}
        <div className="grid grid-cols-2 gap-3">
          <MobileCard className="p-3 text-center">
            <div className="text-lg font-bold text-purple-600">{departments.length}</div>
            <div className="text-xs text-gray-600">Départements</div>
          </MobileCard>
          <MobileCard className="p-3 text-center">
            <div className="text-lg font-bold text-blue-600">
              {mockLeaveRequests.filter((req) => req.status === "pending").length}
            </div>
            <div className="text-xs text-gray-600">Demandes actives</div>
          </MobileCard>
        </div>

        {/* Liste des employés */}
        <div className="space-y-3">
          {filteredEmployees.length === 0 ? (
            <MobileCard className="p-6 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">Aucun employé trouvé</p>
              <p className="text-sm text-gray-500">Essayez de modifier vos critères de recherche</p>
            </MobileCard>
          ) : (
            filteredEmployees.map((employee) => {
              const stats = getEmployeeStats(employee.id)

              return (
                <MobileCard
                  key={employee.id}
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => router.push(`/hr/employees/${employee.id}`)}
                >
                  {/* En-tête employé */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-purple-600">
                          {employee.firstName[0]}
                          {employee.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{employee.position}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {employee.department}
                        </Badge>
                      </div>
                    </div>

                    {/* Statut des demandes */}
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(stats.pending)}`}>
                      {stats.pending > 0 ? `${stats.pending} en attente` : "À jour"}
                    </div>
                  </div>

                  {/* Informations de contact */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{employee.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Briefcase className="h-4 w-4" />
                      <span>{employee.department}</span>
                    </div>
                  </div>

                  {/* Stats des demandes */}
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{stats.total}</p>
                      <p className="text-xs text-gray-600">Total</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-orange-600">{stats.pending}</p>
                      <p className="text-xs text-gray-600">Attente</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-green-600">{stats.approved}</p>
                      <p className="text-xs text-gray-600">Approuvé</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-red-600">{stats.rejected}</p>
                      <p className="text-xs text-gray-600">Rejeté</p>
                    </div>
                  </div>
                </MobileCard>
              )
            })
          )}
        </div>
      </div>
    </HRLayout>
  )
}

export default function HRTeams() {
  return (
    <RouteGuard allowedRoles={["hr", "manager"]} requireAuth={true}>
      <HRTeamsContent />
    </RouteGuard>
  )
}
