import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id
    const body = await request.json()
    const { deliveryRating, productQualityRating, deliveryPartnerRating, comments, issues } = body

    // Validate ratings
    if (
      deliveryRating < 1 ||
      deliveryRating > 5 ||
      productQualityRating < 1 ||
      productQualityRating > 5 ||
      deliveryPartnerRating < 1 ||
      deliveryPartnerRating > 5
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Ratings must be between 1 and 5",
        },
        { status: 400 },
      )
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Save feedback (would normally save to database)
    const feedback = {
      id: `feedback_${Date.now()}`,
      orderId,
      deliveryRating,
      productQualityRating,
      deliveryPartnerRating,
      comments,
      issues,
      submittedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: feedback,
      message: "Thank you for your feedback!",
    })
  } catch (error) {
    console.error("Error submitting feedback:", error)
    return NextResponse.json({ success: false, error: "Failed to submit feedback" }, { status: 500 })
  }
}
