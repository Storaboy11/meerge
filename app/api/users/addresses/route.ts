
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:5000"
    const res = await fetch(`${apiBaseUrl}/api/users/locations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("User locations proxy error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:5000"
    const res = await fetch(`${apiBaseUrl}/api/users/select-location`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("User select location proxy error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
