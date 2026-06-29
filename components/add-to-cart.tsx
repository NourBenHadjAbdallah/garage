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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">

      {/* Stepper */}
      <div className="flex h-12 items-center overflow-hidden rounded-xl border border-border bg-[#EDEAE5]/60">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={qty <= 1}
          aria-label="Decrease quantity"
          className="flex h-full w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
        >
          <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
        <span aria-live="polite" className="w-8 select-none text-center text-sm font-semibold tabular-nums">
          {qty}
        </span>
        <button
          type="button"
          onClick={() => setQty((q) => q + 1)}
          aria-label="Increase quantity"
          className="flex h-full w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      </div>

      {/* CTA */}
      <Button
        size="lg"
        className="h-12 flex-1 rounded-xl text-xs font-bold uppercase tracking-[0.15em] transition-transform active:scale-[0.98]"
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