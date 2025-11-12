"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { authAPI, type User, type LoginCredentials, type SignupData } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (userData: SignupData) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (profileData: Partial<User>) => Promise<void>
  refreshUser: () => Promise<void>
  connectionStatus: "connected" | "disconnected" | "checking"
  retryConnection: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "checking">("checking")

  const isAuthenticated = !!user

  useEffect(() => {
    // Check if user is logged in on mount
    const initAuth = async () => {
      try {
        console.log("[v0] Initializing authentication")

        setConnectionStatus("checking")
        const isConnected = await authAPI.checkConnection()
        setConnectionStatus(isConnected ? "connected" : "disconnected")

        if (!isConnected) {
          console.warn("[v0] Backend server is not reachable")
          setIsLoading(false)
          return
        }

        // Attempt to load user from localStorage first
        const storedUser = localStorage.getItem("user")
        const storedToken = localStorage.getItem("access_token")

        if (storedUser && storedToken) {
          try {
            const parsedUser: User = JSON.parse(storedUser)
            setUser(parsedUser)
            // Optionally, validate the token with the backend
            // await authAPI.getCurrentUser(); // This would re-validate the token
            console.log("[v0] User data loaded from localStorage")
            console.log("[v0] Stored token on init:", storedToken)
            console.log("[v0] Stored user on init:", storedUser)
          } catch (parseError) {
            console.error("[v0] Failed to parse user from localStorage:", parseError)
            localStorage.removeItem("user")
            localStorage.removeItem("access_token")
          }
        }

        if (authAPI.isAuthenticated()) { // Always fetch if authenticated, to ensure fresh data
          console.log("[v0] Found existing token, fetching user profile")
          try {
            const currentUser = await authAPI.getCurrentUser()
            setUser(currentUser)
            localStorage.setItem("user", JSON.stringify(currentUser))
            console.log("[v0] User profile loaded successfully")
          } catch (fetchError: any) {
            console.error("[v0] Failed to fetch current user during initAuth:", fetchError)
            if (fetchError.message.includes("Session expired")) {
              await logout() // Log out if session expired
            }
            throw fetchError
          }
        }
      } catch (error: any) {
        console.error("[v0] Failed to initialize auth:", error)
        if (error.isNetworkError) {
          setConnectionStatus("disconnected")
        }
        // Clear invalid token
        localStorage.removeItem("access_token")
        localStorage.removeItem("user")
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      console.log("[v0] Attempting login")
      const response = await authAPI.login(credentials)
      setUser(response.user)
      setConnectionStatus("connected")
      // Store token and user data in localStorage for persistence
      localStorage.setItem("access_token", response.access_token)
      localStorage.setItem("user", JSON.stringify(response.user))
      console.log("[v0] Login successful, user state updated")
      console.log("[v0] Stored access_token after login:", response.access_token)
      console.log("[v0] Stored user after login:", response.user)
      console.log("[v0] isAuthenticated after login:", authAPI.isAuthenticated())
      console.log("[v0] User object after login:", response.user)
    } catch (error: any) {
      console.error("[v0] Login failed:", error)
      if (error.isNetworkError) {
        setConnectionStatus("disconnected")
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (userData: SignupData) => {
    setIsLoading(true)
    try {
      console.log("[v0] Attempting signup")
      const response = await authAPI.signup(userData)
      setUser(response.user)
      setConnectionStatus("connected")
      // Store token and user data in localStorage for persistence
      localStorage.setItem("access_token", response.access_token)
      localStorage.setItem("user", JSON.stringify(response.user))
      console.log("[v0] Signup successful, user state updated")
    } catch (error: any) {
      console.error("[v0] Signup failed:", error)
      if (error.isNetworkError) {
        setConnectionStatus("disconnected")
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      console.log("[v0] Attempting logout")
      await authAPI.logout()
      setUser(null)
      // Clear token and user data from localStorage on logout
      localStorage.removeItem("access_token")
      localStorage.removeItem("user")
      console.log("[v0] Logout successful, user state cleared")
    } catch (error: any) {
      console.error("[v0] Logout error:", error)
      // Always clear user state even if API call fails
      setUser(null)
      localStorage.removeItem("access_token")
      localStorage.removeItem("user")
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      console.log("[v0] Updating user profile")
      const updatedUser = await authAPI.updateProfile(profileData)
      setUser(updatedUser)
      // Update user data in localStorage after profile update
      localStorage.setItem("user", JSON.stringify(updatedUser))
      console.log("[v0] Profile updated successfully")
    } catch (error: any) {
      console.error("[v0] Failed to update profile:", error)
      throw error
    }
  }

  const refreshUser = async () => {
    try {
      console.log("[v0] Refreshing user data")
      if (authAPI.isAuthenticated()) {
        console.log("[v0] Token present for refresh:", localStorage.getItem("access_token"))
        const currentUser = await authAPI.getCurrentUser()
        setUser(currentUser)
        setConnectionStatus("connected")
        // Update user data in localStorage after refresh
        localStorage.setItem("user", JSON.stringify(currentUser))
        console.log("[v0] User data refreshed successfully")
      }
    } catch (error: any) {
      console.error("[v0] Failed to refresh user:", error)
      if (error.message.includes("Session expired")) {
        await logout()
      } else if (error.isNetworkError) {
        setConnectionStatus("disconnected")
      }
    }
  }

  const retryConnection = async () => {
    setConnectionStatus("checking")
    const isConnected = await authAPI.checkConnection()
    setConnectionStatus(isConnected ? "connected" : "disconnected")
  
    if (isConnected && authAPI.isAuthenticated()) {
      try {
        await refreshUser()
      } catch (error) {
        console.error("[v0] Failed to refresh user after reconnection:", error)
        // Clear local storage if refresh fails, indicating an invalid/expired token
        localStorage.removeItem("access_token")
        localStorage.removeItem("user")
        setUser(null)
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        signup,
        logout,
        updateProfile,
        refreshUser,
        connectionStatus,
        retryConnection,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
