"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowLeft,
  Chrome,
  Github,
  Linkedin,
  Apple,
  Shield,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading: authLoading, isAuthenticated } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: true,
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/")
    }
  }, [authLoading, isAuthenticated, router])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long"
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter"
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one lowercase letter"
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number"
    } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one special character"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      await login({
        email: formData.email,
        password: formData.password,
      })

      setSuccessMessage("Login successful! Redirecting...")

      setTimeout(() => {
        router.push("/")
      }, 1500)
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle specific error types from API
      if (error.errors) {
        // Field-specific validation errors
        setErrors({
          ...error.errors,
          general: "Please correct the errors below."
        });
      } else {
        // General error message
        setErrors({
          general: error.message || "Invalid email or password. Please try again.",
        });
      }
    } finally {
      setIsLoading(false)
    }
  }

  const socialProviders = [
    { name: "Google", icon: Chrome, color: "hover:bg-red-50" },
    { name: "GitHub", icon: Github, color: "hover:bg-gray-50" },
    { name: "LinkedIn", icon: Linkedin, color: "hover:bg-blue-50" },
    { name: "Apple", icon: Apple, color: "hover:bg-gray-50" },
  ]

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`)
    // Implement social login logic here
  }

  if (authLoading) {
    return (
      <div className="min-h-screen auth-gradient flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen auth-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Back to Tech Zolo homepage"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tech Zolo
        </Link>

        <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>Sign in to your Tech Zolo account to continue</CardDescription>

            <div className="flex justify-center pt-2">
              <Badge variant="secondary" className="text-xs">
                <Shield className="w-3 h-3 mr-1" />
                Secured with 256-bit encryption
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {errors.general && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-2">
              {socialProviders.map((provider) => (
                <Button
                  key={provider.name}
                  variant="outline"
                  onClick={() => handleSocialLogin(provider.name)}
                  className={`w-full transition-colors ${provider.color}`}
                  disabled={isLoading}
                  aria-label={`Sign in with ${provider.name}`}
                >
                  <provider.icon className="w-4 h-4 mr-2" />
                  {provider.name}
                </Button>
              ))}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={isLoading}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="text-sm text-destructive" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={isLoading}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p id="password-error" className="text-sm text-destructive" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                    disabled={isLoading}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me for 30 days
                  </Label>
                </div>
                <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Separator />
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                Sign up for free
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="text-center space-y-2">
          <div className="text-xs text-muted-foreground">
            <p>🔒 Your information is secure and encrypted</p>
          </div>
          <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
            <span>• SSL Protected</span>
            <span>• GDPR Compliant</span>
            <span>• SOC 2 Certified</span>
          </div>
        </div>
      </div>
    </div>
  )
}
