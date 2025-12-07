import { type NextRequest, NextResponse } from "next/server"

// Simulated database - in production use real database
const users: Map<string, any> = new Map()

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    let user = users.get(email)

    // Auto-register on first login
    if (!user) {
      user = {
        id: crypto.randomUUID(),
        email,
        password,
        name: email.split("@")[0],
        role: role || "employee",
      }
      users.set(email, user)
    }

    // Verify password
    if (user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create token
    const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email, role: user.role })).toString("base64")

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    })
  } catch (error) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
