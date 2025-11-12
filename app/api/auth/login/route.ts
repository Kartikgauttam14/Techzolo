import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import db from "@/lib/server/db"

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    const errors: Record<string, string> = {}
    
    if (!email) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address"
    }
    
    if (!password) {
      errors.password = "Password is required"
    }
    
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ 
        detail: "Validation failed", 
        errors 
      }, { status: 400 })
    }

    // Find user in database
    const userResult = await db.query('SELECT id, email, password_hash, full_name, company, phone FROM users WHERE email = $1', [email])
    const user = userResult.rows[0]
    
    // Check if user exists and password matches
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return NextResponse.json({ 
        detail: "Incorrect email or password",
        message: "The email or password you entered is incorrect. Please try again."
      }, { status: 401 })
    }

    // Create JWT token
    const access_token = jwt.sign(
      { sub: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Return user data without password hash
    const { password_hash, ...userWithoutPassword } = user
    
    return NextResponse.json({
      access_token,
      token_type: "bearer",
      user: userWithoutPassword
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({
      detail: "Internal server error",
      message: error instanceof Error ? error.message : "An unexpected error occurred. Please try again later."
    }, { status: 500 })
  }
}
