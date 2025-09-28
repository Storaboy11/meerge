import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import type { ReferralActivity } from "@/lib/referral-types"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    // Mock referral activity - in real implementation, fetch from database
    const mockActivity: ReferralActivity[] = [
      {
        id: "1",
        type: "reward_earned",
        description: "Earned NGN 500 from Sarah's first order",
        amount: 500,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        refereeEmail: "sarah@example.com",
      },
      {
        id: "2",
        type: "referral_signup",
        description: "John signed up with your code",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        refereeEmail: "john@example.com",
      },
      {
        id: "3",
        type: "credit_used",
        description: "Used NGN 300 credits for subscription",
        amount: -300,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "4",
        type: "referral_completed",
        description: "Mary completed her first order",
        amount: 500,
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        refereeEmail: "mary@example.com",
      },
      {
        id: "5",
        type: "referral_sent",
        description: "Sent referral to 3 friends via WhatsApp",
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    return NextResponse.json({
      success: true,
      data: mockActivity,
    })
  } catch (error) {
    console.error("Get referral activity error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch referral activity" }, { status: 500 })
  }
}
