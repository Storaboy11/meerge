import { type NextRequest, NextResponse } from "next/server"

const mockFAQs = [
  {
    id: "faq_001",
    category: "orders",
    question: "When can I place orders?",
    answer:
      "Orders can only be placed on Sundays and Mondays. The order window is typically open from 6:00 AM to 11:59 PM on these days.",
  },
  {
    id: "faq_002",
    category: "orders",
    question: "How do delivery slots work?",
    answer:
      "Your subscription package determines how many delivery slots you have per cycle. Each order uses one slot. Slots reset at the beginning of each subscription cycle.",
  },
  {
    id: "faq_003",
    category: "orders",
    question: "Can I cancel an order?",
    answer:
      "Orders can be cancelled within 2 hours of placement on Sunday/Monday. After this window, orders cannot be cancelled as they enter preparation.",
  },
  {
    id: "faq_004",
    category: "subscriptions",
    question: "Can I change my subscription?",
    answer:
      "Yes, you can upgrade or downgrade your subscription at any time. Changes take effect at the start of your next billing cycle.",
  },
  {
    id: "faq_005",
    category: "subscriptions",
    question: "What happens if I don't use all my slots?",
    answer:
      "Unused slots do not roll over to the next cycle. We recommend choosing a package that matches your ordering frequency.",
  },
  {
    id: "faq_006",
    category: "delivery",
    question: "What if an item is out of stock?",
    answer:
      "If an item becomes unavailable, we'll contact you with substitute options or remove it from your order with a refund for that item.",
  },
  {
    id: "faq_007",
    category: "delivery",
    question: "How are delivery fees calculated?",
    answer:
      "Pickup points have no delivery fee. Home delivery fees vary by location: ₦500-1000 depending on your area and distance.",
  },
  {
    id: "faq_008",
    category: "account",
    question: "How do I update my delivery address?",
    answer:
      "You can update your delivery address in Account Settings. Note that changing locations may affect available pickup points and delivery fees.",
  },
  {
    id: "faq_009",
    category: "account",
    question: "How do I reset my password?",
    answer: "Click 'Forgot Password' on the login page and follow the instructions sent to your email address.",
  },
  {
    id: "faq_010",
    category: "technical",
    question: "Why can't I access my account?",
    answer:
      "Ensure your email is verified and you're using the correct password. Clear your browser cache or try a different browser if issues persist.",
  },
  {
    id: "faq_011",
    category: "technical",
    question: "The website is loading slowly",
    answer:
      "This may be due to high traffic during order windows. Try refreshing the page or accessing during off-peak hours.",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    let filteredFAQs = mockFAQs

    if (category && category !== "all") {
      filteredFAQs = mockFAQs.filter((faq) => faq.category === category)
    }

    const categories = [
      { id: "all", name: "All Categories", count: mockFAQs.length },
      { id: "orders", name: "Orders & Delivery", count: mockFAQs.filter((f) => f.category === "orders").length },
      {
        id: "subscriptions",
        name: "Subscriptions & Payments",
        count: mockFAQs.filter((f) => f.category === "subscriptions").length,
      },
      { id: "delivery", name: "Delivery", count: mockFAQs.filter((f) => f.category === "delivery").length },
      { id: "account", name: "Account Management", count: mockFAQs.filter((f) => f.category === "account").length },
      { id: "technical", name: "Technical Issues", count: mockFAQs.filter((f) => f.category === "technical").length },
    ]

    return NextResponse.json({
      success: true,
      data: {
        faqs: filteredFAQs,
        categories,
      },
    })
  } catch (error) {
    console.error("Error fetching FAQs:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch FAQs" }, { status: 500 })
  }
}
