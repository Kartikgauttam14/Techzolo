"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { authAPI } from "@/lib/auth"
import { emailJSService } from "@/lib/emailjs"
import { AlertCircle, CheckCircle, Wifi } from "lucide-react"

export const ContactUs = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState("")
  const [errorDetails, setErrorDetails] = useState("")
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    phone: "",
    company: "",
    project_type: "",
    budget: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('EmailJS configured status:', emailJSService.getStatus().configured);

    setIsSubmitting(true)
    setSubmitStatus("")
    setErrorDetails("")

    try {
      console.log("[v0] Contact form submission started")

      // Always use the API method since EmailJS is not properly configured
      await authAPI.submitContactForm({
        name: formData.user_name,
        email: formData.user_email,
        subject: `${formData.project_type} Project Inquiry`,
        message: `Project Type: ${formData.project_type}\nBudget: ${formData.budget}\nCompany: ${formData.company}\n\nMessage:\n${formData.message}`,
        phone: formData.phone || undefined,
      })
      console.log("[v0] Contact form submitted successfully via API")

      setSubmitStatus("success")
      setFormData({
        user_name: "",
        user_email: "",
        phone: "",
        company: "",
        project_type: "",
        budget: "",
        message: "",
      })
      console.log("[v0] Contact form submitted successfully")
    } catch (error: any) {
      console.error("[v0] Contact form submission error:", error)
      setSubmitStatus("error")

      if (error.isNetworkError) {
        setErrorDetails(
          "Network connection failed. Please check your internet connection. If this persists, ensure the API routes (/api) are reachable and clear NEXT_PUBLIC_API_URL if it points to localhost.",
        )
      } else if (error.isTimeoutError) {
        setErrorDetails("Request timed out. The server is taking too long to respond. Please try again.")
      } else if (error.statusCode) {
        setErrorDetails(`Server error (${error.statusCode}): ${error.message}`)
      } else {
        setErrorDetails(error.message || "An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <Input
              type="text"
              name="user_name"
              id="user_name"
              required
              className="w-full"
              placeholder="Enter your full name"
              value={formData.user_name}
              onChange={(e) => handleInputChange("user_name", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <Input
              type="email"
              name="user_email"
              id="user_email"
              required
              className="w-full"
              placeholder="Enter your email"
              value={formData.user_email}
              onChange={(e) => handleInputChange("user_email", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <Input
              type="tel"
              name="phone"
              id="phone"
              className="w-full"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <Input
              type="text"
              name="company"
              id="company"
              className="w-full"
              placeholder="Your company name"
              value={formData.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="project_type" className="block text-sm font-medium text-gray-700 mb-2">
              Project Type *
            </label>
            <Select
              value={formData.project_type}
              onValueChange={(value) => handleInputChange("project_type", value)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="website">Website Development</SelectItem>
                <SelectItem value="android">Android App</SelectItem>
                <SelectItem value="ios">iOS App</SelectItem>
                <SelectItem value="both">Mobile App (Both Platforms)</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
              Budget Range
            </label>
            <Select value={formData.budget} onValueChange={(value) => handleInputChange("budget", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-50k">Under ₹50,000</SelectItem>
                <SelectItem value="50k-1l">₹50,000 - ₹1,00,000</SelectItem>
                <SelectItem value="1l-3l">₹1,00,000 - ₹3,00,000</SelectItem>
                <SelectItem value="3l-5l">₹3,00,000 - ₹5,00,000</SelectItem>
                <SelectItem value="above-5l">Above ₹5,00,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Project Details *
          </label>
          <Textarea
            name="message"
            id="message"
            required
            rows={6}
            className="w-full"
            placeholder="Tell us about your project requirements, timeline, and any specific features you need..."
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
          />
        </div>

        {submitStatus === "success" && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="text-sm font-medium text-green-800">Message Sent Successfully!</h3>
                <p className="text-sm text-green-700 mt-1">
                  Thank you for your inquiry. We'll get back to you within 24 hours.
                </p>
              </div>
            </div>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Failed to Send Message</h3>
                <p className="text-sm text-red-700 mt-1">
                  {errorDetails ||
                    "Sorry, there was an error sending your message. Please try again or contact us directly."}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 text-red-700 border-red-300 hover:bg-red-100 bg-transparent"
                  onClick={() => {
                    setSubmitStatus("")
                    setErrorDetails("")
                  }}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-8 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 animate-pulse" />
              Sending Request...
            </div>
          ) : (
            "Submit Request →"
          )}
        </Button>
      </form>
    </div>
  )
}
