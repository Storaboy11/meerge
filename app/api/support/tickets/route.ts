import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, subject, message, orderId, priority = "medium" } = body

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock ticket creation
    const ticketId = `TICKET-${Date.now()}`

    console.log("Creating support ticket:", {
      ticketId,
      type,
      subject,
      message,
      orderId,
      priority,
    })

    return NextResponse.json({
      success: true,
      data: {
        ticketId,
        status: "open",
        estimatedResponse: "2-4 hours",
      },
      message: "Support ticket created successfully",
    })
  } catch (error) {
    console.error("Error creating support ticket:", error)
    return NextResponse.json({ success: false, error: "Failed to create support ticket" }, { status: 500 })
  }
}
