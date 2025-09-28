import { NextResponse } from "next/server"
import type { SearchParams, SearchResult, Product } from "@/lib/search-types"

// Mock product data (expanded from existing)
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium White Rice",
    category: "Staple Food",
    pricePerKg: 1200,
    stockQty: 150,
    availabilityStatus: "Available",
    images: ["/white-rice-grains.jpg"],
    description: "High-quality white rice, perfect for daily meals. Locally sourced and carefully processed.",
    location: "Yaba",
    popularity: 95,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Brown Beans",
    category: "Staple Food",
    pricePerKg: 800,
    stockQty: 80,
    availabilityStatus: "Available",
    images: ["/brown-beans.jpg"],
    description: "Fresh brown beans, rich in protein and fiber. Perfect for making moi moi and akara.",
    location: "Yaba",
    popularity: 88,
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    name: "Yellow Garri",
    category: "Staple Food",
    pricePerKg: 600,
    stockQty: 200,
    availabilityStatus: "Available",
    images: ["/yellow-garri.jpg"],
    description: "Premium yellow garri from Ogun State. Fine texture and great taste.",
    location: "Yaba",
    popularity: 92,
    createdAt: "2024-01-12",
  },
  {
    id: "4",
    name: "Palm Oil",
    category: "Oil & Condiments",
    pricePerKg: 2500,
    stockQty: 45,
    availabilityStatus: "Available",
    images: ["/palm-oil-bottle.jpg"],
    description: "Pure red palm oil, locally sourced from fresh palm fruits. Rich in vitamins.",
    location: "Yaba",
    popularity: 85,
    createdAt: "2024-01-08",
  },
  {
    id: "5",
    name: "Groundnut Oil",
    category: "Oil & Condiments",
    pricePerKg: 3200,
    stockQty: 30,
    availabilityStatus: "Available",
    images: ["/groundnut-oil-bottle.jpg"],
    description: "Pure groundnut oil, cold-pressed for maximum nutrition and flavor.",
    location: "Yaba",
    popularity: 78,
    createdAt: "2024-01-05",
  },
  {
    id: "6",
    name: "Maggi Cubes",
    category: "Seasoning & Spices",
    pricePerKg: 1800,
    stockQty: 100,
    availabilityStatus: "Available",
    images: ["/maggi-seasoning-cubes.jpg"],
    description: "Popular seasoning cubes for cooking. Adds rich flavor to all dishes.",
    location: "Yaba",
    popularity: 90,
    createdAt: "2024-01-14",
  },
  {
    id: "7",
    name: "Curry Powder",
    category: "Seasoning & Spices",
    pricePerKg: 2200,
    stockQty: 60,
    availabilityStatus: "Available",
    images: ["/curry-powder.jpg"],
    description: "Aromatic curry powder blend with authentic spices. Perfect for rice and stews.",
    location: "Yaba",
    popularity: 82,
    createdAt: "2024-01-11",
  },
  {
    id: "8",
    name: "Fresh Tomatoes",
    category: "Soup Ingredients",
    pricePerKg: 400,
    stockQty: 0,
    availabilityStatus: "Out of Stock",
    images: ["/fresh-red-tomatoes.jpg"],
    description: "Fresh red tomatoes for cooking. Essential ingredient for Nigerian stews.",
    location: "Yaba",
    popularity: 94,
    createdAt: "2024-01-13",
  },
  {
    id: "9",
    name: "Fresh Pepper",
    category: "Soup Ingredients",
    pricePerKg: 800,
    stockQty: 25,
    availabilityStatus: "Available",
    images: ["/fresh-pepper.jpg"],
    description: "Hot fresh pepper for spicing. Adds authentic heat to your meals.",
    location: "Yaba",
    popularity: 87,
    createdAt: "2024-01-09",
  },
  {
    id: "10",
    name: "Onions",
    category: "Soup Ingredients",
    pricePerKg: 350,
    stockQty: 120,
    availabilityStatus: "Available",
    images: ["/pile-of-onions.png"],
    description: "Fresh onions for cooking. Essential base ingredient for most dishes.",
    location: "Yaba",
    popularity: 96,
    createdAt: "2024-01-16",
  },
  {
    id: "11",
    name: "Yam Tubers",
    category: "Staple Food",
    pricePerKg: 500,
    stockQty: 15,
    availabilityStatus: "Seasonal",
    images: ["/yam-tubers.jpg"],
    description: "Fresh yam tubers, seasonal availability. Perfect for pounded yam and boiled yam.",
    location: "Yaba",
    popularity: 75,
    createdAt: "2024-01-07",
  },
  {
    id: "12",
    name: "Plantain",
    category: "Staple Food",
    pricePerKg: 300,
    stockQty: 80,
    availabilityStatus: "Available",
    images: ["/plantain.jpg"],
    description: "Fresh plantain for cooking. Great for dodo, plantain porridge, and more.",
    location: "Yaba",
    popularity: 89,
    createdAt: "2024-01-06",
  },
]

// Popular search terms
const popularSearches = [
  "rice",
  "beans",
  "oil",
  "tomatoes",
  "pepper",
  "onions",
  "garri",
  "plantain",
  "yam",
  "seasoning",
]

