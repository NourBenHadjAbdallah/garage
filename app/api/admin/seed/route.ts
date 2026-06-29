// app/api/admin/seed/route.ts
// Call POST /api/admin/seed once to push static products into Supabase
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySessionToken, ADMIN_SESSION_COOKIE } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { products } from '@/lib/products'

export async function POST(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  const session = await verifySessionToken(token)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = products.map(p => ({
    id:             p.id,
    name:           p.name,
    subtitle:       p.subtitle,
    category:       p.category,
    price:          p.price,
    original_price: p.originalPrice ?? null,
    image:          p.image,
    description:    p.description,
    trending:       p.trending ?? false,
  }))

  // upsert so running twice is safe
  const { error } = await supabase
    .from('products')
    .upsert(rows, { onConflict: 'id' })

  if (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, seeded: rows.length })
}