import { type NextRequest, NextResponse } from "next/server"

// Mock tracking data
const mockTrackingData = {
  ORD_2024_001: {
    orderId: "ORD_2024_001",
    status: "delivered",
    timeline: [
      {
        status: "Order Placed",
        timestamp: "2024-01-15T14:30:00Z",
        description: "Your order has been received and is being processed",
        completed: true,
        location: "Quick Market HQ",
      },
      {
        status: "Payment Confirmed",
        timestamp: "2024-01-15T14:32:00Z",
        description: "Payment has been confirmed via Paystack",
        completed: true,
        location: "Payment Gateway",
      },
      {
        status: "Order Processing",
        timestamp: "2024-01-16T09:00:00Z",
        description: "Your items are being prepared for delivery",
        completed: true,
        location: "Yaba Warehouse",
      },
      {
        status: "Out for Delivery",
        timestamp: "2024-01-18T08:00:00Z",
        description: "Your order is on its way to the pickup point",
        completed: true,
        location: "En route to Yaba Market Square",
      },
      {
        status: "Delivered",
        timestamp: "2024-01-18T10:30:00Z",
        description: "Your order has been delivered successfully",
        completed: true,
        location: "Yaba Market Square",
      },
    ],
    deliveryInfo: {
      assignedDate: "2024-01-18",
      timeSlot: "10:00 AM - 12:00 PM",
      address: "Yaba Market Square, Lagos",
      partnerId: "partner_001",
      partnerName: "Adebayo Johnson",
      partnerPhone: "+234 801 234 5678",
      estimatedTime: "10:30 AM",
      actualDeliveryTime: "10:30 AM",
      deliveryPhoto: "/delivery-confirmation.jpg",
    },
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
    ],
    totals: {
      subtotal: 4000,
      deliveryFees: 300,
      serviceFee: 100,
      total: 4400,
    },
    modificationAllowed: false,
    trackingUpdates: [
      {
        id: "track_001",
        timestamp: "2024-01-18T08:00:00Z",
        status: "Departed from warehouse",
        location: "Yaba Warehouse",
        description: "Package has left the warehouse and is en route",
      },
      {
        id: "track_002",
        timestamp: "2024-01-18T09:15:00Z",
        status: "In transit",
        location: "Ikorodu Road",
        description: "Package is in transit to delivery location",
        estimatedArrival: "10:30 AM",
      },
      {
        id: "track_003",
        timestamp: "2024-01-18T10:30:00Z",
        status: "Delivered",
        location: "Yaba Market Square",
        description: "Package delivered successfully",
      },
    ],
    deliveryPartner: {
      id: "partner_001",
      name: "Adebayo Johnson",
      phone: "+234 801 234 5678",
      photo: "/delivery-partner.jpg",
      rating: 4.8,
      vehicleInfo: "Honda CG125 - ABC 123 XY",
      currentLocation: {
        lat: 6.5244,
        lng: 3.3792,
      },
    },
  },
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const trackingData = mockTrackingData[orderId as keyof typeof mockTrackingData]

    if (!trackingData) {
      return NextResponse.json({ success: false, error: "Tracking data not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: trackingData,
    })
  } catch (error) {
    console.error("Error fetching tracking data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch tracking data" }, { status: 500 })
  }
}
