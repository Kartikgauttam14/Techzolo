import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth"
import { NetworkStatus } from "@/components/NetworkStatus"
import { Suspense } from "react"
import { FullScreenBackground } from "@/components/ui/full-screen-background"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Tech Zolo - Modern Web Solutions",
  description: "Professional web development and design services",
  generator: "Techzolo",
  icons: {
    icon: "/tech-zolo-logo.svg",
    shortcut: "/tech-zolo-logo.svg",
    apple: "/tech-zolo-logo.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/tech-zolo-logo.svg" />
        <link rel="shortcut icon" type="image/svg+xml" href="/tech-zolo-logo.svg" />
        <link rel="apple-touch-icon" type="image/svg+xml" href="/tech-zolo-logo.svg" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-black/40 via-black/20 to-black/40 backdrop-blur-lg border-b border-white/10">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
              {/* Logo - Static positioned in top left */}
              <div className="flex items-center flex-shrink-0">
                <Link href="/" className="flex items-center space-x-3">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <Image
                      src="/tech-zolo-logo.svg"
                      alt="Tech Zolo Logo"
                      width={40}
                      height={40}
                      className="object-contain"
                      priority
                    />
                  </div>
                  <span className="text-white font-bold text-xl tracking-tight whitespace-nowrap">Tech Zolo</span>
                </Link>
              </div>
              
              {/* Navigation Links - Centered with proper spacing */}
              <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
                <Link href="/dashboard" className="text-white/90 hover:text-white transition-all duration-200 font-medium whitespace-nowrap hover:scale-105">Dashboard</Link>
                <Link href="/domain-search" className="text-white/90 hover:text-white transition-all duration-200 font-medium whitespace-nowrap hover:scale-105">Domain Search</Link>
                <Link href="/profile" className="text-white/90 hover:text-white transition-all duration-200 font-medium whitespace-nowrap hover:scale-105">Profile</Link>
              </nav>
              
              {/* Right side buttons - Login, Sign Up, Mobile Menu */}
              <div className="flex items-center space-x-3 flex-shrink-0">
                <Link
                  href="/auth/login"
                  className="text-white/80 hover:text-white transition-all duration-200 hidden md:block whitespace-nowrap hover:scale-105"
                >
                  Login
                </Link>
                <Link href="/auth/signup" className="hidden md:block">
                  <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm whitespace-nowrap transition-all duration-200 hover:scale-105">
                    Sign Up
                  </Button>
                </Link>
                {/* Mobile menu button */}
                <button className="md:hidden p-2 rounded-md hover:bg-white/10 transition-all duration-200 hover:scale-105">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>
        {/* Full-screen background that appears across all pages */}
        <FullScreenBackground 
          type="aurora"
          overlay={true}
          overlayOpacity={0.1}
        />
        
        {/* Main content area with proper spacing for fixed header */}
        <main className="min-h-screen pt-16">
          {/* Wrapped children with AuthProvider and Suspense for global auth state */}
          <Suspense fallback={<div>Loading...</div>}>
            <AuthProvider>
              <NetworkStatus />
              {children}
            </AuthProvider>
          </Suspense>
        </main>
        <Analytics />
      </body>
    </html>
  )
}
