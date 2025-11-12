// Authentication utilities and API calls
export interface User {
  id: number
  email: string
  full_name: string
  company?: string
  phone?: string
  created_at: string
  is_active: boolean
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  email: string
  password: string
  full_name: string
  company?: string
  phone?: string
}

const ENV_API_URL = process.env.NEXT_PUBLIC_API_URL
const API_BASE_URL = !ENV_API_URL || ENV_API_URL.includes("localhost") ? "/api" : ENV_API_URL

interface NetworkError extends Error {
  isNetworkError?: boolean
  isTimeoutError?: boolean
  statusCode?: number
}

class NetworkUtils {
  static async checkNetworkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: "HEAD",
        signal: AbortSignal.timeout(5000),
      })
      return response.ok
    } catch {
      return false
    }
  }

  static async retryFetch(url: string, options: RequestInit, maxRetries = 3, delay = 1000): Promise<Response> {
    let lastError: NetworkError

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[v0] API call attempt ${attempt}/${maxRetries} to ${url}`)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
        console.log(`[v0] API call successful: ${response.status} ${response.statusText}`)
        return response
      } catch (error: any) {
        console.error(`[v0] API call attempt ${attempt} failed:`, error)

        lastError = error as NetworkError
        lastError.isNetworkError = error.name === "TypeError" && error.message.includes("fetch")
        lastError.isTimeoutError = error.name === "AbortError"

        if (attempt === maxRetries) break

        // Wait before retry with exponential backoff
        const waitTime = delay * Math.pow(2, attempt - 1)
        console.log(`[v0] Retrying in ${waitTime}ms...`)
        await new Promise((resolve) => setTimeout(resolve, waitTime))
      }
    }

    throw lastError
  }

  static createDetailedError(error: any, context: string): NetworkError {
    const detailedError = new Error() as NetworkError

    if (error.name === "TypeError" && error.message.includes("fetch")) {
      detailedError.message = `Network connection failed: Unable to reach the API at ${API_BASE_URL}. Check your connection. If NEXT_PUBLIC_API_URL points to a local server, clear it to use the built-in /api routes.`
      detailedError.isNetworkError = true
    } else if (error.name === "AbortError") {
      detailedError.message = `Request timeout: The server took too long to respond. Please try again.`
      detailedError.isTimeoutError = true
    } else if (error.statusCode) {
      detailedError.message = `Server error (${error.statusCode}): ${error.message || "Unknown server error"}`
      detailedError.statusCode = error.statusCode
    } else {
      detailedError.message = `${context} failed: ${error.message || "Unknown error occurred"}`
    }

    return detailedError
  }
}

class AuthAPI {
  private getAuthHeaders() {
    const token = localStorage.getItem("access_token")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log("[v0] Starting login process")

      const response = await NetworkUtils.retryFetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
        const errorMessage = errorData.message || errorData.detail || "Login failed"
        const networkError = new Error(errorMessage) as NetworkError
        networkError.statusCode = response.status

        if (response.status === 401) {
          networkError.message = "Invalid email or password. Please check your credentials."
        } else if (response.status === 403) {
          networkError.message = "Access denied. You do not have permission to log in."
        } else if (response.status === 429) {
          networkError.message = "Too many login attempts. Please try again later."
        }
        throw networkError
      }

      const data = await response.json()
      localStorage.setItem("access_token", data.access_token)
      localStorage.setItem("user", JSON.stringify(data.user))
      console.log("[v0] Login successful")
      return data
    } catch (error: any) {
      console.error("[v0] Login error:", error)
      throw NetworkUtils.createDetailedError(error, "Login")
    }
  }

  async signup(userData: SignupData): Promise<AuthResponse> {
    try {
      console.log("[v0] Starting signup process")

      const response = await NetworkUtils.retryFetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
        const errorMessage = errorData.message || errorData.detail || "Signup failed"
        const networkError = new Error(errorMessage) as NetworkError
        networkError.statusCode = response.status

        if (response.status === 409) {
          networkError.message = "An account with this email already exists. Please try logging in."
        } else if (response.status === 400) {
          networkError.message = "Invalid signup data. Please check your input."
        }
        throw networkError
      }

      const data = await response.json()
      localStorage.setItem("access_token", data.access_token)
      localStorage.setItem("user", JSON.stringify(data.user))
      console.log("[v0] Signup successful")
      return data
    } catch (error: any) {
      console.error("[v0] Signup error:", error)
      throw NetworkUtils.createDetailedError(error, "Signup")
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      console.log("[v0] Fetching current user profile")

      const response = await NetworkUtils.retryFetch(`${API_BASE_URL}/auth/me`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Clear invalid token and user data
          localStorage.removeItem("access_token")
          localStorage.removeItem("user")
          throw new Error("Session expired. Please log in again.")
        } else if (response.status === 403) {
          throw new Error("Access denied. You do not have permission to view this profile.")
        }
        throw new Error(`Failed to get user profile (${response.status})`)
      }

      const user = await response.json()
      console.log("[v0] User profile fetched successfully")
      return user
    } catch (error: any) {
      console.error("[v0] Get current user error:", error)
      throw NetworkUtils.createDetailedError(error, "Get user profile")
    }
  }

  async updateProfile(profileData: Partial<User>): Promise<User> {
    try {
      console.log("[v0] Updating user profile")

      const response = await NetworkUtils.retryFetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: "Profile update failed" }))
        throw new Error(error.detail || "Failed to update profile")
      }

      const updatedUser = await response.json()
      localStorage.setItem("user", JSON.stringify(updatedUser))
      console.log("[v0] Profile updated successfully")
      return updatedUser
    } catch (error: any) {
      console.error("[v0] Update profile error:", error)
      throw NetworkUtils.createDetailedError(error, "Update profile")
    }
  }

  async logout(): Promise<void> {
    try {
      console.log("[v0] Starting logout process")

      await NetworkUtils.retryFetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      })

      console.log("[v0] Logout API call successful")
    } catch (error: any) {
      console.error("[v0] Logout API call failed:", error)
      // Don't throw error for logout - always clear local storage
    } finally {
      localStorage.removeItem("access_token")
      localStorage.removeItem("user")
      console.log("[v0] Local storage cleared")
    }
  }

  async submitContactForm(contactData: {
    name: string
    email: string
    subject: string
    message: string
    phone?: string
  }): Promise<void> {
    try {
      console.log("[v0] Submitting contact form")

      const response = await NetworkUtils.retryFetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: "Contact form submission failed" }))
        throw new Error(error.detail || "Failed to submit contact form")
      }

      console.log("[v0] Contact form submitted successfully")
    } catch (error: any) {
      console.error("[v0] Contact form submission error:", error)
      throw NetworkUtils.createDetailedError(error, "Contact form submission")
    }
  }

  async checkConnection(): Promise<boolean> {
    return NetworkUtils.checkNetworkConnection()
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("access_token")
  }

  getCurrentUserFromStorage(): User | null {
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  }
}

export const authAPI = new AuthAPI()
