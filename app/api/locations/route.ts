import { NextResponse } from "next/server"

interface Location {
  id: string
  name: string
  description: string
  isActive: boolean
}

// Mock location data - replace with database query in production
const locations: Location[] = [
  {
    id: "1",
    name: "Yaba",
    description: "Fast delivery to Yaba area",
    isActive: true,
  },
  {
    id: "2",
    name: "Ikeja",
    description: "Quick service in Ikeja district",
    isActive: true,
  },
  {
    id: "3",
    name: "Surulere",
    description: "Reliable delivery to Surulere",
    isActive: true,
  },
  {
    id: "4",
    name: "Lekki Phase One",
    description: "Premium service in Lekki Phase 1",
    isActive: true,
  },
  {
    id: "5",
    name: "Lekki Phase Two",
    description: "Express delivery to Lekki Phase 2",
    isActive: true,
  },
]

export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Filter only active locations
    const activeLocations = locations.filter((location) => location.isActive)

    return NextResponse.json({
      success: true,
      data: activeLocations,
    })
  } catch (error) {
    console.error("Error fetching locations:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch locations",
      },
      { status: 500 },
    )
  }
}
