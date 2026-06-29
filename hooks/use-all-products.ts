// hooks/use-all-products.ts
'use client'

import { useEffect, useState } from 'react'
import { type Product } from '@/lib/products'

export function useAllProducts(): Product[] {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then((data: Product[]) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
  }, [])

  return products
}

export function useAllTrending(): Product[] {
  const all = useAllProducts()
  return all.filter(p => p.trending)
}