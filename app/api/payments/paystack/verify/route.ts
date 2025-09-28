import { NextResponse } from "next/server"

interface PaymentVerifyRequest {
  reference: string
  orderId: string
}

export async function POST(request: Request) {
  try {
    const body: PaymentVerifyRequest = await request.json()
    const { reference, orderId } = body

    // Validate required fields
    if (!reference || !orderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    // Simulate Paystack payment verification
    // In production, you would verify with actual Paystack API
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock successful payment verification (90% success rate)
    const isSuccessful = Math.random() > 0.1

    if (isSuccessful) {
      return NextResponse.json({
        success: true,
        data: {
          reference,
          status: "success",
          amount: 15000, // This would come from Paystack
          paidAt: new Date().toISOString(),
          channel: "card",
          currency: "NGN",
        },
      })
    } else {
      return NextResponse.json({
        success: false,
        data: {
          reference,
          status: "failed",
          message: "Payment verification failed",
        },
      })
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to verify payment",
      },
      { status: 500 },
    )
  }
}
