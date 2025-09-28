import { type NextRequest, NextResponse } from "next/server"

// Mock addresses data
const mockAddresses = [
  {
    id: "addr_1",
    nickname: "Home",
    fullAddress: "15 Adebayo Street, Yaba, Lagos",
    isDefault: true,
    type: "residential",
  },
  {
    id: "addr_2",
    nickname: "Office",
    fullAddress: "Plot 123 Victoria Island, Lagos",
    isDefault: false,
    type: "commercial",
  },
]

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return NextResponse.json({
      success: true,
      data: mockAddresses,
    })
  } catch (error) {
    console.error("Error fetching addresses:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch addresses" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nickname, fullAddress, isDefault, type } = body

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newAddress = {
      id: `addr_${Date.now()}`,
      nickname,
      fullAddress,
      isDefault: isDefault || false,
      type: type || "residential",
    }

    return NextResponse.json({
      success: true,
      data: newAddress,
      message: "Address added successfully",
    })
  } catch (error) {
    console.error("Error adding address:", error)
    return NextResponse.json({ success: false, error: "Failed to add address" }, { status: 500 })
  }
}
