import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const verifySchema = z.object({
  email: z.string().email("Invalid email address"),
  token: z.string().min(1, "Verification token is required"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validatedData = verifySchema.parse(body)

    // Verify the token
    const isValid = await verifyToken(validatedData.email, validatedData.token)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 })
    }

    // Mark user as verified
    await markUserAsVerified(validatedData.email)

    return NextResponse.json({
      message: "Email verified successfully",
      success: true,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }

    console.error("Verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email")

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  try {
    // Resend verification email
    const user = await getUserByEmail(email)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.isVerified) {
      return NextResponse.json({ error: "Email is already verified" }, { status: 400 })
    }

    // Generate new token and send email
    const newToken = await generateVerificationToken(email)
    await sendVerificationEmail(email, newToken)

    return NextResponse.json({
      message: "Verification email sent successfully",
    })
  } catch (error) {
    console.error("Resend verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Mock functions - replace with your actual database operations
async function verifyToken(email: string, token: string) {
  // Mock implementation
  return token === "mock-token"
}

async function markUserAsVerified(email: string) {
  // Mock implementation
  console.log(`Marking user ${email} as verified`)
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
