import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:5000"
    const res = await fetch(`${apiBaseUrl}/api/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Product list proxy error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
