// components/cart/cart-provider.tsx
'use client'

import {
  createContext, useContext, useEffect, useMemo, useState, type ReactNode,
} from 'react'
import { getProduct, type Product } from '@/lib/products'

export type CartItem = { id: string; quantity: number }

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number
  addItem: (id: string, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'apex-cart-v1'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems]       = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [dbProducts, setDbProducts] = useState<Product[]>([])

  // Load cart from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch { }
    setHydrated(true)
  }, [])

  // Fetch all products from DB for price calculation
  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => setDbProducts(data))
      .catch(() => {})
  }, [])

  // Save cart to localStorage
  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

  function findProduct(id: string): Product | undefined {
    // Check DB products first, then static
    return dbProducts.find(p => p.id === id) || getProduct(id)
  }

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, item) => {
      const product = findProduct(item.id)
      return sum + (product ? product.price * item.quantity : 0)
    }, 0)
    const count = items.reduce((sum, item) => sum + item.quantity, 0)

    return {
      items, count, subtotal,
      addItem: (id, quantity = 1) =>
        setItems(prev => {
          const existing = prev.find(i => i.id === id)
          if (existing) return prev.map(i => i.id === id ? { ...i, quantity: i.quantity + quantity } : i)
          return [...prev, { id, quantity }]
        }),
      removeItem: (id) => setItems(prev => prev.filter(i => i.id !== id)),
      updateQuantity: (id, quantity) =>
        setItems(prev => quantity <= 0
          ? prev.filter(i => i.id !== id)
          : prev.map(i => i.id === id ? { ...i, quantity } : i)),
      clear: () => setItems([]),
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, dbProducts])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}