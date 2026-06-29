// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server'
import { updateProduct, deleteProduct } from '@/lib/db-products'
import { verifySessionToken, ADMIN_SESSION_COOKIE } from '@/lib/auth'
import type { NextRequest } from 'next/server'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  const session = await verifySessionToken(token)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const product = await updateProduct(id, body)
  if (!product) return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  return NextResponse.json(product)
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  const session = await verifySessionToken(token)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const ok = await deleteProduct(id)
  if (!ok) return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  return NextResponse.json({ ok: true })
}