import { NextResponse } from "next/server"
import { fetchApi } from "@/lib/api"

export async function POST(req: Request) {
  try {
    const { fullName, email, phoneNumber, password } = await req.json()

    const data = await fetchApi("/auth/register", {
      method: "POST",
      body: JSON.stringify({ fullName, email, phoneNumber, password }),
    })

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error in signup:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}

