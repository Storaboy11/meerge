import { NextResponse } from "next/server"
import type { DashboardStats } from "@/lib/admin-types"

// Mock dashboard statistics
const mockDashboardStats: DashboardStats = {
  totalOrders: {
    today: 24,
    thisWeek: 156,
    thisMonth: 642,
  },
  activeSubscriptions: 1247,
  totalRevenue: {
    today: 485000,
    thisWeek: 2850000,
    thisMonth: 12400000,
  },
  pendingOrders: 8,
  outOfStockItems: 3,
  activeUsers: 2156,
  recentOrders: [
    {
      id: "ORD_2024_156",
      userId: "user_456",
      customerName: "Sarah Johnson",
      customerEmail: "sarah@example.com",
      customerPhone: "+234 801 234 5678",
      items: [
        {
          productId: "rice_001",
          quantity: 5,
          product: {
            id: "rice_001",
            name: "Premium White Rice",
            pricePerKg: 1200,
            images: ["/white-rice-bag.jpg"],
            category: "Staple Food",
          },
        },
      ],
      status: "pending",
      totalAmount: 6300,
      deliveryDate: "2024-01-28T10:00:00Z",
      deliveryPoint: "Yaba Market Square",
      deliveryType: "pickup",
      createdAt: "2024-01-25T14:30:00Z",
      paymentStatus: "paid",
      paymentMethod: "Paystack",
      location: "Yaba",
    },
    {
      id: "ORD_2024_155",
      userId: "user_789",
      customerName: "Michael Chen",
      customerEmail: "michael@example.com",
      customerPhone: "+234 802 345 6789",
      items: [
        {
          productId: "beans_001",
          quantity: 3,
          product: {
            id: "beans_001",
            name: "Brown Beans",
            pricePerKg: 800,
            images: ["/brown-beans.jpg"],
            category: "Staple Food",
          },
        },
      ],
      status: "confirmed",
      totalAmount: 2520,
      deliveryDate: "2024-01-28T14:00:00Z",
      deliveryPoint: "Home Delivery",
      deliveryType: "home",
      createdAt: "2024-01-25T11:15:00Z",
      paymentStatus: "paid",
      paymentMethod: "Paystack",
      location: "Ikeja",
    },
    {
      id: "ORD_2024_154",
      userId: "user_321",
      customerName: "Fatima Abubakar",
      customerEmail: "fatima@example.com",
      customerPhone: "+234 803 456 7890",
      items: [
        {
          productId: "palm_oil_001",
          quantity: 2,
          product: {
            id: "palm_oil_001",
            name: "Palm Oil",
            pricePerKg: 2500,
            images: ["/palm-oil-bottle.jpg"],
            category: "Oil & Condiments",
          },
        },
      ],
      status: "out_for_delivery",
      totalAmount: 5250,
      deliveryDate: "2024-01-27T16:00:00Z",
      deliveryPoint: "Surulere Pickup Point",
      deliveryType: "pickup",
      createdAt: "2024-01-24T16:45:00Z",
      paymentStatus: "paid",
      paymentMethod: "Paystack",
      location: "Surulere",
    },
    {
      id: "ORD_2024_153",
      userId: "user_654",
      customerName: "David Okafor",
      customerEmail: "david@example.com",
      customerPhone: "+234 804 567 8901",
      items: [
        {
          productId: "garri_001",
          quantity: 4,
          product: {
            id: "garri_001",
            name: "Yellow Garri",
            pricePerKg: 600,
            images: ["/yellow-garri.jpg"],
            category: "Staple Food",
          },
        },
      ],
      status: "delivered",
      totalAmount: 2520,
      deliveryDate: "2024-01-26T12:00:00Z",
      deliveryPoint: "Victoria Island Office",
      deliveryType: "pickup",
      createdAt: "2024-01-23T09:30:00Z",
      paymentStatus: "paid",
      paymentMethod: "Paystack",
      location: "Victoria Island",
    },
    {
      id: "ORD_2024_152",
      userId: "user_987",
      customerName: "Grace Adebayo",
      customerEmail: "grace@example.com",
      customerPhone: "+234 805 678 9012",
      items: [
        {
          productId: "groundnut_oil_001",
          quantity: 1,
          product: {
            id: "groundnut_oil_001",
            name: "Groundnut Oil",
            pricePerKg: 3200,
            images: ["/groundnut-oil-bottle.jpg"],
            category: "Oil & Condiments",
          },
        },
      ],
      status: "delivered",
      totalAmount: 3360,
      deliveryDate: "2024-01-25T15:00:00Z",
      deliveryPoint: "Home Delivery",
      deliveryType: "home",
      createdAt: "2024-01-22T13:20:00Z",
      paymentStatus: "paid",
      paymentMethod: "Paystack",
      location: "Lekki",
    },
  ],
  lowStockAlerts: [
    {
      productId: "tomatoes_001",
      productName: "Fresh Tomatoes",
      currentStock: 5,
      minimumStock: 20,
      location: "Yaba",
      category: "Soup Ingredients",
    },
    {
      productId: "pepper_001",
      productName: "Fresh Pepper",
      currentStock: 8,
      minimumStock: 15,
      location: "Ikeja",
      category: "Soup Ingredients",
    },
    {
      productId: "yam_001",
      productName: "Yam Tubers",
      currentStock: 3,
      minimumStock: 10,
      location: "Surulere",
      category: "Staple Food",
    },
  ],
  systemStatus: {
    database: "healthy",
    paymentGateway: "healthy",
    deliverySystem: "warning",
    notifications: "healthy",
  },
}

export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    return NextResponse.json({
      success: true,
      data: mockDashboardStats,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch dashboard statistics" }, { status: 500 })
  }
}
