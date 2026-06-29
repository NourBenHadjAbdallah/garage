// app/api/admin/login/route.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createAccessToken, createRefreshToken, setAuthCookies } from '@/lib/auth'

export async function POST(request: NextRequest) {
  let body: { username?: string; password?: string } = {}

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { username, password } = body

  const expectedUsername = process.env.ADMIN_USERNAME || 'admin'
  const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123'

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password required.' }, { status: 400 })
  }

  if (username !== expectedUsername || password !== expectedPassword) {
    // Small delay to prevent brute force
    await new Promise(r => setTimeout(r, 500))
    return NextResponse.json({ error: "Nom d'utilisateur ou mot de passe incorrect." }, { status: 401 })
  }

  try {
    const accessToken = await createAccessToken(expectedUsername)
    const refreshToken = await createRefreshToken(expectedUsername)

    const response = NextResponse.json({ ok: true })
    setAuthCookies(response, accessToken, refreshToken)
    return response
  } catch (err) {
    console.error('Token creation failed:', err)
    return NextResponse.json({ error: 'Server error creating session.' }, { status: 500 })
  }
}