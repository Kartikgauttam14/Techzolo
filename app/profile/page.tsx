"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, Building, Calendar, Settings, LogOut, Edit3, Save, X } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user, isLoading, logout, updateProfile, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    company: "",
    phone: "",
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        company: user.company || "",
        phone: user.phone || "",
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setIsUpdating(true)
    try {
      await updateProfile(formData)
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update profile:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        company: user.company || "",
        phone: user.phone || "",
      })
    }
    setIsEditing(false)
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-rose-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push("/")} className="text-rose-600 hover:text-rose-700">
                ← Back to Home
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="border-rose-200 text-rose-600 hover:bg-rose-50"
              >
                {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-rose-200 text-rose-600 hover:bg-rose-50 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm border-rose-100">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24 border-4 border-rose-100">
                    <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-500 text-white text-xl font-semibold">
                      {getInitials(user.full_name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">{user.full_name}</CardTitle>
                <CardDescription className="text-rose-600 font-medium">{user.email}</CardDescription>
                <div className="flex justify-center mt-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Active Account
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-rose-500" />
                    <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                  {user.company && (
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <Building className="h-4 w-4 text-rose-500" />
                      <span>{user.company}</span>
                    </div>
                  )}
                  {user.phone && (
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <Phone className="h-4 w-4 text-rose-500" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-rose-100">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                      <Settings className="h-5 w-5 mr-2 text-rose-500" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>Manage your account details and preferences</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                      className="pl-10 bg-gray-50 border-gray-200"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <Separator />

                {/* Editable Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-sm font-medium text-gray-700">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="full_name"
                        name="full_name"
                        type="text"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`pl-10 ${
                          isEditing
                            ? "border-rose-200 focus:border-rose-500 focus:ring-rose-500"
                            : "bg-gray-50 border-gray-200"
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                      Company
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`pl-10 ${
                          isEditing
                            ? "border-rose-200 focus:border-rose-500 focus:ring-rose-500"
                            : "bg-gray-50 border-gray-200"
                        }`}
                        placeholder="Enter your company name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`pl-10 ${
                          isEditing
                            ? "border-rose-200 focus:border-rose-500 focus:ring-rose-500"
                            : "bg-gray-50 border-gray-200"
                        }`}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Save/Cancel Buttons */}
                {isEditing && (
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isUpdating}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isUpdating}
                      className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white"
                    >
                      {isUpdating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card className="mt-6 bg-white/80 backdrop-blur-sm border-rose-100">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Account Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg">
                    <div className="text-2xl font-bold text-rose-600">1</div>
                    <div className="text-sm text-gray-600">Projects Created</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-pink-600">0</div>
                    <div className="text-sm text-gray-600">Templates Used</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-sm text-gray-600">Days Active</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
