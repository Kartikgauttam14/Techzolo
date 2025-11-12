"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  Plus,
  Smartphone,
  Globe,
  TrendingUp,
  Calendar,
  User,
  LogOut,
  Rocket,
  Code,
  Palette,
  Database,
} from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading, logout, isAuthenticated } = useAuth()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn")
    const email = localStorage.getItem("userEmail")

    if (!loggedIn) {
      router.push("/auth/login")
      return
    }

    setIsLoggedIn(true)
    setUserEmail(email || "")
  }, [router])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isLoading, isAuthenticated, router])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const projectTemplates = [
    {
      title: "Mobile App",
      description: "Create responsive mobile applications",
      icon: Smartphone,
      color: "bg-blue-500",
      features: ["React Native", "iOS & Android", "Push Notifications"],
    },
    {
      title: "Web Application",
      description: "Build modern web applications",
      icon: Globe,
      color: "bg-green-500",
      features: ["Next.js", "Responsive Design", "SEO Optimized"],
    },
    {
      title: "E-commerce Site",
      description: "Launch your online store",
      icon: TrendingUp,
      color: "bg-purple-500",
      features: ["Payment Integration", "Inventory Management", "Analytics"],
    },
    {
      title: "Portfolio Website",
      description: "Showcase your work professionally",
      icon: User,
      color: "bg-orange-500",
      features: ["Custom Design", "Gallery", "Contact Forms"],
    },
  ]

  const quickActions = [
    { title: "New Project", icon: Plus, action: () => console.log("Creating new project") },
    { title: "Templates", icon: Code, action: () => console.log("Browse templates") },
    { title: "Design Tools", icon: Palette, action: () => console.log("Open design tools") },
    { title: "Database", icon: Database, action: () => console.log("Manage database") },
  ]

  if (!isLoggedIn) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-bold text-gray-900">TECH ZOLO Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.full_name || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Rocket className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Welcome to Your Creative Space</h2>
              <p className="text-gray-600">Start building amazing projects with Tech Zolo's powerful tools</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={action.action}>
              <CardContent className="p-6 text-center">
                <action.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold text-sm">{action.title}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Project Templates */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Start with a Template</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projectTemplates.map((template, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${template.color} flex items-center justify-center mb-4`}>
                    <template.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {template.features.map((feature, featureIndex) => (
                      <Badge key={featureIndex} variant="secondary" className="text-xs mr-2">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full" onClick={() => console.log(`Creating ${template.title}`)}>
                    Create Project
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h3>
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No recent activity</h4>
                <p className="text-gray-600 mb-4">Start creating your first project to see activity here</p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
