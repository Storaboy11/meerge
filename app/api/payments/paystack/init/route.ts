import { NextResponse } from "next/server"

interface PaymentInitRequest {
  email: string
  amount: number
  packageId: string
  locationId: string
}

export async function POST(request: Request) {
  try {
    const body: PaymentInitRequest = await request.json()
    const { email, amount, packageId, locationId } = body

    // Validate required fields
    if (!email || !amount || !packageId || !locationId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    // Simulate Paystack payment initialization
    // In production, you would integrate with actual Paystack API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock successful payment initialization
    const mockPaymentData = {
      authorization_url: `https://checkout.paystack.com/mock-payment-${Date.now()}`,
      access_code: `access_code_${Date.now()}`,
      reference: `ref_${Date.now()}_${packageId}`,
    }

    return NextResponse.json({
      success: true,
      data: mockPaymentData,
    })
  } catch (error) {
    console.error("Error initializing payment:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initialize payment",
      },
      { status: 500 },
    )
  }
}
