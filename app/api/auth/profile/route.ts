import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { userStore } from "@/lib/server/user-store"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ detail: "Authorization header required" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: number; email: string }

    const user = userStore.getByEmail(decoded.email)
    if (!user) {
      return NextResponse.json({ detail: "User not found" }, { status: 404 })
    }

    const updateData = await request.json()
    const { full_name, company, phone } = updateData

    const updatedUser = userStore.update(decoded.email, {
      full_name: full_name ?? user.full_name,
      company: company !== undefined ? company : user.company,
      phone: phone !== undefined ? phone : user.phone,
    })

    if (!updatedUser) {
      return NextResponse.json({ detail: "User not found" }, { status: 404 })
    }

    const { password: _, ...userWithoutPassword } = updatedUser
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ detail: "Invalid or expired token" }, { status: 401 })
  }
}
