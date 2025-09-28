import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    const userId = session.user.id

    // Generate unique referral code
    const generateCode = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      let code = ""
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return code
    }

    const referralCode = generateCode()

    // In a real implementation, check if code already exists and regenerate if needed
    // For now, we'll use mock data

    const newReferralCode = {
      userId,
      code: referralCode,
      createdAt: new Date().toISOString(),
      totalUses: 0,
      successfulReferrals: 0,
      pendingReferrals: 0,
      totalEarned: 0,
      isActive: true,
    }

    return NextResponse.json({
      success: true,
      data: newReferralCode,
    })
  } catch (error) {
    console.error("Generate referral code error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate referral code" }, { status: 500 })
  }
}
