"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Smartphone,
  Globe,
  Tablet,
  Zap,
  Users,
  ExternalLink,
  Star,
  Mail,
  Phone,
  MapPin,
  Clock,
  Quote,
  Calendar,
  BookOpen,
  TrendingUp,
  Menu,
  X,
  User,
  LogOut,
  Settings,
} from "lucide-react"

import { ContactUs } from "@/components/ContactUs"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import HeroSection from "@/components/ui/3d-hero-section-boxes"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout, isLoading } = useAuth()
  const router = useRouter()

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleStartCreating = () => {
    scrollToSection("contact")
  }

  const handleProfileClick = () => {
    router.push("/profile")
  }

  const handleLogout = async () => {
    await logout()
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const UserProfileDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative h-8 w-8 rounded-full border-gray-300">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-500 text-white text-xs font-semibold">
              {getInitials(user?.full_name || "")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user?.full_name}</p>
            <p className="w-[200px] truncate text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfileClick}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/dashboard")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <div className="min-h-screen">
      {/* 3D Hero Section - Full Screen */}
      <section id="home" className="relative h-screen">
        <HeroSection scrollToSection={scrollToSection} />
      </section>

      <section id="services" className="py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We create digital experiences that transform businesses and delight users across web, mobile, and beyond.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {/* Website Development */}
            <div className="group">
              <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white hover:-translate-y-2 overflow-hidden">
                <CardHeader className="text-center pb-8 pt-12">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                    <Globe className="h-10 w-10 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-4">Website Development</CardTitle>
                  <CardDescription className="text-lg text-gray-600 leading-relaxed">
                    Custom websites that convert visitors into customers with stunning design and powerful
                    functionality.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-12">
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-gray-900 mb-2">₹7,100</p>
                      <p className="text-sm text-gray-500 mb-6">Starting price • 2-6 weeks</p>
                    </div>
                    <Button variant="link"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-medium transition-all duration-300 hover:scale-105"
                      onClick={() => router.push('/domain-search')}
                    >
                      Start Website Project
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Android Development */}
            <div className="group">
              <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white hover:-translate-y-2 overflow-hidden">
                <CardHeader className="text-center pb-8 pt-12">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                    <Smartphone className="h-10 w-10 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-4">Android Development</CardTitle>
                  <CardDescription className="text-lg text-gray-600 leading-relaxed">
                    Native Android apps that engage users and boost your business productivity and growth.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-12">
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-gray-900 mb-2">₹57,000</p>
                      <p className="text-sm text-gray-500 mb-6">Starting price • 3-8 weeks</p>
                    </div>
                    <Button variant="link"
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-full font-medium transition-all duration-300 hover:scale-105"
                      onClick={() => scrollToSection("contact")}
                    >
                      Request Android App
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* iOS Development */}
            <div className="group">
              <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white hover:-translate-y-2 overflow-hidden">
                <CardHeader className="text-center pb-8 pt-12">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                    <Tablet className="h-10 w-10 text-purple-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-4">iOS Development</CardTitle>
                  <CardDescription className="text-lg text-gray-600 leading-relaxed">
                    Beautiful iPhone and iPad apps that deliver exceptional user experiences and drive engagement.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-12">
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-gray-900 mb-2">₹65,000</p>
                      <p className="text-sm text-gray-500 mb-6">Starting price • 4-10 weeks</p>
                    </div>
                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-full font-medium transition-all duration-300 hover:scale-105"
                      onClick={() => scrollToSection("contact")}
                    >
                      Request iOS App
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-32 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">Our Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We follow a streamlined process to ensure your project is delivered on time and exceeds expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-5xl mx-auto">
            {/* Consultation */}
            <div className="text-center">
              <div className="bg-blue-50 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Consultation</h4>
              <p className="text-gray-600">We discuss your requirements and goals.</p>
            </div>

            {/* Planning */}
            <div className="text-center">
              <div className="bg-green-50 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-green-600">2</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Planning</h4>
              <p className="text-gray-600">We create a detailed project roadmap.</p>
            </div>

            {/* Development */}
            <div className="text-center">
              <div className="bg-purple-50 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-purple-600">3</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Development</h4>
              <p className="text-gray-600">We build your solution with regular updates.</p>
            </div>

            {/* Launch */}
            <div className="text-center">
              <div className="bg-yellow-50 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-yellow-600">4</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Launch</h4>
              <p className="text-gray-600">We deploy and provide ongoing support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Showcase Section */}
      <section id="portfolio" className="py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">Our Portfolio</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover how we've helped businesses transform their digital presence with innovative solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {/* E-commerce Website Project */}
            <div className="group">
              <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white hover:-translate-y-2 overflow-hidden">
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                    <Globe className="h-12 w-12 text-blue-600/80" />
                  </div>
                  <Badge className="absolute top-4 left-4 bg-blue-600 text-white font-medium rounded-full px-3 py-1 text-sm">
                    Website
                  </Badge>
                </div>
                <CardHeader className="pb-6 pt-8 px-8">
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    E-commerce Store for RetailMax
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600 leading-relaxed">
                    Modern e-commerce platform with integrated payment processing and inventory management.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-600 font-medium rounded-full px-2 py-0.5 text-xs"
                      >
                        React
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-600 font-medium rounded-full px-2 py-0.5 text-xs"
                      >
                        Shopify
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-600 font-medium rounded-full px-2 py-0.5 text-xs"
                      >
                        Stripe
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>40% increase in online sales</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Zap className="h-4 w-4 text-blue-600" />
                        <span>3x faster page load times</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Healthcare Android App */}
            <div className="group">
              <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white hover:-translate-y-2 overflow-hidden">
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                    <Smartphone className="h-12 w-12 text-green-600/80" />
                  </div>
                  <Badge className="absolute top-4 left-4 bg-green-600 text-white font-medium rounded-full px-3 py-1 text-sm">
                    Android
                  </Badge>
                </div>
                <CardHeader className="pb-6 pt-8 px-8">
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                    HealthTrack Mobile App
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600 leading-relaxed">
                    Comprehensive healthcare app for patient monitoring and appointment scheduling.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-600 font-medium rounded-full px-2 py-0.5 text-xs"
                      >
                        Kotlin
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-600 font-medium rounded-full px-2 py-0.5 text-xs"
                      >
                        Firebase
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-600 font-medium rounded-full px-2 py-0.5 text-xs"
                      >
                        Material UI
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>50K+ active users</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="h-4 w-4 text-green-600" />
                        <span>95% user satisfaction rate</span>
                      </div>
                    </div>
                    
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* iOS Travel Booking App */}
            <div className="group">
              <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white hover:-translate-y-2 overflow-hidden">
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
                    <Tablet className="h-12 w-12 text-purple-600/80" />
                  </div>
                  <Badge className="absolute top-4 left-4 bg-purple-600 text-white font-medium rounded-full px-3 py-1 text-sm">
                    iOS
                  </Badge>
                </div>
                <CardHeader className="pb-6 pt-8 px-8">
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                    TravelEase Booking App
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600 leading-relaxed">
                    Intuitive travel booking platform with real-time availability and seamless payments.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-600 font-medium rounded-full px-2 py-0.5 text-xs"
                      >
                        Swift
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-600 font-medium rounded-full px-2 py-0.5 text-xs"
                      >
                        SwiftUI
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-600 font-medium rounded-full px-2 py-0.5 text-xs"
                      >
                        Core Data
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>4.8 App Store rating</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Zap className="h-4 w-4 text-purple-600" />
                        <span>60% faster booking process</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Portfolio CTA */}
          <div className="text-center mt-16">
            <p className="text-xl text-gray-600 mb-6">Want to see more of our work? Explore our complete portfolio.</p>
            <Button
              size="lg"
              variant="outline"
              className="text-lg font-medium px-8 py-4 border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 bg-transparent"
              onClick={() => window.open("https://serverstep.in/", "_blank")}
            >
              View Full Portfolio
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-32 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">What Our Clients Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Don't just take our word for it. Here's what our satisfied clients have to say about working with Tech
              Zolo.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {/* Testimonial 1 */}
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-8">
                <div className="flex items-start gap-6 mb-6">
                  <Quote className="h-10 w-10 text-blue-600/80 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-gray-900 mb-4 leading-relaxed">
                      "Tech Zolo transformed our business website in just 3 weeks! The new design increased our
                      conversion rate by 45% and we're getting more leads than ever before."
                    </p>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">SM</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Sarah Mitchell</h4>
                    <p className="text-sm text-gray-500">CEO, RetailMax</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-8">
                <div className="flex items-start gap-6 mb-6">
                  <Quote className="h-10 w-10 text-green-600/80 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-gray-900 mb-4 leading-relaxed">
                      "Our Android app boosted sales by 40% within the first month! The team's attention to detail and
                      user experience design is exceptional. Highly recommended!"
                    </p>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-lg">MJ</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Michael Johnson</h4>
                    <p className="text-sm text-gray-500">Founder, QuickBite</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-8">
                <div className="flex items-start gap-6 mb-6">
                  <Quote className="h-10 w-10 text-purple-600/80 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-gray-900 mb-4 leading-relaxed">
                      "Working with Tech Zolo was a game-changer. They delivered our iOS app ahead of schedule and it's
                      been featured on the App Store. Professional and reliable!"
                    </p>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-lg">EC</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Emily Chen</h4>
                    <p className="text-sm text-gray-500">Product Manager, TravelEase</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Testimonials Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <p className="text-sm text-gray-500">Happy Clients</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">4.9</div>
              <p className="text-sm text-gray-500">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">98%</div>
              <p className="text-sm text-gray-500">Project Success Rate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-600 mb-2">24/7</div>
              <p className="text-sm text-gray-500">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog/Resources Section */}
      <section id="blog" className="py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Latest Insights & Resources
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Stay ahead of the curve with our expert insights on technology trends, business growth strategies, and
              development best practices.
            </p>
          </div>

          {/* Featured Articles */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16 max-w-7xl mx-auto">
            {/* Article 1 */}
            <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white hover:-translate-y-2 overflow-hidden">
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <Smartphone className="h-12 w-12 text-blue-600/80" />
                </div>
                <Badge className="absolute top-4 left-4 bg-blue-600 text-white font-medium rounded-full px-3 py-1 text-sm">
                  Business Growth
                </Badge>
              </div>
              <CardHeader className="pb-6 pt-8 px-8">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>December 15, 2024</span>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  Why Every Small Business Needs an App in 2025
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 leading-relaxed">
                  Discover how mobile apps are becoming essential for small businesses to compete in today's digital
                  marketplace and drive customer engagement.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-xs">TZ</span>
                    </div>
                    <span className="text-sm text-gray-500">Tech Zolo Team</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Article 2 */}
            <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white hover:-translate-y-2 overflow-hidden">
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                  <TrendingUp className="h-12 w-12 text-green-600/80" />
                </div>
                <Badge className="absolute top-4 left-4 bg-green-600 text-white font-medium rounded-full px-3 py-1 text-sm">
                  Tech Trends
                </Badge>
              </div>
              <CardHeader className="pb-6 pt-8 px-8">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>December 12, 2024</span>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                  5 Signs It's Time to Redesign Your Website
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 leading-relaxed">
                  Learn the key indicators that signal when your website needs a refresh to maintain competitiveness and
                  user engagement.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-xs">SM</span>
                    </div>
                    <span className="text-sm text-gray-500">Sarah Martinez</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Article 3 */}
            <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white hover:-translate-y-2 overflow-hidden">
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
                  <Globe className="h-12 w-12 text-purple-600/80" />
                </div>
                <Badge className="absolute top-4 left-4 bg-purple-600 text-white font-medium rounded-full px-3 py-1 text-sm">
                  Case Study
                </Badge>
              </div>
              <CardHeader className="pb-6 pt-8 px-8">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>December 10, 2024</span>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                  How We Increased E-commerce Sales by 300%
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 leading-relaxed">
                  A detailed case study of how strategic UX improvements and performance optimization transformed an
                  online retailer's business.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold text-xs">MK</span>
                    </div>
                    <span className="text-sm text-gray-500">Mayank Mittal</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Blog Categories */}
          <div className="bg-gray-50 rounded-3xl p-12">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold text-gray-900 mb-6">Explore by Category</h3>
              <p className="text-xl text-gray-600">Find the content that matters most to your business growth</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white hover:-translate-y-2 cursor-pointer">
                <CardContent className="p-8 text-center">
                  <div className="bg-blue-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-10 w-10 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Tech Trends</h4>
                  <p className="text-sm text-gray-500">Latest technology insights and industry developments</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white hover:-translate-y-2 cursor-pointer">
                <CardContent className="p-8 text-center">
                  <div className="bg-green-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-green-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Business Growth</h4>
                  <p className="text-sm text-gray-500">Strategies to scale and grow your business digitally</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white hover:-translate-y-2 cursor-pointer">
                <CardContent className="p-8 text-center">
                  <div className="bg-purple-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="h-10 w-10 text-purple-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">App Tips</h4>
                  <p className="text-sm text-gray-500">Mobile app development best practices and tips</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white hover:-translate-y-2 cursor-pointer">
                <CardContent className="p-8 text-center">
                  <div className="bg-yellow-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-10 w-10 text-yellow-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Case Studies</h4>
                  <p className="text-sm text-gray-500">Real client success stories and project breakdowns</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-32 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">Get Your Free Quote</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Ready to transform your business? Tell us about your project and we'll provide a detailed quote within 24
              hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="px-8 pt-8 pb-4">
                  <CardTitle className="text-3xl font-bold text-gray-900">Project Details</CardTitle>
                  <CardDescription className="text-lg text-gray-600">
                    Fill out the form below and we'll get back to you with a customized solution for your needs.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <ContactUs />
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Details Card */}
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="px-8 pt-8 pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900">Get In Touch</CardTitle>
                  <CardDescription className="text-lg text-gray-600">
                    Prefer to talk directly? Reach out to us through any of these channels.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-start gap-6">
                    <div className="bg-blue-50 p-4 rounded-2xl">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Email Us</h4>
                      <p className="text-sm text-gray-500">hello@techzolo.in</p>
                      <p className="text-sm text-gray-500">support@techzolo.in</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="bg-green-50 p-4 rounded-2xl">
                      <Phone className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Call Us</h4>
                      <p className="text-sm text-gray-500">+91 9034670060 </p>
                      <p className="text-sm text-gray-500">+91 7027941300 </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="bg-purple-50 p-4 rounded-2xl">
                      <MapPin className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Visit Us</h4>

                      <p className="text-sm text-gray-500">{"Safidon, Jind, Haryana"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="bg-yellow-50 p-4 rounded-2xl">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Business Hours</h4>
                      <p className="text-sm text-gray-500">Mon - Fri: 9:00 AM - 6:00 PM</p>
                      <p className="text-sm text-gray-500">Sat: 10:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Response Time Card */}
              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="bg-blue-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Zap className="h-10 w-10 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-3">Quick Response</h3>
                    <p className="text-sm text-gray-500 mb-6">
                      We typically respond to all inquiries within 2-4 hours during business days.
                    </p>
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-600 font-medium rounded-full px-3 py-1 text-sm"
                    >
                      24-Hour Quote Guarantee
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Card */}
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="px-8 pt-8 pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900">Frequently Asked</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-2">How long does a typical project take?</h4>
                    <p className="text-xs text-gray-500">
                      Websites: 2-6 weeks, Apps: 3-10 weeks depending on complexity.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-2">Do you provide ongoing support?</h4>
                    <p className="text-xs text-gray-500">
                      Yes, we offer maintenance and support packages for all projects.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-2">Can you work with existing designs?</h4>
                    <p className="text-xs text-gray-500">We can work with your designs or create new ones.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Ready to start creating?
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Let's discuss your ideas and create something amazing together. Get started today.
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white text-lg font-medium px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => scrollToSection("contact")}
            >
              Get Free Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
