import { SignJWT, jwtVerify } from 'jose'

export const ADMIN_SESSION_COOKIE = 'admin_session'

const encoder = new TextEncoder()

function getSecretKey() {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET is not set')
  }
  return encoder.encode(secret)
}

export async function createSessionToken(username: string) {
  return await new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecretKey())
}

/** Returns the token payload if valid, otherwise null. Never throws. */
export async function verifySessionToken(token: string | undefined | null) {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    return payload
  } catch {
    return null
  }
}