// app/api/products/route.ts
import { NextResponse } from 'next/server'
import { getAllProducts, createProduct } from '@/lib/db-products'
import { verifySessionToken, ADMIN_SESSION_COOKIE } from '@/lib/auth'
import type { NextRequest } from 'next/server'

export async function GET() {
  const products = await getAllProducts()
  return NextResponse.json(products)
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  const session = await verifySessionToken(token)
  if (!session) {
    console.error('POST /api/products — Unauthorized')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  console.log('Creating product:', body)
  const product = await createProduct(body)

  if (!product) {
    console.error('createProduct returned null — check Supabase RLS policies')
    return NextResponse.json(
      { error: 'Failed to create product. Check server logs and Supabase RLS policies.' },
      { status: 500 }
    )
  }

  console.log('Product created:', product)
  return NextResponse.json(product)
}