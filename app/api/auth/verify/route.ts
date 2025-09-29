
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:5000"
    const res = await fetch(`${apiBaseUrl}/api/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Verification proxy error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }
    const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:5000"
    const res = await fetch(`${apiBaseUrl}/api/auth/verify-email?email=${encodeURIComponent(email)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Resend verification proxy error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function getUserByEmail(email: string) {
  // Mock implementation
  return {
    id: "1",
    email,
    isVerified: false,
  }
}

async function generateVerificationToken(email: string) {
  // Mock implementation
  return "new-mock-token"
}

async function sendVerificationEmail(email: string, token: string) {
  // Mock implementation
  console.log(`Sending verification email to ${email} with token ${token}`)
}
