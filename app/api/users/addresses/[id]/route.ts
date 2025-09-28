import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { nickname, fullAddress, isDefault, type } = body

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const updatedAddress = {
      id: params.id,
      nickname,
      fullAddress,
      isDefault: isDefault || false,
      type: type || "residential",
    }

    return NextResponse.json({
      success: true,
      data: updatedAddress,
      message: "Address updated successfully",
    })
  } catch (error) {
    console.error("Error updating address:", error)
    return NextResponse.json({ success: false, error: "Failed to update address" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return NextResponse.json({
      success: true,
      message: "Address deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting address:", error)
    return NextResponse.json({ success: false, error: "Failed to delete address" }, { status: 500 })
  }
}
