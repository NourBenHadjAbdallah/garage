import { SignJWT, jwtVerify } from 'jose'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const ADMIN_SESSION_COOKIE = 'admin_session'
export const ADMIN_REFRESH_COOKIE = 'admin_refresh'

const encoder = new TextEncoder()

function getSecretKey() {
  const secret = process.env.ADMIN_SESSION_SECRET || 'fallback-dev-secret-change-in-production-32chars'
  return encoder.encode(secret)
}

// Access token — 30 minutes
export async function createAccessToken(username: string) {
  return await new SignJWT({ username, type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30m')
    .sign(getSecretKey())
}

// Refresh token — 7 days
export async function createRefreshToken(username: string) {
  return await new SignJWT({ username, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecretKey())
}

// Legacy - kept for compatibility
export async function createSessionToken(username: string) {
  return createAccessToken(username)
}

export async function verifySessionToken(token: string | undefined | null) {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    return payload
  } catch {
    return null
  }
}

export async function verifyRefreshToken(token: string | undefined | null) {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    if (payload.type !== 'refresh') return null
    return payload
  } catch {
    return null
  }
}

// Sets both cookies on a response
export function setAuthCookies(response: NextResponse, accessToken: string, refreshToken: string) {
  const secure = process.env.NODE_ENV === 'production'

  response.cookies.set(ADMIN_SESSION_COOKIE, accessToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 30, // 30 minutes
  })

  response.cookies.set(ADMIN_REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export function clearAuthCookies(response: NextResponse) {
  const opts = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/', maxAge: 0 }
  response.cookies.set(ADMIN_SESSION_COOKIE, '', opts)
  response.cookies.set(ADMIN_REFRESH_COOKIE, '', opts)
}