"use client"

import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Wifi, WifiOff } from "lucide-react"

export function NetworkStatus() {
  const { connectionStatus, retryConnection } = useAuth()

  if (connectionStatus === "connected") {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {connectionStatus === "checking" ? (
              <Wifi className="h-5 w-5 text-yellow-600 animate-pulse" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-600" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800">
              {connectionStatus === "checking" ? "Checking Connection..." : "Connection Failed"}
            </h3>
            <p className="text-sm text-red-700 mt-1">
              {connectionStatus === "checking"
                ? "Verifying backend server connection..."
                : "Unable to reach the backend server. Please ensure it's running on port 8000."}
            </p>
            {connectionStatus === "disconnected" && (
              <Button
                onClick={retryConnection}
                size="sm"
                variant="outline"
                className="mt-2 text-red-700 border-red-300 hover:bg-red-100 bg-transparent"
              >
                Retry Connection
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
