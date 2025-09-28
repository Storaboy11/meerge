import { NextResponse } from "next/server"

interface Package {
  id: string
  name: string
  slots: number
  price: number
  quantityLimits: {
    perItemMax: number
  }
  locationId: string
  features: string[]
  isPopular?: boolean
}

// Location-based pricing data
const locationPricing = {
  "1": {
    // Yaba
    "2": 6000,
    "4": 11000,
    "6": 17000,
    unlimited: 19000,
  },
  "2": {
    // Ikeja
    "2": 5500,
    "4": 10000,
    "6": 14000,
    unlimited: 19000,
  },
  "3": {
    // Surulere
    "2": 6000,
    "4": 11000,
    "6": 16000,
    unlimited: 18000,
  },
  "4": {
    // Lekki Phase One
    "2": 7500,
    "4": 14000,
    "6": 20500,
    unlimited: 25000,
  },
  "5": {
    // Lekki Phase Two
    "2": 8500,
    "4": 16000,
    "6": 20500,
    unlimited: 30000,
  },
}

const generatePackagesForLocation = (locationId: string): Package[] => {
  const pricing = locationPricing[locationId as keyof typeof locationPricing]

  if (!pricing) {
    throw new Error("Invalid location ID")
  }

  return [
    {
      id: `${locationId}-2-slots`,
      name: "2 Slots Package",
      slots: 2,
      price: pricing["2"],
      quantityLimits: {
        perItemMax: 4,
      },
      locationId,
      features: [
        "2 delivery windows per month",
        "Max 4 units per item",
        "Basic customer support",
        "Thursday/Friday delivery",
        "Sunday/Monday order window",
      ],
    },
    {
      id: `${locationId}-4-slots`,
      name: "4 Slots Package",
      slots: 4,
      price: pricing["4"],
      quantityLimits: {
        perItemMax: 7,
      },
      locationId,
      features: [
        "4 delivery windows per month",
        "Max 7 units per item",
        "Priority customer support",
        "Thursday/Friday delivery",
        "Sunday/Monday order window",
        "Bulk discounts available",
      ],
      isPopular: true,
    },
    {
      id: `${locationId}-6-slots`,
      name: "6 Slots Package",
      slots: 6,
      price: pricing["6"],
      quantityLimits: {
        perItemMax: 10,
      },
      locationId,
      features: [
        "6 delivery windows per month",
        "Max 10 units per item",
        "Priority customer support",
        "Thursday/Friday delivery",
        "Sunday/Monday order window",
        "Maximum bulk discounts",
      ],
    },
    {
      id: `${locationId}-unlimited`,
      name: "Unlimited Package",
      slots: 0, // 0 represents unlimited
      price: pricing["unlimited"],
      quantityLimits: {
        perItemMax: 999, // Effectively unlimited
      },
      locationId,
      features: [
        "Unlimited delivery windows",
        "No quantity restrictions",
        "24/7 premium support",
        "Thursday/Friday delivery",
        "Sunday/Monday order window",
        "Maximum bulk discounts",
        "Early access to new areas",
      ],
    },
  ]
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const locationId = searchParams.get("locationId")

    if (!locationId) {
      return NextResponse.json(
        {
          success: false,
          error: "Location ID is required",
        },
        { status: 400 },
      )
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const packages = generatePackagesForLocation(locationId)

    return NextResponse.json({
      success: true,
      data: packages,
    })
  } catch (error) {
    console.error("Error fetching packages:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch packages",
      },
      { status: 500 },
    )
  }
}
