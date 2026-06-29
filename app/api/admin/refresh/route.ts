// app/api/admin/refresh/route.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_REFRESH_COOKIE, verifyRefreshToken, createAccessToken, createRefreshToken, setAuthCookies } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(ADMIN_REFRESH_COOKIE)?.value
  const payload = await verifyRefreshToken(refreshToken)

  if (!payload || typeof payload.username !== 'string') {
    return NextResponse.json({ error: 'Invalid or expired refresh token.' }, { status: 401 })
  }

  try {
    const newAccess  = await createAccessToken(payload.username)
    const newRefresh = await createRefreshToken(payload.username)

    const response = NextResponse.json({ ok: true })
    setAuthCookies(response, newAccess, newRefresh)
    return response
  } catch {
    return NextResponse.json({ error: 'Failed to refresh session.' }, { status: 500 })
  }
}