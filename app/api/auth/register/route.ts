import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validatedData = registerSchema.parse(body)

    // Check if user already exists
    // In a real app, you'd check your database here
    const existingUser = await checkUserExists(validatedData.email)

    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 })
    }

    // Hash password and create user
    // In a real app, you'd hash the password and save to database
    const user = await createUser(validatedData)

    // Send verification email
    await sendVerificationEmail(user.email, user.verificationToken)

    return NextResponse.json({
      message: "User created successfully. Please check your email for verification.",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }

    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Mock functions - replace with your actual database operations
async function checkUserExists(email: string) {
  // Mock implementation
  return false
}

async function createUser(data: any) {
  // Mock implementation
  return {
    id: "1",
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    verificationToken: "mock-token",
  }
}

async function sendVerificationEmail(email: string, token: string) {
  // Mock implementation
  console.log(`Sending verification email to ${email} with token ${token}`)
}
