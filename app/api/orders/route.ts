import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, deliveryInfo, totalAmount, slotUsage } = body

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock order creation
    const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const mockOrder = {
      id: orderId,
      userId: "user_123",
      items,
      deliveryInfo,
      totalAmount,
      slotUsage,
      status: "confirmed",
      orderDate: new Date().toISOString(),
      deliveryDate: getDeliveryDate(),
      paymentStatus: "pending",
    }

    return NextResponse.json({
      success: true,
      data: mockOrder,
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}

function getDeliveryDate() {
  const today = new Date()
  const dayOfWeek = today.getDay()

  // Calculate next delivery day (Thursday, Friday, or Saturday)
  let daysToAdd = 4 - dayOfWeek // Thursday
  if (daysToAdd <= 0) daysToAdd += 7

  const deliveryDate = new Date(today)
  deliveryDate.setDate(today.getDate() + daysToAdd)

  return deliveryDate.toISOString()
}
