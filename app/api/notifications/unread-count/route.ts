import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Mock unread count - in real app, would query database
    const unreadCount = 2

    return NextResponse.json({
      success: true,
      data: { unreadCount },
    })
  } catch (error) {
    console.error("Error fetching unread count:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch unread count" }, { status: 500 })
  }
}
