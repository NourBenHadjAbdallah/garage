import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_SESSION_COOKIE, ADMIN_REFRESH_COOKIE, verifySessionToken, verifyRefreshToken, createAccessToken, createRefreshToken, setAuthCookies } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always allow login page and API routes
  if (pathname === '/admin/login' || pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  const accessToken  = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  const refreshToken = request.cookies.get(ADMIN_REFRESH_COOKIE)?.value

  // 1. Valid access token → allow through
  const session = await verifySessionToken(accessToken)
  if (session) {
    return NextResponse.next()
  }

  // 2. Access token expired — try refresh token
  const refreshPayload = await verifyRefreshToken(refreshToken)
  if (refreshPayload && typeof refreshPayload.username === 'string') {
    // Issue new tokens transparently
    const newAccess  = await createAccessToken(refreshPayload.username)
    const newRefresh = await createRefreshToken(refreshPayload.username)

    const response = NextResponse.next()
    setAuthCookies(response, newAccess, newRefresh)
    return response
  }

  // 3. Both expired → redirect to login
  const loginUrl = new URL('/admin/login', request.url)
  loginUrl.searchParams.set('from', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}