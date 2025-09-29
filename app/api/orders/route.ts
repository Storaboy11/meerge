export async function GET(request: NextRequest) {
  try {
    const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:5000"
    const res = await fetch(`${apiBaseUrl}/api/orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(request.headers.get("authorization") ? { "Authorization": request.headers.get("authorization") } : {}),
      } as HeadersInit,
      credentials: "include",
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Order list proxy error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:5000"
    const res = await fetch(`${apiBaseUrl}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(request.headers.get("authorization") ? { "Authorization": request.headers.get("authorization") } : {}),
      } as HeadersInit,
      body: JSON.stringify(body),
      credentials: "include",
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Order creation proxy error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
