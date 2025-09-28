import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import type { ReferralStats } from "@/lib/referral-types"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    const userId = session.user.id

    // Mock referral stats - in real implementation, fetch from database
    const mockStats: ReferralStats = {
      totalReferrals: 12,
      successfulReferrals: 8,
      pendingReferrals: 4,
      conversionRate: 66.7,
      thisMonthReferrals: 3,
      lifetimeEarnings: 4200,
      availableCredits: 1500,
      pendingCredits: 800,
      vipStatus: false,
    }

    return NextResponse.json({
      success: true,
      data: mockStats,
    })
  } catch (error) {
    console.error("Get referral stats error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch referral stats" }, { status: 500 })
  }
}
