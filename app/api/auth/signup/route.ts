import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import db from "@/lib/server/db"

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key"

export async function POST(request: NextRequest) {

  try {
    const { email, password, full_name, company, phone } = await request.json()

    // Validate input
    const errors: Record<string, string> = {}
    
    if (!email) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address"
    }
    
    if (!password) {
      errors.password = "Password is required"
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long"
    }
    
    if (!full_name) {
      errors.full_name = "Full name is required"
    }
    
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ 
        detail: "Validation failed", 
        errors 
      }, { status: 400 })
    }
    //check this
    // Check if user already exists
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email])
    

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ 
        detail: "User with this email already exists",
        message: "An account with this email already exists. Please use a different email or try logging in."
      }, { status: 400 })
    }
    
    // Hash password
    const password_hash = await bcrypt.hash(password, 10)
    // Create new user in database
    const newUserResult = await db.query(
      'INSERT INTO users (email, password_hash, full_name, company, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, full_name, company, phone, created_at, is_active',
      [email, password_hash, full_name, company, phone]
    )
    const newUser = newUserResult.rows[0]
    console.log('hello here after creation')

    // Create JWT token
    const access_token = jwt.sign(
      { sub: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Return user data without password hash
    const { password_hash: _, ...userWithoutPassword } = newUser
    
    return NextResponse.json({
      access_token,
      token_type: "bearer",
      user: userWithoutPassword
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ 
      detail: "Internal server error",
      message: "An unexpected error occurred. Please try again later."
    }, { status: 500 })
  }
}