// Typo corrections
const typoCorrections: Record<string, string> = {
  ryce: "rice",
  beens: "beans",
  tomatoe: "tomatoes",
  peper: "pepper",
  onion: "onions",
  gari: "garri",
  plantian: "plantain",
  yams: "yam",
}

function fuzzySearch(query: string, text: string): boolean {
  const queryLower = query.toLowerCase()
  const textLower = text.toLowerCase()

  // Exact match
  if (textLower.includes(queryLower)) return true

  // Fuzzy matching for typos
  const corrected = typoCorrections[queryLower]
  if (corrected && textLower.includes(corrected)) return true

  return false
}

function calculateRelevanceScore(product: Product, query: string): number {
  let score = 0
  const queryLower = query.toLowerCase()

  // Name match (highest weight)
  if (product.name.toLowerCase().includes(queryLower)) score += 100

  // Description match
  if (product.description.toLowerCase().includes(queryLower)) score += 50

  // Category match
  if (product.category.toLowerCase().includes(queryLower)) score += 30

  // Popularity boost
  score += (product.popularity || 0) * 0.5

  // Stock availability boost
  if (product.availabilityStatus === "Available" && product.stockQty > 0) score += 20

  return score
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startTime = Date.now()

    const params: SearchParams = {
      query: searchParams.get("query") || undefined,
      categories: searchParams.get("categories")?.split(",") || undefined,
      priceMin: searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined,
      priceMax: searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined,
      availability: searchParams.get("availability")?.split(",") || undefined,
      sortBy: (searchParams.get("sortBy") as SearchParams["sortBy"]) || "relevance",
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 20,
      location: searchParams.get("location") || "Yaba",
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    let filteredProducts = mockProducts.filter((product) => product.location === params.location)

    // Apply search query
    if (params.query) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          fuzzySearch(params.query!, product.name) ||
          fuzzySearch(params.query!, product.description) ||
          fuzzySearch(params.query!, product.category),
      )
    }

    // Apply category filter
    if (params.categories && params.categories.length > 0) {
      filteredProducts = filteredProducts.filter((product) => params.categories!.includes(product.category))
    }

    // Apply price filter
    if (params.priceMin !== undefined) {
      filteredProducts = filteredProducts.filter((product) => product.pricePerKg >= params.priceMin!)
    }
    if (params.priceMax !== undefined) {
      filteredProducts = filteredProducts.filter((product) => product.pricePerKg <= params.priceMax!)
    }

    // Apply availability filter
    if (params.availability && params.availability.length > 0) {
      filteredProducts = filteredProducts.filter((product) => params.availability!.includes(product.availabilityStatus))
    }

    // Sort products
    switch (params.sortBy) {
      case "relevance":
        if (params.query) {
          filteredProducts.sort(
            (a, b) => calculateRelevanceScore(b, params.query!) - calculateRelevanceScore(a, params.query!),
          )
        } else {
          filteredProducts.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        }
        break
      case "price_asc":
        filteredProducts.sort((a, b) => a.pricePerKg - b.pricePerKg)
        break
      case "price_desc":
        filteredProducts.sort((a, b) => b.pricePerKg - a.pricePerKg)
        break
      case "name_asc":
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name_desc":
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name))
        break
      case "stock":
        filteredProducts.sort((a, b) => b.stockQty - a.stockQty)
        break
      case "newest":
        filteredProducts.sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime())
        break
      case "popular":
        filteredProducts.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        break
    }

    // Pagination
    const startIndex = (params.page! - 1) * params.limit!
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + params.limit!)

    // Generate available filters
    const availableFilters = {
      categories: Array.from(new Set(mockProducts.map((p) => p.category))).map((category) => ({
        value: category,
        label: category,
        count: mockProducts.filter((p) => p.category === category).length,
      })),
      priceRange: {
        min: Math.min(...mockProducts.map((p) => p.pricePerKg)),
        max: Math.max(...mockProducts.map((p) => p.pricePerKg)),
      },
      availability: Array.from(new Set(mockProducts.map((p) => p.availabilityStatus))).map((status) => ({
        value: status,
        label: status,
        count: mockProducts.filter((p) => p.availabilityStatus === status).length,
      })),
      locations: Array.from(new Set(mockProducts.map((p) => p.location))).map((location) => ({
        value: location,
        label: location,
        count: mockProducts.filter((p) => p.location === location).length,
      })),
    }

    // Generate suggestions and corrections
    let suggestions: string[] = []
    let correctedQuery: string | undefined

    if (params.query) {
      const queryLower = params.query.toLowerCase()

      // Check for typo corrections
      if (typoCorrections[queryLower]) {
        correctedQuery = typoCorrections[queryLower]
      }

      // Generate suggestions based on partial matches
      suggestions = mockProducts
        .filter((p) => p.name.toLowerCase().includes(queryLower.substring(0, 3)))
        .map((p) => p.name)
        .slice(0, 5)
    } else {
      suggestions = popularSearches.slice(0, 5)
    }

    const searchTime = Date.now() - startTime

    const result: SearchResult = {
      items: paginatedProducts,
      totalCount: filteredProducts.length,
      filters: availableFilters,
      suggestions,
      correctedQuery,
      searchTime,
    }

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Error in search API:", error)
    return NextResponse.json({ success: false, error: "Failed to perform search" }, { status: 500 })
  }
}
