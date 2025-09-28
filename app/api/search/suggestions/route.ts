import { NextResponse } from "next/server"
import type { SearchSuggestion } from "@/lib/search-types"

// Mock data for suggestions
const productNames = [
  "Premium White Rice",
  "Brown Beans",
  "Yellow Garri",
  "Palm Oil",
  "Groundnut Oil",
  "Maggi Cubes",
  "Curry Powder",
  "Fresh Tomatoes",
  "Fresh Pepper",
  "Onions",
  "Yam Tubers",
  "Plantain",
  "Sweet Potatoes",
  "Irish Potatoes",
  "Cassava Flour",
]

const categories = ["Staple Food", "Oil & Condiments", "Seasoning & Spices", "Soup Ingredients"]

const popularQueries = ["rice", "beans", "oil", "tomatoes", "pepper", "onions", "garri", "plantain", "yam", "seasoning"]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.toLowerCase() || ""

    if (!query || query.length < 2) {
      // Return popular searches if no query
      const suggestions: SearchSuggestion[] = popularQueries.map((term) => ({
        text: term,
        type: "popular",
        count: Math.floor(Math.random() * 50) + 10,
      }))

      return NextResponse.json({
        success: true,
        suggestions: suggestions.slice(0, 8),
      })
    }

    const suggestions: SearchSuggestion[] = []

    // Product name suggestions
    productNames
      .filter((name) => name.toLowerCase().includes(query))
      .slice(0, 4)
      .forEach((name) => {
        suggestions.push({
          text: name,
          type: "product",
        })
      })

    // Category suggestions
    categories
      .filter((category) => category.toLowerCase().includes(query))
      .slice(0, 2)
      .forEach((category) => {
        suggestions.push({
          text: category,
          type: "category",
        })
      })

    // Popular query suggestions
    popularQueries
      .filter((term) => term.includes(query))
      .slice(0, 3)
      .forEach((term) => {
        suggestions.push({
          text: term,
          type: "popular",
          count: Math.floor(Math.random() * 50) + 10,
        })
      })

    return NextResponse.json({
      success: true,
      suggestions: suggestions.slice(0, 8),
    })
  } catch (error) {
    console.error("Error fetching suggestions:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch suggestions" }, { status: 500 })
  }
}
