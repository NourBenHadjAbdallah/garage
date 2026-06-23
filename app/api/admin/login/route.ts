import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_SESSION_COOKIE, createSessionToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const { username, password } = await request.json().catch(() => ({}))

  const expectedUsername = process.env.ADMIN_USERNAME
  const expectedPassword = process.env.ADMIN_PASSWORD
  const sessionSecret = process.env.ADMIN_SESSION_SECRET

  if (!expectedUsername || !expectedPassword || !sessionSecret) {
    return NextResponse.json(
      {
        error:
          'Admin login is not configured. Set ADMIN_USERNAME, ADMIN_PASSWORD and ADMIN_SESSION_SECRET in .env.local.',
      },
      { status: 500 },
    )
  }

  const validUsername = typeof username === 'string' && username === expectedUsername
  const validPassword = typeof password === 'string' && password === expectedPassword

  if (!validUsername || !validPassword) {
    return NextResponse.json(
      { error: "Nom d'utilisateur ou mot de passe incorrect." },
      { status: 401 },
    )
  }

  const token = await createSessionToken(expectedUsername)

  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days, matches the JWT expiry in lib/auth.ts
  })
  return response
}