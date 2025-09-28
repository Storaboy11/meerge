import { type NextRequest, NextResponse } from "next/server"

// Mock user profile data
const mockUserProfile = {
  id: "user_123",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+234 801 234 5678",
  location: "Yaba",
  isVerified: true,
  joinedDate: "2024-01-01T00:00:00Z",
  subscription: {
    id: "sub_123",
    packageName: "4 Slots Package",
    slots: 4,
    slotsUsed: 2,
    slotsRemaining: 2,
    renewalDate: "2024-12-31T23:59:59Z",
    isActive: true,
  },
  preferences: {
    emailNotifications: true,
    smsNotifications: false,
    whatsappNotifications: true,
    deliveryReminders: true,
  },
  paymentMethods: [
    {
      id: "pm_123",
      type: "card",
      last4: "4242",
      brand: "visa",
      isDefault: true,
    },
  ],
}

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      data: mockUserProfile,
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch user profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, phone, preferences } = body

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock update - in real app, would update database
    const updatedProfile = {
      ...mockUserProfile,
      firstName: firstName || mockUserProfile.firstName,
      lastName: lastName || mockUserProfile.lastName,
      phone: phone || mockUserProfile.phone,
      preferences: { ...mockUserProfile.preferences, ...preferences },
    }

    return NextResponse.json({
      success: true,
      data: updatedProfile,
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 })
  }
}
