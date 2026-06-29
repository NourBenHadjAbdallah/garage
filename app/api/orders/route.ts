// app/api/orders/route.ts
import { NextResponse } from 'next/server'
import { getOrdersFromDB, saveOrderToDB } from '@/lib/db-orders'
import { verifySessionToken, ADMIN_SESSION_COOKIE } from '@/lib/auth'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  const session = await verifySessionToken(token)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const orders = await getOrdersFromDB()
  return NextResponse.json(orders)
}

export async function POST(request: NextRequest) {
  const order = await request.json()
  const ok = await saveOrderToDB(order)
  if (!ok) return NextResponse.json({ error: 'Failed to save order' }, { status: 500 })
  return NextResponse.json({ ok: true })
}