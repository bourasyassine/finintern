"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, Plus, Users, Calendar, TrendingUp, Mail, Phone, MoreVertical } from 'lucide-react'
import MobileLayout from "@/components/mobile-layout"
import MobileCard from "@/components/mobile-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { mockEmployees, mockLeaveRequests } from "@/lib/data"
import { useAuth } from "@/lib/auth"

export default function TeamsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [showAddEmployee, setShowAddEmployee] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    department: "",
  })

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

  const filteredEmployees = mockEmployees.filter((employee) => {
    const matchesSearch =
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  const departments = Array.from(new Set(mockEmployees.map((emp) => emp.department)))

  const getEmployeeStats = (employeeId: string) => {
    const requests = mockLeaveRequests.filter((req) => req.employeeId === employeeId)
    return {
      total: requests.length,
      pending: requests.filter((req) => req.status === "pending").length,
      approved: requests.filter((req) => req.status === "approved").length,
      daysUsed: requests
        .filter((req) => req.status === "approved")
        .reduce((total, req) => {
          const start = new Date(req.startDate)
          const end = new Date(req.endDate)
          const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
          return total + days
        }, 0),
    }
  }

  const departmentStats = departments.map((dept) => {
    const deptEmployees = mockEmployees.filter((emp) => emp.department === dept)
    const deptRequests = mockLeaveRequests.filter((req) => deptEmployees.some((emp) => emp.id === req.employeeId))
    return {
      name: dept,
      employeeCount: deptEmployees.length,
      pendingRequests: deptRequests.filter((req) => req.status === "pending").length,
      approvalRate: Math.round(
        (deptRequests.filter((req) => req.status === "approved").length /
          Math.max(deptRequests.filter((req) => req.status !== "pending").length, 1)) *
          100,
      ),
    }
  })

  const handleAddEmployee = async () => {
    if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.email || !newEmployee.department) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Employé ajouté",
        description: `${newEmployee.firstName} ${newEmployee.lastName} a été ajouté avec succès`,
      })

      setShowAddEmployee(false)
      setNewEmployee({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        position: "",
        department: "",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l&apos;ajout",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContactEmployee = (employee: any, type: "email" | "phone") => {
    if (type === "email") {
      window.location.href = `mailto:${employee.email}`
    } else {
      window.location.href = `tel:${employee.phone}`
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || (user?.role !== "hr" && user?.role !== "manager")) {
    return null
  }

  return (
    <MobileLayout activeTab="team" userRole="hr">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => router.push("/hr-dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-purple-900">Gestion des Équipes</h1>
              <p className="text-sm text-purple-600">{filteredEmployees.length} employé(s)</p>
            </div>
          </div>
          <Dialog open={showAddEmployee} onOpenChange={setShowAddEmployee}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un Employé</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      value={newEmployee.firstName}
                      onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      value={newEmployee.lastName}
                      onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    placeholder="john.doe@entreprise.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
                <div>
                  <Label htmlFor="position">Poste</Label>
                  <Input
                    id="position"
                    value={newEmployee.position}
                    onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                    placeholder="Développeur"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Département *</Label>
                  <Select
                    value={newEmployee.department}
                    onValueChange={(value) => setNewEmployee({ ...newEmployee, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleAddEmployee} className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : null}
                    Ajouter
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddEmployee(false)} className="flex-1">
                    Annuler
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Department Stats */}
        <div className="grid grid-cols-2 gap-4">
          {departmentStats.slice(0, 4).map((dept) => (
            <MobileCard key={dept.name} className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">{dept.name}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{dept.employeeCount}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {dept.approvalRate}% approuvé
                  </Badge>
                </div>
                {dept.pendingRequests > 0 && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-orange-400" />
                    <span className="text-xs text-orange-600">{dept.pendingRequests} en attente</span>
                  </div>
                )}
              </div>
            </MobileCard>
          ))}
        </div>

        {/* Search and Filters */}
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

          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les départements" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les départements</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="employees" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="employees">Employés</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="employees" className="space-y-3 mt-4">
            {filteredEmployees.map((employee) => {
              const stats = getEmployeeStats(employee.id)
              return (
                <MobileCard key={employee.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-purple-600">
                            {employee.firstName[0]}
                            {employee.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {employee.firstName} {employee.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{employee.position}</p>
                          <p className="text-xs text-gray-500">{employee.department}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-blue-600">{stats.total}</p>
                        <p className="text-xs text-gray-600">Demandes</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-600">{stats.approved}</p>
                        <p className="text-xs text-gray-600">Approuvées</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-orange-600">{stats.daysUsed}</p>
                        <p className="text-xs text-gray-600">Jours pris</p>
                      </div>
                    </div>

                    {stats.pending > 0 && (
                      <div className="p-2 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-sm text-orange-800">
                          {stats.pending} demande{stats.pending > 1 ? "s" : ""} en attente
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleContactEmployee(employee, "email")}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleContactEmployee(employee, "phone")}
                        disabled={!employee.phone}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Appeler
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => router.push(`/hr-dashboard/employees/${employee.id}`)}
                      >
                        Voir détails
                      </Button>
                    </div>
                  </div>
                </MobileCard>
              )
            })}
          </TabsContent>

          <TabsContent value="performance" className="space-y-3 mt-4">
            <MobileCard className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                Top Performers
              </h3>
              <div className="space-y-3">
                {mockEmployees.slice(0, 3).map((employee, index) => {
                  const stats = getEmployeeStats(employee.id)
                  return (
                    <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-purple-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {employee.firstName} {employee.lastName}
                          </p>
                          <p className="text-xs text-gray-600">{employee.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-600">{stats.approved} approuvées</p>
                        <p className="text-xs text-gray-500">{stats.daysUsed} jours</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </MobileCard>

            <MobileCard className="p-4">
              <h3 className="text-lg font-semibold mb-4">Tendances par Département</h3>
              <div className="space-y-3">
                {departmentStats.map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{dept.name}</p>
                      <p className="text-sm text-gray-600">{dept.employeeCount} employés</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{dept.approvalRate}%</p>
                      <p className="text-xs text-gray-500">Taux d&apos;approbation</p>
                    </div>
                  </div>
                ))}
              </div>
            </MobileCard>
          </TabsContent>
        </Tabs>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun employé trouvé</h3>
            <p className="text-gray-600">
              {searchTerm || departmentFilter !== "all"
                ? "Aucun employé ne correspond à vos filtres"
                : "Aucun employé n&apos;est enregistré"}
            </p>
          </div>
        )}
      </div>
    </MobileLayout>
  )
}
