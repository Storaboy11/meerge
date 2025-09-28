import { type NextRequest, NextResponse } from "next/server"

// Mock order details (would normally fetch from database)
const mockOrderDetails = {
  ORD_2024_001: {
    id: "ORD_2024_001",
    userId: "user_123",
    items: [
      {
        productId: "rice_001",
        quantity: 5,
        product: {
          id: "rice_001",
          name: "White Rice (50kg bag)",
          pricePerKg: 800,
          images: ["/white-rice-bag.jpg"],
          category: "Staple Food",
        },
      },
      {
        productId: "beans_001",
        quantity: 3,
        product: {
          id: "beans_001",
          name: "Brown Beans",
          pricePerKg: 1200,
          images: ["/brown-beans.jpg"],
          category: "Staple Food",
        },
      },
    ],
    status: "delivered",
    totalAmount: 7600,
    deliveryDate: "2024-01-18T10:00:00Z",
    deliveryPoint: "Yaba Market Square",
    createdAt: "2024-01-15T14:30:00Z",
    paymentStatus: "paid",
    paymentMethod: "Paystack",
    deliveryType: "pickup",
    deliveryFees: 300,
    subtotal: 7300,
    timeline: [
      {
        status: "Order Placed",
        timestamp: "2024-01-15T14:30:00Z",
        description: "Your order has been received and is being processed",
      },
      {
        status: "Order Confirmed",
        timestamp: "2024-01-16T09:00:00Z",
        description: "Your order has been confirmed and is being prepared",
      },
      {
        status: "Out for Delivery",
        timestamp: "2024-01-18T08:00:00Z",
        description: "Your order is on its way to the pickup point",
      },
      {
        status: "Delivered",
        timestamp: "2024-01-18T10:30:00Z",
        description: "Your order has been delivered successfully",
      },
    ],
  },
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const orderDetails = mockOrderDetails[orderId as keyof typeof mockOrderDetails]

    if (!orderDetails) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: orderDetails,
    })
  } catch (error) {
    console.error("Error fetching order details:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch order details" }, { status: 500 })
  }
}
