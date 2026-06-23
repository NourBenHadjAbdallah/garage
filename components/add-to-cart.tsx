'use client'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { useCart } from '@/components/cart/cart-provider'
import { Button } from '@/components/ui/button'
import type { Product } from '@/lib/products'
import { toast } from 'sonner'

export function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex items-center justify-between rounded-md border border-border sm:w-32">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="flex h-12 w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="min-w-6 text-center font-medium" aria-live="polite">
          {qty}
        </span>
        <button
          type="button"
          onClick={() => setQty((q) => q + 1)}
          className="flex h-12 w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <Button
        size="lg"
        className="h-12 flex-1 font-heading text-sm font-semibold uppercase tracking-widest"
        onClick={() => {
          addItem(product.id, qty)
          toast.success(`${qty} × ${product.name} added to cart`)
        }}
      >
        Add to cart
      </Button>
    </div>
  )
}
