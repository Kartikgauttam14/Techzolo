import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // In a real application, you might want to invalidate the token on the server side
    // For now, we'll just return a success response since the client handles token removal

    return NextResponse.json({
      message: "Logged out successfully",
    })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ detail: "Internal server error" }, { status: 500 })
  }
}
