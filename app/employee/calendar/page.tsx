"use client"

import { useState } from "react"
import { RouteGuard } from "@/components/auth/route-guard"
import EmployeeLayout from "@/components/layouts/employee-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, CalendarIcon, Plus, Clock } from "lucide-react"
import { useAuth } from "@/lib/auth"

export default function EmployeeCalendarPage() {
  const { user } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())

  // Mock calendar data
  const calendarEvents = [
    {
      id: 1,
      title: "Congés payés",
      startDate: "2024-01-15",
      endDate: "2024-01-19",
      type: "vacation",
      status: "approved",
      duration: 5,
    },
    {
      id: 2,
      title: "Formation",
      startDate: "2024-01-22",
      endDate: "2024-01-22",
      type: "training",
      status: "approved",
      duration: 1,
    },
    {
      id: 3,
      title: "Congés maladie",
      startDate: "2024-01-28",
      endDate: "2024-01-30",
      type: "sick",
      status: "pending",
      duration: 3,
    },
  ]

  const upcomingLeaves = [
    {
      id: 1,
      type: "Congés payés",
      startDate: "15 Jan 2024",
      endDate: "19 Jan 2024",
      duration: "5 jours",
      status: "approved",
    },
    {
      id: 2,
      type: "Formation",
      startDate: "22 Jan 2024",
      endDate: "22 Jan 2024",
      duration: "1 jour",
      status: "approved",
    },
    {
      id: 3,
      type: "Congés maladie",
      startDate: "28 Jan 2024",
      endDate: "30 Jan 2024",
      duration: "3 jours",
      status: "pending",
    },
  ]

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ]

  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const hasEvent = (day: number) => {
    if (!day) return false
    const dateStr = `2024-01-${day.toString().padStart(2, "0")}`
    return calendarEvents.some((event) => dateStr >= event.startDate && dateStr <= event.endDate)
  }

  const getEventForDay = (day: number) => {
    if (!day) return null
    const dateStr = `2024-01-${day.toString().padStart(2, "0")}`
    return calendarEvents.find((event) => dateStr >= event.startDate && dateStr <= event.endDate)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approuvé"
      case "pending":
        return "En attente"
      case "rejected":
        return "Rejeté"
      default:
        return status
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const days = getDaysInMonth(currentDate)

  return (
    <RouteGuard allowedRoles={["employee"]}>
      <EmployeeLayout activeTab="calendar">
        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mon Calendrier</h1>
              <p className="text-gray-600">Planification de mes congés</p>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle demande
            </Button>
          </div>

          {/* Calendar */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span>
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </span>
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {dayNames.map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  const event = day ? getEventForDay(day) : null
                  return (
                    <div
                      key={index}
                      className={`
                        p-2 h-12 text-center text-sm border rounded-lg relative
                        ${day ? "hover:bg-gray-50 cursor-pointer" : ""}
                        ${hasEvent(day || 0) ? "bg-blue-50 border-blue-200" : "border-gray-200"}
                      `}
                    >
                      {day && (
                        <>
                          <span className={`${hasEvent(day) ? "font-bold text-blue-600" : ""}`}>{day}</span>
                          {event && (
                            <div
                              className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-lg ${
                                event.status === "approved"
                                  ? "bg-green-500"
                                  : event.status === "pending"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                            />
                          )}
                        </>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-600">Approuvé</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span className="text-sm text-gray-600">En attente</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-sm text-gray-600">Rejeté</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Leaves */}
          <Card>
            <CardHeader>
              <CardTitle>Congés à venir</CardTitle>
              <CardDescription>Vos prochaines absences planifiées</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingLeaves.map((leave) => (
                  <div key={leave.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <CalendarIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{leave.type}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {leave.startDate} - {leave.endDate}
                            </span>
                          </div>
                          <span>({leave.duration})</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(leave.status)}>{getStatusText(leave.status)}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">25</p>
                <p className="text-sm text-gray-600">Jours restants</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">5</p>
                <p className="text-sm text-gray-600">Jours utilisés</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </EmployeeLayout>
    </RouteGuard>
  )
}
