"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ArrowLeft,
  Chrome,
  Github,
  Linkedin,
  Apple,
  Check,
  X,
  Shield,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Phone,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emailExists, setEmailExists] = useState(false)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    agreeToMarketing: false,
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [successMessage, setSuccessMessage] = useState("")
  const { signup } = useAuth()

  useEffect(() => {
    if (formData.email && /\S+@\S+\.\S+/.test(formData.email)) {
      setIsCheckingEmail(true)
      const timer = setTimeout(async () => {
        // Simulate email check
        const exists = formData.email === "existing@example.com"
        setEmailExists(exists)
        setIsCheckingEmail(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [formData.email])

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    if (/[^A-Za-z0-9]/.test(password)) strength += 25
    return strength
  }

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 25) return "Very Weak"
    if (strength < 50) return "Weak"
    if (strength < 75) return "Good"
    return "Strong"
  }

  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 25) return "bg-destructive"
    if (strength < 50) return "bg-orange-500"
    if (strength < 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const passwordStrength = getPasswordStrength(formData.password)

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    } else if (emailExists) {
      newErrors.email = "This email is already registered"
    }

    if (formData.phone && !/^\+?[\d\s\-$$$$]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (passwordStrength < 75) {
      newErrors.password = "Password must be stronger (at least Good)"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions"
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
      await signup({
        email: formData.email,
        password: formData.password,
        full_name: formData.name,
        phone: formData.phone || undefined,
      })

      setSuccessMessage("Account created! You are now signed in.")
      // optional: navigate after a short delay
      setTimeout(() => router.push("/"), 1200)
    } catch (error: any) {
      console.error("Signup error:", error);
      
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
          general: error.message || "Something went wrong. Please try again." 
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

  const handleSocialSignup = (provider: string) => {
    console.log(`Sign up with ${provider}`)
    // Implement social signup logic here
  }

  const passwordRequirements = [
    { text: "At least 8 characters", met: formData.password.length >= 8 },
    { text: "One uppercase letter", met: /[A-Z]/.test(formData.password) },
    { text: "One number", met: /[0-9]/.test(formData.password) },
    { text: "One special character", met: /[^A-Za-z0-9]/.test(formData.password) },
  ]

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
            <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
            <CardDescription>Join Tech Zolo and start building amazing digital solutions</CardDescription>

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
                  onClick={() => handleSocialSignup(provider.name)}
                  className={`w-full transition-colors ${provider.color}`}
                  disabled={isLoading}
                  aria-label={`Sign up with ${provider.name}`}
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

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className={`pl-10 ${errors.name ? "border-destructive" : ""}`}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={isLoading}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    autoComplete="name"
                  />
                </div>
                {errors.name && (
                  <p id="name-error" className="text-sm text-destructive" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className={`pl-10 pr-10 ${errors.email ? "border-destructive" : emailExists ? "border-destructive" : ""}`}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={isLoading}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    autoComplete="email"
                  />
                  <div className="absolute right-3 top-3">
                    {isCheckingEmail ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : formData.email && /\S+@\S+\.\S+/.test(formData.email) ? (
                      emailExists ? (
                        <X className="h-4 w-4 text-destructive" />
                      ) : (
                        <Check className="h-4 w-4 text-green-600" />
                      )
                    ) : null}
                  </div>
                </div>
                {errors.email && (
                  <p id="email-error" className="text-sm text-destructive" role="alert">
                    {errors.email}
                  </p>
                )}
                {emailExists && (
                  <p className="text-sm text-destructive">
                    This email is already registered.{" "}
                    <Link href="/auth/login" className="underline">
                      Sign in instead?
                    </Link>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    className={`pl-10 ${errors.phone ? "border-destructive" : ""}`}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={isLoading}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    autoComplete="tel"
                  />
                </div>
                {errors.phone && (
                  <p id="phone-error" className="text-sm text-destructive" role="alert">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={isLoading}
                    aria-describedby={errors.password ? "password-error" : "password-requirements"}
                    autoComplete="new-password"
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

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Password strength:</span>
                      <span
                        className={`text-xs font-medium ${
                          passwordStrength < 50
                            ? "text-destructive"
                            : passwordStrength < 75
                              ? "text-yellow-600"
                              : "text-green-600"
                        }`}
                      >
                        {getPasswordStrengthText(passwordStrength)}
                      </span>
                    </div>
                    <Progress
                      value={passwordStrength}
                      className={`h-2 ${getPasswordStrengthColor(passwordStrength)}`}
                    />
                  </div>
                )}

                {/* Password Requirements */}
                {formData.password && (
                  <div id="password-requirements" className="space-y-1" aria-label="Password requirements">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {req.met ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <X className="h-3 w-3 text-muted-foreground" />
                        )}
                        <span className={`text-xs ${req.met ? "text-green-600" : "text-muted-foreground"}`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {errors.password && (
                  <p id="password-error" className="text-sm text-destructive" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className={`pl-10 pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    disabled={isLoading}
                    aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p id="confirm-password-error" className="text-sm text-destructive" role="alert">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <input
                    id="terms"
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                    disabled={isLoading}
                    aria-describedby={errors.agreeToTerms ? "terms-error" : undefined}
                  />
                  <Label htmlFor="terms" className="text-sm leading-5">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {errors.agreeToTerms && (
                  <p id="terms-error" className="text-sm text-destructive" role="alert">
                    {errors.agreeToTerms}
                  </p>
                )}

                <div className="flex items-start space-x-2">
                  <input
                    id="marketing"
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    checked={formData.agreeToMarketing}
                    onChange={(e) => setFormData({ ...formData, agreeToMarketing: e.target.checked })}
                    disabled={isLoading}
                  />
                  <Label htmlFor="marketing" className="text-sm leading-5 text-muted-foreground">
                    I'd like to receive updates about new features and promotions (optional)
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Separator />
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Sign in here
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
