import { type NextRequest, NextResponse } from "next/server"

// Mock user subscription data
const mockUserSubscription = {
  id: "sub_123",
  userId: "user_123",
  packageId: "pkg_4_slots",
  packageName: "4 Slots Package",
  slots: 4,
  quantityLimits: {
    perItemMax: 7,
  },
  locationId: "yaba",
  isActive: true,
  startDate: "2024-01-01",
  endDate: "2024-12-31",
  slotsUsed: 2,
  slotsRemaining: 2,
}

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      data: mockUserSubscription,
    })
  } catch (error) {
    console.error("Error fetching user subscription:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch subscription" }, { status: 500 })
  }
}
