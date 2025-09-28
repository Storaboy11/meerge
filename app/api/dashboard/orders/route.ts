import { type NextRequest, NextResponse } from "next/server"

// Mock orders data
const mockOrders = [
  {
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
  },
  {
    id: "ORD_2024_002",
    userId: "user_123",
    items: [
      {
        productId: "garri_001",
        quantity: 4,
        product: {
          id: "garri_001",
          name: "Yellow Garri",
          pricePerKg: 600,
          images: ["/yellow-garri.jpg"],
          category: "Staple Food",
        },
      },
    ],
    status: "out_for_delivery",
    totalAmount: 2500,
    deliveryDate: "2024-01-25T14:00:00Z",
    deliveryPoint: "Home Delivery - 15 Adebayo Street, Yaba",
    createdAt: "2024-01-22T09:15:00Z",
    paymentStatus: "paid",
    paymentMethod: "Paystack",
    deliveryType: "home",
  },
  {
    id: "ORD_2024_003",
    userId: "user_123",
    items: [
      {
        productId: "palm_oil_001",
        quantity: 2,
        product: {
          id: "palm_oil_001",
          name: "Palm Oil (1L bottle)",
          pricePerKg: 1500,
          images: ["/palm-oil-bottle.jpg"],
          category: "Oil & Condiments",
        },
      },
    ],
    status: "confirmed",
    totalAmount: 3150,
    deliveryDate: "2024-01-26T16:00:00Z",
    deliveryPoint: "Yaba Market Square",
    createdAt: "2024-01-23T11:45:00Z",
    paymentStatus: "paid",
    paymentMethod: "Paystack",
    deliveryType: "pickup",
  },
  {
    id: "ORD_2024_004",
    userId: "user_123",
    items: [
      {
        productId: "groundnut_oil_001",
        quantity: 1,
        product: {
          id: "groundnut_oil_001",
          name: "Groundnut Oil (1L bottle)",
          pricePerKg: 2000,
          images: ["/groundnut-oil-bottle.jpg"],
          category: "Oil & Condiments",
        },
      },
    ],
    status: "pending",
    totalAmount: 2100,
    deliveryDate: "2024-01-27T12:00:00Z",
    deliveryPoint: "Yaba Market Square",
    createdAt: "2024-01-24T16:20:00Z",
    paymentStatus: "pending",
    paymentMethod: "Paystack",
    deliveryType: "pickup",
  },
  {
    id: "ORD_2024_005",
    userId: "user_123",
    items: [
      {
        productId: "rice_001",
        quantity: 3,
        product: {
          id: "rice_001",
          name: "White Rice (50kg bag)",
          pricePerKg: 800,
          images: ["/white-rice-bag.jpg"],
          category: "Staple Food",
        },
      },
    ],
    status: "cancelled",
    totalAmount: 2550,
    deliveryDate: "2024-01-20T10:00:00Z",
    deliveryPoint: "Yaba Market Square",
    createdAt: "2024-01-17T13:10:00Z",
    paymentStatus: "failed",
    paymentMethod: "Paystack",
    deliveryType: "pickup",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const dateRange = searchParams.get("dateRange")

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    let filteredOrders = [...mockOrders]

    // Filter by status
    if (status && status !== "all") {
      filteredOrders = filteredOrders.filter((order) => order.status === status)
    }

    // Filter by search query (order ID or product name)
    if (search) {
      const searchLower = search.toLowerCase()
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.id.toLowerCase().includes(searchLower) ||
          order.items.some((item) => item.product.name.toLowerCase().includes(searchLower)),
      )
    }

    // Filter by date range
    if (dateRange && dateRange !== "all") {
      const now = new Date()
      let startDate = new Date()

      switch (dateRange) {
        case "week":
          startDate.setDate(now.getDate() - 7)
          break
        case "month":
          startDate.setMonth(now.getMonth() - 1)
          break
        default:
          startDate = new Date(0) // All time
      }

      filteredOrders = filteredOrders.filter((order) => new Date(order.createdAt) >= startDate)
    }

    // Sort by creation date (newest first)
    filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({
      success: true,
      data: filteredOrders,
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
  }
}
