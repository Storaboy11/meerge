import { type NextRequest, NextResponse } from "next/server"

// Mock notifications data
const mockNotifications = [
  {
    id: "notif_001",
    type: "order",
    title: "Order Confirmed",
    description: "Your order #QM-2024-001 has been confirmed and is being prepared.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isRead: false,
    actionUrl: "/orders/QM-2024-001",
    actionText: "View Order",
  },
  {
    id: "notif_002",
    type: "delivery",
    title: "Delivery Tomorrow",
    description: "Your order will be delivered tomorrow between 8:00 AM - 12:00 PM.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    isRead: false,
    actionUrl: "/orders/QM-2024-001",
    actionText: "Track Order",
  },
  {
    id: "notif_003",
    type: "order_window",
    title: "Order Window Opening Soon",
    description: "The order window opens in 2 hours. Don't miss out on fresh products!",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    isRead: true,
    actionUrl: "/dashboard",
    actionText: "Shop Now",
  },
  {
    id: "notif_004",
    type: "subscription",
    title: "Low Slots Remaining",
    description: "You have only 1 slot remaining in your current subscription cycle.",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    isRead: true,
    actionUrl: "/subscribe",
    actionText: "Upgrade Plan",
  },
  {
    id: "notif_005",
    type: "promotion",
    title: "New Products Available",
    description: "Fresh organic vegetables are now available in your area!",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    isRead: true,
    actionUrl: "/dashboard?category=vegetables",
    actionText: "Browse Products",
  },
  {
    id: "notif_006",
    type: "system",
    title: "Scheduled Maintenance",
    description: "Our system will undergo maintenance on Sunday, 2:00 AM - 4:00 AM.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    isRead: true,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get("filter") || "all"

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    let filteredNotifications = mockNotifications

    if (filter !== "all") {
      filteredNotifications = mockNotifications.filter((notif) => notif.type === filter)
    }

    const unreadCount = mockNotifications.filter((notif) => !notif.isRead).length

    return NextResponse.json({
      success: true,
      data: {
        notifications: filteredNotifications,
        unreadCount,
      },
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch notifications" }, { status: 500 })
  }
}
