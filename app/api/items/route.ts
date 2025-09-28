import { NextResponse } from "next/server"

export interface Product {
  id: string
  name: string
  category: string
  pricePerKg: number
  stockQty: number
  availabilityStatus: "Available" | "Out of Stock" | "Seasonal"
  images: string[]
  description: string
  location: string
}

const mockProducts: Product[] = [
  // Yaba Products
  {
    id: "1",
    name: "Premium White Rice",
    category: "Staple Food",
    pricePerKg: 1200,
    stockQty: 150,
    availabilityStatus: "Available",
    images: ["/white-rice-bag.jpg"],
    description: "High-quality white rice, perfect for daily meals",
    location: "Yaba",
  },
  {
    id: "2",
    name: "Brown Beans",
    category: "Staple Food",
    pricePerKg: 800,
    stockQty: 80,
    availabilityStatus: "Available",
    images: ["/brown-beans-in-bowl.jpg"],
    description: "Fresh brown beans, rich in protein",
    location: "Yaba",
  },
  {
    id: "3",
    name: "Yellow Garri",
    category: "Staple Food",
    pricePerKg: 600,
    stockQty: 200,
    availabilityStatus: "Available",
    images: ["/yellow-garri-in-bowl.jpg"],
    description: "Premium yellow garri from Ogun State",
    location: "Yaba",
  },
  {
    id: "4",
    name: "Palm Oil",
    category: "Oil & Condiments",
    pricePerKg: 2500,
    stockQty: 45,
    availabilityStatus: "Available",
    images: ["/palm-oil-bottle.jpg"],
    description: "Pure red palm oil, locally sourced",
    location: "Yaba",
  },
  {
    id: "5",
    name: "Groundnut Oil",
    category: "Oil & Condiments",
    pricePerKg: 3200,
    stockQty: 30,
    availabilityStatus: "Available",
    images: ["/groundnut-oil-bottle.jpg"],
    description: "Pure groundnut oil, cold-pressed",
    location: "Yaba",
  },
  {
    id: "6",
    name: "Maggi Cubes",
    category: "Seasoning & Spices",
    pricePerKg: 1800,
    stockQty: 100,
    availabilityStatus: "Available",
    images: ["/maggi-seasoning-cubes.jpg"],
    description: "Popular seasoning cubes for cooking",
    location: "Yaba",
  },
  {
    id: "7",
    name: "Curry Powder",
    category: "Seasoning & Spices",
    pricePerKg: 2200,
    stockQty: 60,
    availabilityStatus: "Available",
    images: ["/curry-powder-spice.png"],
    description: "Aromatic curry powder blend",
    location: "Yaba",
  },
  {
    id: "8",
    name: "Fresh Tomatoes",
    category: "Soup Ingredients",
    pricePerKg: 400,
    stockQty: 0,
    availabilityStatus: "Out of Stock",
    images: ["/fresh-tomatoes.png"],
    description: "Fresh red tomatoes for cooking",
    location: "Yaba",
  },
  {
    id: "9",
    name: "Fresh Pepper",
    category: "Soup Ingredients",
    pricePerKg: 800,
    stockQty: 25,
    availabilityStatus: "Available",
    images: ["/fresh-pepper.jpg"],
    description: "Hot fresh pepper for spicing",
    location: "Yaba",
  },
  {
    id: "10",
    name: "Onions",
    category: "Soup Ingredients",
    pricePerKg: 350,
    stockQty: 120,
    availabilityStatus: "Available",
    images: ["/pile-of-onions.png"],
    description: "Fresh onions for cooking",
    location: "Yaba",
  },
  {
    id: "11",
    name: "Yam Tubers",
    category: "Staple Food",
    pricePerKg: 500,
    stockQty: 15,
    availabilityStatus: "Seasonal",
    images: ["/yam-tubers.jpg"],
    description: "Fresh yam tubers, seasonal availability",
    location: "Yaba",
  },
  {
    id: "12",
    name: "Plantain",
    category: "Staple Food",
    pricePerKg: 300,
    stockQty: 80,
    availabilityStatus: "Available",
    images: ["/plantain.jpg"],
    description: "Fresh plantain for cooking",
    location: "Yaba",
  },

  // Ikeja Products
  {
    id: "13",
    name: "Premium White Rice",
    category: "Staple Food",
    pricePerKg: 1250,
    stockQty: 120,
    availabilityStatus: "Available",
    images: ["/white-rice-bag.jpg"],
    description: "High-quality white rice, perfect for daily meals",
    location: "Ikeja",
  },
  {
    id: "14",
    name: "Brown Beans",
    category: "Staple Food",
    pricePerKg: 850,
    stockQty: 60,
    availabilityStatus: "Available",
    images: ["/brown-beans-in-bowl.jpg"],
    description: "Fresh brown beans, rich in protein",
    location: "Ikeja",
  },
  {
    id: "15",
    name: "Yellow Garri",
    category: "Staple Food",
    pricePerKg: 650,
    stockQty: 180,
    availabilityStatus: "Available",
    images: ["/yellow-garri-in-bowl.jpg"],
    description: "Premium yellow garri from Ogun State",
    location: "Ikeja",
  },
  {
    id: "16",
    name: "Palm Oil",
    category: "Oil & Condiments",
    pricePerKg: 2600,
    stockQty: 35,
    availabilityStatus: "Available",
    images: ["/palm-oil-bottle.jpg"],
    description: "Pure red palm oil, locally sourced",
    location: "Ikeja",
  },
  {
    id: "17",
    name: "Groundnut Oil",
    category: "Oil & Condiments",
    pricePerKg: 3300,
    stockQty: 25,
    availabilityStatus: "Available",
    images: ["/groundnut-oil-bottle.jpg"],
    description: "Pure groundnut oil, cold-pressed",
    location: "Ikeja",
  },
  {
    id: "18",
    name: "Maggi Cubes",
    category: "Seasoning & Spices",
    pricePerKg: 1850,
    stockQty: 90,
    availabilityStatus: "Available",
    images: ["/maggi-seasoning-cubes.jpg"],
    description: "Popular seasoning cubes for cooking",
    location: "Ikeja",
  },

  // Surulere Products
  {
    id: "19",
    name: "Premium White Rice",
    category: "Staple Food",
    pricePerKg: 1180,
    stockQty: 140,
    availabilityStatus: "Available",
    images: ["/white-rice-bag.jpg"],
    description: "High-quality white rice, perfect for daily meals",
    location: "Surulere",
  },
  {
    id: "20",
    name: "Brown Beans",
    category: "Staple Food",
    pricePerKg: 780,
    stockQty: 90,
    availabilityStatus: "Available",
    images: ["/brown-beans-in-bowl.jpg"],
    description: "Fresh brown beans, rich in protein",
    location: "Surulere",
  },
  {
    id: "21",
    name: "Yellow Garri",
    category: "Staple Food",
    pricePerKg: 580,
    stockQty: 220,
    availabilityStatus: "Available",
    images: ["/yellow-garri-in-bowl.jpg"],
    description: "Premium yellow garri from Ogun State",
    location: "Surulere",
  },
  {
    id: "22",
    name: "Palm Oil",
    category: "Oil & Condiments",
    pricePerKg: 2450,
    stockQty: 50,
    availabilityStatus: "Available",
    images: ["/palm-oil-bottle.jpg"],
    description: "Pure red palm oil, locally sourced",
    location: "Surulere",
  },

  // Lekki Products
  {
    id: "23",
    name: "Premium White Rice",
    category: "Staple Food",
    pricePerKg: 1350,
    stockQty: 100,
    availabilityStatus: "Available",
    images: ["/white-rice-bag.jpg"],
    description: "High-quality white rice, perfect for daily meals",
    location: "Lekki",
  },
  {
    id: "24",
    name: "Brown Beans",
    category: "Staple Food",
    pricePerKg: 900,
    stockQty: 70,
    availabilityStatus: "Available",
    images: ["/brown-beans-in-bowl.jpg"],
    description: "Fresh brown beans, rich in protein",
    location: "Lekki",
  },
  {
    id: "25",
    name: "Yellow Garri",
    category: "Staple Food",
    pricePerKg: 700,
    stockQty: 160,
    availabilityStatus: "Available",
    images: ["/yellow-garri-in-bowl.jpg"],
    description: "Premium yellow garri from Ogun State",
    location: "Lekki",
  },

  // Ajah Products
  {
    id: "26",
    name: "Premium White Rice",
    category: "Staple Food",
    pricePerKg: 1300,
    stockQty: 110,
    availabilityStatus: "Available",
    images: ["/white-rice-bag.jpg"],
    description: "High-quality white rice, perfect for daily meals",
    location: "Ajah",
  },
  {
    id: "27",
    name: "Brown Beans",
    category: "Staple Food",
    pricePerKg: 880,
    stockQty: 65,
    availabilityStatus: "Available",
    images: ["/brown-beans-in-bowl.jpg"],
    description: "Fresh brown beans, rich in protein",
    location: "Ajah",
  },
  {
    id: "28",
    name: "Yellow Garri",
    category: "Staple Food",
    pricePerKg: 680,
    stockQty: 190,
    availabilityStatus: "Available",
    images: ["/yellow-garri-in-bowl.jpg"],
    description: "Premium yellow garri from Ogun State",
    location: "Ajah",
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location") || "Yaba"
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    let filteredProducts = mockProducts.filter((product) => product.location === location)

    if (category && category !== "All Items") {
      filteredProducts = filteredProducts.filter((product) => product.category === category)
    }

    if (search) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase()),
      )
    }

    return NextResponse.json({
      success: true,
      products: filteredProducts,
      total: filteredProducts.length,
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
  }
}
