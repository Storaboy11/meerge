import { type NextRequest, NextResponse } from "next/server"

const mockPickupPoints = {
  yaba: [
    { id: "yaba_1", name: "Yaba Market Square", address: "123 Herbert Macaulay Way, Yaba", fee: 0 },
    { id: "yaba_2", name: "University of Lagos Gate", address: "UNILAG Main Gate, Akoka", fee: 0 },
    { id: "yaba_3", name: "Tejuosho Market", address: "Tejuosho Complex, Yaba", fee: 0 },
  ],
  ikeja: [
    { id: "ikeja_1", name: "Computer Village", address: "Ikeja Computer Village", fee: 0 },
    { id: "ikeja_2", name: "Allen Avenue Junction", address: "Allen Avenue, Ikeja", fee: 0 },
    { id: "ikeja_3", name: "Ikeja City Mall", address: "Obafemi Awolowo Way, Ikeja", fee: 0 },
  ],
  surulere: [
    { id: "surulere_1", name: "National Stadium", address: "National Stadium, Surulere", fee: 0 },
    { id: "surulere_2", name: "Adeniran Ogunsanya Mall", address: "Adeniran Ogunsanya Street", fee: 0 },
  ],
  "lekki-phase-one": [
    { id: "lekki1_1", name: "Lekki Phase 1 Gate", address: "Admiralty Way, Lekki Phase 1", fee: 0 },
    { id: "lekki1_2", name: "Palms Shopping Mall", address: "Bisola Durosinmi-Etti Drive", fee: 0 },
  ],
  "lekki-phase-two": [
    { id: "lekki2_1", name: "Lekki Phase 2 Gate", address: "Mobil Road, Lekki Phase 2", fee: 0 },
    { id: "lekki2_2", name: "Mega Plaza", address: "Victoria Island Extension", fee: 0 },
  ],
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const locationId = params.id.toLowerCase()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const pickupPoints = mockPickupPoints[locationId as keyof typeof mockPickupPoints] || []

    return NextResponse.json({
      success: true,
      data: pickupPoints,
    })
  } catch (error) {
    console.error("Error fetching pickup points:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch pickup points" }, { status: 500 })
  }
}
