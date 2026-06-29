// app/api/orders/[id]/route.ts
import { NextResponse } from 'next/server'
import { updateOrderStatusInDB } from '@/lib/db-orders'
import { verifySessionToken, ADMIN_SESSION_COOKIE } from '@/lib/auth'
import type { NextRequest } from 'next/server'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  const session = await verifySessionToken(token)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { status } = await request.json()
  const ok = await updateOrderStatusInDB(id, status)
  if (!ok) return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  return NextResponse.json({ ok: true })
}