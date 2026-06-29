// hooks/use-product.ts
'use client'

import { useEffect, useState } from 'react'
import { getProduct as getStaticProduct, type Product } from '@/lib/products'

export function useProduct(id: string): Product | null | undefined {
  const [product, setProduct] = useState<Product | null | undefined>(undefined)

  useEffect(() => {
    // Check static first (instant)
    const staticMatch = getStaticProduct(id)
    if (staticMatch) { setProduct(staticMatch); return }

    // Fetch from DB
    fetch(`/api/products`)
      .then(r => r.json())
      .then((data: Product[]) => {
        const found = data.find(p => p.id === id)
        setProduct(found ?? null)
      })
      .catch(() => setProduct(null))
  }, [id])

  return product
}