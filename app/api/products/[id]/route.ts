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
  // Additional fields for product detail page
  origin?: string
  nutritionalInfo?: string
  storageInstructions?: string
  rating?: number
  reviewCount?: number
}

// Mock product data - synchronized with /api/items
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium White Rice",
    category: "Staple Food",
    pricePerKg: 1200,
    stockQty: 150,
    availabilityStatus: "Available",
    images: ["/white-rice-grains.jpg", "/rice-bag-packaging.jpg"],
    description:
      "Premium quality white rice, carefully selected and processed for optimal taste and nutrition. Perfect for all your cooking needs with consistent grain quality and excellent cooking properties.",
    location: "Yaba",
    origin: "Kebbi State, Nigeria",
    nutritionalInfo:
      "Rich in carbohydrates, provides energy, contains essential B vitamins and minerals. Low in fat and sodium.",
    storageInstructions:
      "Store in a cool, dry place in an airtight container. Keep away from moisture and pests. Use within 12 months for best quality.",
    rating: 4.5,
    reviewCount: 128,
  },
  {
    id: "2",
    name: "Brown Beans",
    category: "Staple Food",
    pricePerKg: 800,
    stockQty: 80,
    availabilityStatus: "Available",
    images: ["/brown-beans-in-bowl.jpg", "/brown-beans-sack.jpg"],
    description:
      "Fresh brown beans, rich in protein and essential nutrients. Perfect for making delicious bean porridge, moi moi, and akara. Sourced from quality farms.",
    location: "Yaba",
    origin: "Kano State, Nigeria",
    nutritionalInfo:
      "High in protein, fiber, folate, and iron. Excellent source of plant-based protein and complex carbohydrates.",
    storageInstructions:
      "Store in a cool, dry place in airtight containers. Keep away from moisture and pests. Use within 6 months for best quality.",
    rating: 4.2,
    reviewCount: 89,
  },
  {
    id: "3",
    name: "Yellow Garri",
    category: "Staple Food",
    pricePerKg: 600,
    stockQty: 200,
    availabilityStatus: "Available",
    images: ["/yellow-garri-in-bowl.jpg", "/garri-packaging.jpg"],
    description:
      "Premium yellow garri from Ogun State. Finely processed cassava flakes with excellent texture and taste. Perfect for drinking or making eba.",
    location: "Yaba",
    origin: "Ogun State, Nigeria",
    nutritionalInfo: "Rich in carbohydrates and dietary fiber. Good source of energy and contains essential minerals.",
    storageInstructions:
      "Store in a cool, dry place in airtight containers. Keep away from moisture. Use within 6 months for best quality.",
    rating: 4.3,
    reviewCount: 156,
  },
  {
    id: "4",
    name: "Palm Oil",
    category: "Oil & Condiments",
    pricePerKg: 2500,
    stockQty: 45,
    availabilityStatus: "Available",
    images: ["/red-palm-oil-bottle.jpg", "/palm-oil-container.jpg"],
    description:
      "Pure, unrefined red palm oil with rich flavor and natural color. Essential for authentic Nigerian cooking with high nutritional value and traditional taste.",
    location: "Yaba",
    origin: "Cross River State, Nigeria",
    nutritionalInfo: "Rich in vitamin E, beta-carotene, and healthy fats. Natural source of antioxidants.",
    storageInstructions:
      "Store in a cool, dark place. Keep container tightly sealed. May solidify in cool temperatures - this is normal.",
    rating: 4.7,
    reviewCount: 156,
  },
  {
    id: "5",
    name: "Groundnut Oil",
    category: "Oil & Condiments",
    pricePerKg: 3200,
    stockQty: 30,
    availabilityStatus: "Available",
    images: ["/groundnut-oil-bottle.jpg", "/groundnut-oil-container.jpg"],
    description:
      "Pure groundnut oil, cold-pressed for maximum flavor and nutrition. Perfect for frying, cooking, and salad dressing.",
    location: "Yaba",
    origin: "Kano State, Nigeria",
    nutritionalInfo: "Rich in monounsaturated fats, vitamin E, and antioxidants. Heart-healthy cooking oil.",
    storageInstructions:
      "Store in a cool, dark place. Keep container tightly sealed. Use within 12 months for best quality.",
    rating: 4.4,
    reviewCount: 92,
  },
  {
    id: "6",
    name: "Maggi Cubes",
    category: "Seasoning & Spices",
    pricePerKg: 1800,
    stockQty: 100,
    availabilityStatus: "Available",
    images: ["/maggi-seasoning-cubes.jpg", "/maggi-cubes-packaging.jpg"],
    description:
      "Popular seasoning cubes for cooking. Adds rich flavor to soups, stews, and rice dishes. Essential for Nigerian cuisine.",
    location: "Yaba",
    origin: "Lagos State, Nigeria",
    nutritionalInfo: "Contains salt, flavor enhancers, and spices. Use in moderation as part of a balanced diet.",
    storageInstructions: "Store in a cool, dry place. Keep in original packaging. Use within expiry date.",
    rating: 4.6,
    reviewCount: 234,
  },
  {
    id: "7",
    name: "Curry Powder",
    category: "Seasoning & Spices",
    pricePerKg: 2200,
    stockQty: 60,
    availabilityStatus: "Available",
    images: ["/curry-powder-spice.png", "/curry-powder-container.jpg"],
    description:
      "Aromatic curry powder blend with perfect balance of spices. Adds warmth and depth to rice, meat, and vegetable dishes.",
    location: "Yaba",
    origin: "Lagos State, Nigeria",
    nutritionalInfo:
      "Contains turmeric, coriander, cumin, and other spices. Rich in antioxidants and anti-inflammatory compounds.",
    storageInstructions:
      "Store in a cool, dry place in airtight containers. Keep away from light. Use within 2 years for best flavor.",
    rating: 4.3,
    reviewCount: 78,
  },
  {
    id: "8",
    name: "Fresh Tomatoes",
    category: "Soup Ingredients",
    pricePerKg: 400,
    stockQty: 0,
    availabilityStatus: "Out of Stock",
    images: ["/fresh-red-tomatoes.jpg", "/tomato-basket.jpg"],
    description:
      "Fresh, vine-ripened tomatoes with rich flavor and vibrant color. Perfect for cooking, salads, and sauces. Sourced from local farms for maximum freshness.",
    location: "Yaba",
    origin: "Jos Plateau, Nigeria",
    nutritionalInfo: "High in vitamin C, lycopene, and antioxidants. Low in calories and rich in water content.",
    storageInstructions:
      "Store at room temperature until ripe, then refrigerate. Use within 5-7 days for best quality.",
    rating: 4.2,
    reviewCount: 89,
  },
  {
    id: "9",
    name: "Fresh Pepper",
    category: "Soup Ingredients",
    pricePerKg: 800,
    stockQty: 25,
    availabilityStatus: "Available",
    images: ["/fresh-red-peppers.jpg", "/pepper-basket.jpg"],
    description:
      "Hot fresh pepper for spicing up your meals. Perfect for soups, stews, and pepper sauce. Adds authentic Nigerian heat to dishes.",
    location: "Yaba",
    origin: "Kaduna State, Nigeria",
    nutritionalInfo:
      "High in vitamin C, capsaicin, and antioxidants. May boost metabolism and have anti-inflammatory properties.",
    storageInstructions:
      "Store in refrigerator for longer freshness. Can be frozen for extended storage. Use within 1-2 weeks.",
    rating: 4.1,
    reviewCount: 67,
  },
  {
    id: "10",
    name: "Onions",
    category: "Soup Ingredients",
    pricePerKg: 350,
    stockQty: 120,
    availabilityStatus: "Available",
    images: ["/fresh-onions-pile.jpg", "/onions-in-basket.jpg"],
    description:
      "Fresh onions for cooking. Essential ingredient for most Nigerian dishes. Adds flavor and aroma to soups, stews, and rice dishes.",
    location: "Yaba",
    origin: "Sokoto State, Nigeria",
    nutritionalInfo:
      "Rich in vitamin C, fiber, and antioxidants. Contains compounds that may have anti-inflammatory properties.",
    storageInstructions: "Store in a cool, dry, well-ventilated place. Keep away from potatoes. Use within 2-3 weeks.",
    rating: 4.0,
    reviewCount: 145,
  },
  {
    id: "11",
    name: "Yam Tubers",
    category: "Staple Food",
    pricePerKg: 500,
    stockQty: 15,
    availabilityStatus: "Seasonal",
    images: ["/fresh-yam-tubers.jpg", "/yam-tubers-basket.jpg"],
    description:
      "Fresh, high-quality yam tubers sourced directly from local farms. Perfect for pounding, boiling, or frying. Rich in carbohydrates and essential nutrients for your daily meals.",
    location: "Yaba",
    origin: "Benue State, Nigeria",
    nutritionalInfo:
      "Rich in carbohydrates, dietary fiber, potassium, and vitamin C. Good source of energy and essential minerals.",
    storageInstructions:
      "Store in a cool, dry, well-ventilated place. Keep away from direct sunlight. Use within 2-3 weeks for best quality.",
    rating: 4.3,
    reviewCount: 67,
  },
  {
    id: "12",
    name: "Plantain",
    category: "Staple Food",
    pricePerKg: 300,
    stockQty: 80,
    availabilityStatus: "Available",
    images: ["/fresh-plantain-bunch.jpg", "/plantain-display.jpg"],
    description:
      "Fresh plantain for cooking. Perfect for frying, boiling, or roasting. Sweet and nutritious, great for breakfast or as a side dish.",
    location: "Yaba",
    origin: "Ogun State, Nigeria",
    nutritionalInfo:
      "Rich in potassium, vitamin A, vitamin C, and dietary fiber. Good source of complex carbohydrates.",
    storageInstructions:
      "Store at room temperature until ripe. Can be refrigerated when ripe to slow ripening. Use within 1 week.",
    rating: 4.4,
    reviewCount: 112,
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const product = mockProducts.find((p) => p.id === params.id)

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
          availableIds: mockProducts.map((p) => p.id),
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      product,
    })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 })
  }
}
