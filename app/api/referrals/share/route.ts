import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    const { platform, referralCode } = await request.json()

    if (!platform || !referralCode) {
      return NextResponse.json({ success: false, error: "Platform and referral code are required" }, { status: 400 })
    }

    const baseUrl = process.env.NEXTAUTH_URL || "https://quickmarket.com"
    const referralUrl = `${baseUrl}/join/${referralCode}`

    const shareMessages = {
      whatsapp: {
        message: `🛒 Join Quick Market with my code ${referralCode} and save NGN 300 on your first grocery order! Fresh groceries delivered to your door. ${referralUrl}`,
        url: `https://wa.me/?text=${encodeURIComponent(`🛒 Join Quick Market with my code ${referralCode} and save NGN 300 on your first grocery order! Fresh groceries delivered to your door. ${referralUrl}`)}`,
      },
      sms: {
        message: `Join Quick Market with my code ${referralCode} and save NGN 300 on your first grocery order! ${referralUrl}`,
        url: `sms:?body=${encodeURIComponent(`Join Quick Market with my code ${referralCode} and save NGN 300 on your first grocery order! ${referralUrl}`)}`,
      },
      email: {
        message: `I've been using Quick Market for my grocery shopping and it's amazing! Join with my referral code ${referralCode} and get NGN 300 off your first order. Fresh groceries delivered right to your door!`,
        url: `mailto:?subject=${encodeURIComponent("Save NGN 300 on Quick Market!")}&body=${encodeURIComponent(`I've been using Quick Market for my grocery shopping and it's amazing! Join with my referral code ${referralCode} and get NGN 300 off your first order. Fresh groceries delivered right to your door! ${referralUrl}`)}`,
      },
      facebook: {
        message: `Join Quick Market with my code ${referralCode} and save NGN 300!`,
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`,
      },
      twitter: {
        message: `🛒 Save NGN 300 on @QuickMarket with my code ${referralCode}! Fresh groceries delivered to your door.`,
        url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`🛒 Save NGN 300 on @QuickMarket with my code ${referralCode}! Fresh groceries delivered to your door. ${referralUrl}`)}`,
      },
    }

    const shareData = shareMessages[platform as keyof typeof shareMessages]

    if (!shareData) {
      return NextResponse.json({ success: false, error: "Invalid platform" }, { status: 400 })
    }

    // Log share activity (in real implementation, save to database)
    console.log(`User ${session.user.id} shared referral code ${referralCode} on ${platform}`)

    return NextResponse.json({
      success: true,
      data: shareData,
    })
  } catch (error) {
    console.error("Share referral error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate share link" }, { status: 500 })
  }
}
