"use client"

import type React from "react"

import { useState } from "react"
import { Bell, Users, FileText, Search, Menu, LogOut, BarChart3, Settings, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface HRLayoutProps {
  children: React.ReactNode
  activeTab?: string
}

export default function HRLayout({ children, activeTab = "dashboard" }: HRLayoutProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const navigationItems = [
    { id: "dashboard", icon: BarChart3, label: "Dashboard", href: "/hr-dashboard" },
    { id: "pending", icon: Clock, label: "En Attente", href: "/hr/pending" },
    { id: "requests", icon: FileText, label: "Demandes", href: "/hr/requests" },
    { id: "teams", icon: Users, label: "Équipes", href: "/hr/teams" },
    { id: "analytics", icon: BarChart3, label: "Analytics", href: "/hr/analytics" },
    { id: "settings", icon: Settings, label: "Paramètres", href: "/hr/settings" },
  ]

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="py-6">
                {user && (
                  <div className="mb-6 flex items-center space-x-3 px-3 py-4 bg-purple-50 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-purple-600">
                        {user.firstName?.[0]}
                        {user.lastName?.[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{user.position}</p>
                      <p className="text-xs text-purple-600 font-medium">Ressources Humaines</p>
                    </div>
                  </div>
                )}

                <h2 className="text-lg font-semibold mb-4">Menu RH</h2>
                <nav className="space-y-2">
                  {navigationItems.map((item) => (
                    <a
                      key={item.id}
                      href={item.href}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge variant="destructive" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </a>
                  ))}

                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Déconnexion</span>
                    </Button>
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-semibold text-gray-900">RH Dashboard</h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="p-2" onClick={() => setSearchOpen(!searchOpen)}>
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2 relative">
            <Bell className="h-5 w-5" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
            >
              8
            </Badge>
          </Button>
        </div>
      </header>

      {/* Search Bar */}
      {searchOpen && (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <Input placeholder="Rechercher employés, demandes..." className="w-full" autoFocus />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 pb-20">{children}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2">
        <div className="flex items-center justify-around">
          {navigationItems.slice(0, 5).map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center space-y-1 px-2 py-2 rounded-lg transition-colors ${
                activeTab === item.id ? "text-purple-600 bg-purple-50" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="relative">
                <item.icon className="h-4 w-4" />
                {item.badge && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center text-xs p-0"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  )
}
