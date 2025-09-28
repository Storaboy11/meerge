import { type NextRequest, NextResponse } from "next/server"
import type { AdminProduct } from "@/lib/admin-types"

// Mock products data for admin
const mockAdminProducts: AdminProduct[] = [
  {
    id: "1",
    name: "Premium White Rice",
    category: "Staple Food",
    subcategory: "Rice",
    pricePerKg: 1200,
    stockQty: 150,
    availabilityStatus: "Available",
    images: ["/white-rice-bag.jpg"],
    description: "High-quality white rice, perfect for daily meals. Sourced from premium farms in Nigeria.",
    location: "Yaba",
    origin: "Kebbi State",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-25T10:30:00Z",
    isActive: true,
    locationPricing: [
      { location: "Yaba", pricePerKg: 1200 },
      { location: "Ikeja", pricePerKg: 1250 },
      { location: "Surulere", pricePerKg: 1200 },
    ],
  },
  {
    id: "2",
    name: "Brown Beans",
    category: "Staple Food",
    subcategory: "Beans",
    pricePerKg: 800,
    stockQty: 80,
    availabilityStatus: "Available",
    images: ["/brown-beans.jpg"],
    description: "Fresh brown beans, rich in protein and essential nutrients.",
    location: "Yaba",
    origin: "Kano State",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-24T15:20:00Z",
    isActive: true,
  },
  {
    id: "3",
    name: "Yellow Garri",
    category: "Staple Food",
    subcategory: "Cassava Products",
    pricePerKg: 600,
    stockQty: 200,
    availabilityStatus: "Available",
    images: ["/yellow-garri.jpg"],
    description: "Premium yellow garri from Ogun State, processed with modern techniques.",
    location: "Yaba",
    origin: "Ogun State",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-25T09:15:00Z",
    isActive: true,
  },
  {
    id: "4",
    name: "Palm Oil",
    category: "Oil & Condiments",
    subcategory: "Cooking Oil",
    pricePerKg: 2500,
    stockQty: 45,
    availabilityStatus: "Available",
    images: ["/palm-oil-bottle.jpg"],
    description: "Pure red palm oil, locally sourced and processed without additives.",
    location: "Yaba",
    origin: "Cross River State",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-23T14:45:00Z",
    isActive: true,
  },
  {
    id: "5",
    name: "Groundnut Oil",
    category: "Oil & Condiments",
    subcategory: "Cooking Oil",
    pricePerKg: 3200,
    stockQty: 30,
    availabilityStatus: "Available",
    images: ["/groundnut-oil-bottle.jpg"],
    description: "Pure groundnut oil, cold-pressed for maximum nutritional value.",
    location: "Yaba",
    origin: "Kano State",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-22T11:30:00Z",
    isActive: true,
  },
  {
    id: "6",
    name: "Maggi Cubes",
    category: "Seasoning & Spices",
    subcategory: "Seasoning Cubes",
    pricePerKg: 1800,
    stockQty: 100,
    availabilityStatus: "Available",
    images: ["/maggi-seasoning-cubes.jpg"],
    description: "Popular seasoning cubes for cooking, adds rich flavor to meals.",
    location: "Yaba",
    origin: "Lagos State",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-25T16:20:00Z",
    isActive: true,
  },
  {
    id: "7",
    name: "Curry Powder",
    category: "Seasoning & Spices",
    subcategory: "Spice Blends",
    pricePerKg: 2200,
    stockQty: 60,
    availabilityStatus: "Available",
    images: ["/curry-powder.jpg"],
    description: "Aromatic curry powder blend, perfect for rice dishes and stews.",
    location: "Yaba",
    origin: "Lagos State",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-24T13:10:00Z",
    isActive: true,
  },
  {
    id: "8",
    name: "Fresh Tomatoes",
    category: "Soup Ingredients",
    subcategory: "Vegetables",
    pricePerKg: 400,
    stockQty: 0,
    availabilityStatus: "Out of Stock",
    images: ["/fresh-tomatoes.png"],
    description: "Fresh red tomatoes for cooking, rich in vitamins and antioxidants.",
    location: "Yaba",
    origin: "Plateau State",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-25T08:45:00Z",
    isActive: true,
  },
  {
    id: "9",
    name: "Fresh Pepper",
    category: "Soup Ingredients",
    subcategory: "Vegetables",
    pricePerKg: 800,
    stockQty: 25,
    availabilityStatus: "Available",
    images: ["/fresh-pepper.jpg"],
    description: "Hot fresh pepper for spicing, adds heat and flavor to dishes.",
    location: "Yaba",
    origin: "Kaduna State",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-24T17:30:00Z",
    isActive: true,
  },
  {
    id: "10",
    name: "Onions",
    category: "Soup Ingredients",
    subcategory: "Vegetables",
    pricePerKg: 350,
    stockQty: 120,
    availabilityStatus: "Available",
    images: ["/pile-of-onions.png"],
    description: "Fresh onions for cooking, essential ingredient for most Nigerian dishes.",
    location: "Yaba",
    origin: "Sokoto State",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-25T12:15:00Z",
    isActive: true,
  },
  {
    id: "11",
    name: "Yam Tubers",
    category: "Staple Food",
    subcategory: "Tubers",
    pricePerKg: 500,
    stockQty: 15,
    availabilityStatus: "Seasonal",
    images: ["/yam-tubers.jpg"],
    description: "Fresh yam tubers, seasonal availability based on harvest periods.",
    location: "Yaba",
    origin: "Benue State",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-20T14:00:00Z",
    isActive: true,
  },
  {
    id: "12",
    name: "Plantain",
    category: "Staple Food",
    subcategory: "Fruits",
    pricePerKg: 300,
    stockQty: 80,
    availabilityStatus: "Available",
    images: ["/plantain.jpg"],
    description: "Fresh plantain for cooking, can be boiled, fried, or roasted.",
    location: "Yaba",
    origin: "Ogun State",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-25T11:45:00Z",
    isActive: true,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const category = searchParams.get("category")
    const location = searchParams.get("location")
    const status = searchParams.get("status")

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    let filteredProducts = [...mockAdminProducts]

    // Filter by search query
    if (search) {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.id.toLowerCase().includes(searchLower),
      )
    }

    // Filter by category
    if (category && category !== "All Categories") {
      filteredProducts = filteredProducts.filter((product) => product.category === category)
    }

    // Filter by location
    if (location && location !== "All Locations") {
      filteredProducts = filteredProducts.filter((product) => product.location === location)
    }

    // Filter by status
    if (status && status !== "All Status") {
      filteredProducts = filteredProducts.filter((product) => product.availabilityStatus === status)
    }

    // Sort by updated date (newest first)
    filteredProducts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

    return NextResponse.json({
      success: true,
      data: filteredProducts,
      total: filteredProducts.length,
    })
  } catch (error) {
    console.error("Error fetching admin products:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In real app, would validate and save to database
    const newProduct: AdminProduct = {
      id: `product_${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    }

    return NextResponse.json({
      success: true,
      data: newProduct,
      message: "Product created successfully",
    })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 })
  }
}
