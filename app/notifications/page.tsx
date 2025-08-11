"use client"

import { useState } from "react"
import { Bell, X, Clock, AlertCircle, Info, CheckCircle } from "lucide-react"
import MobileLayout from "@/components/mobile-layout"
import MobileCard from "@/components/mobile-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Notification {
  id: string
  type: "approval" | "rejection" | "reminder" | "info" | "urgent"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionRequired?: boolean
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "approval",
      title: "Demande approuvée",
      message: "Votre demande de congé annuel du 15-20 mars a été approuvée par Sarah Johnson.",
      timestamp: "2024-01-10T09:30:00Z",
      read: false,
    },
    {
      id: "2",
      type: "rejection",
      title: "Demande rejetée",
      message: "Votre demande de congé personnel du 5-7 février a été rejetée. Motif: Période de forte activité.",
      timestamp: "2024-01-09T14:15:00Z",
      read: false,
    },
    {
      id: "3",
      type: "reminder",
      title: "Rappel: Congé à venir",
      message: "Votre congé annuel commence dans 3 jours (15 mars). N'oubliez pas de finaliser vos tâches.",
      timestamp: "2024-01-08T10:00:00Z",
      read: true,
    },
    {
      id: "4",
      type: "info",
      title: "Nouvelle politique de congés",
      message: "Les nouvelles règles de congés sont maintenant en vigueur. Consultez le guide mis à jour.",
      timestamp: "2024-01-07T16:45:00Z",
      read: true,
    },
    {
      id: "5",
      type: "urgent",
      title: "Action requise",
      message: "Votre demande de congé maladie nécessite un certificat médical. Veuillez le fournir sous 48h.",
      timestamp: "2024-01-06T11:20:00Z",
      read: false,
      actionRequired: true,
    },
  ])

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "approval":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "rejection":
        return <X className="h-5 w-5 text-red-600" />
      case "reminder":
        return <Clock className="h-5 w-5 text-blue-600" />
      case "urgent":
        return <AlertCircle className="h-5 w-5 text-orange-600" />
      case "info":
        return <Info className="h-5 w-5 text-gray-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "approval":
        return "border-green-200 bg-green-50"
      case "rejection":
        return "border-red-200 bg-red-50"
      case "reminder":
        return "border-blue-200 bg-blue-50"
      case "urgent":
        return "border-orange-200 bg-orange-50"
      case "info":
        return "border-gray-200 bg-gray-50"
      default:
        return "border-gray-200 bg-white"
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "À l'instant"
    if (diffInHours < 24) return `Il y a ${diffInHours}h`
    if (diffInHours < 48) return "Hier"
    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })
  }

  const unreadCount = notifications.filter((n) => !n.read).length
  const urgentCount = notifications.filter((n) => n.type === "urgent" && !n.read).length

  return (
    <MobileLayout activeTab="notifications">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600">
                {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Tout marquer lu
            </Button>
          )}
        </div>

        {/* Urgent Alerts */}
        {urgentCount > 0 && (
          <MobileCard className="p-4 border-orange-200 bg-orange-50">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <p className="font-medium text-orange-900">
                  {urgentCount} notification{urgentCount > 1 ? "s" : ""} urgente{urgentCount > 1 ? "s" : ""}
                </p>
                <p className="text-sm text-orange-700">Action requise immédiatement</p>
              </div>
            </div>
          </MobileCard>
        )}

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">
              Toutes
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">Non lues</TabsTrigger>
            <TabsTrigger value="urgent">Urgentes</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3 mt-4">
            {notifications.map((notification) => (
              <MobileCard
                key={notification.id}
                className={`p-4 ${getNotificationColor(notification.type)} ${
                  !notification.read ? "border-l-4 border-l-blue-500" : ""
                }`}
                interactive
                onClick={() => markAsRead(notification.id)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <h3 className={`font-semibold ${!notification.read ? "text-gray-900" : "text-gray-700"}`}>
                          {notification.title}
                        </h3>
                        <p className={`text-sm mt-1 ${!notification.read ? "text-gray-800" : "text-gray-600"}`}>
                          {notification.message}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotification(notification.id)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{formatTime(notification.timestamp)}</span>
                    {notification.actionRequired && (
                      <Button size="sm" variant="outline">
                        Action requise
                      </Button>
                    )}
                  </div>
                </div>
              </MobileCard>
            ))}
          </TabsContent>

          <TabsContent value="unread" className="space-y-3 mt-4">
            {notifications
              .filter((n) => !n.read)
              .map((notification) => (
                <MobileCard
                  key={notification.id}
                  className={`p-4 ${getNotificationColor(notification.type)} border-l-4 border-l-blue-500`}
                  interactive
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                          <p className="text-sm text-gray-800 mt-1">{notification.message}</p>
                        </div>
                      </div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{formatTime(notification.timestamp)}</span>
                      {notification.actionRequired && (
                        <Button size="sm" variant="outline">
                          Action requise
                        </Button>
                      )}
                    </div>
                  </div>
                </MobileCard>
              ))}
          </TabsContent>

          <TabsContent value="urgent" className="space-y-3 mt-4">
            {notifications
              .filter((n) => n.type === "urgent")
              .map((notification) => (
                <MobileCard
                  key={notification.id}
                  className="p-4 border-orange-200 bg-orange-50 border-l-4 border-l-orange-500"
                  interactive
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-orange-900">{notification.title}</h3>
                          <p className="text-sm text-orange-800 mt-1">{notification.message}</p>
                        </div>
                      </div>
                      {!notification.read && <div className="w-2 h-2 bg-orange-500 rounded-full ml-2"></div>}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-orange-600">{formatTime(notification.timestamp)}</span>
                      {notification.actionRequired && (
                        <Button size="sm" variant="destructive">
                          Action requise
                        </Button>
                      )}
                    </div>
                  </div>
                </MobileCard>
              ))}
          </TabsContent>
        </Tabs>

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification</h3>
            <p className="text-gray-600">Vous êtes à jour ! Toutes vos notifications ont été traitées.</p>
          </div>
        )}
      </div>
    </MobileLayout>
  )
}
