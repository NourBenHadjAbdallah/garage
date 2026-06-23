'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useCart } from '@/components/cart/cart-provider'
import {
  discountPercent,
  formatTND,
  CATEGORY_LABELS,
  type Product,
} from '@/lib/products'
import { toast } from 'sonner'

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const discount = discountPercent(product)

  return (
    <div className="group flex flex-col">
      <Link
        href={`/product/${product.id}`}
        className="relative block overflow-hidden rounded-2xl bg-muted"
      >
        {discount > 0 && (
          <span className="absolute right-3 top-3 z-10 rounded-md bg-foreground px-2 py-1 text-xs font-semibold text-background">
            -{discount}%
          </span>
        )}
        <img
          src={product.image || '/placeholder.svg'}
          alt={`${product.name} framed poster`}
          className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            addItem(product.id)
            toast.success(`${product.name} added to cart`)
          }}
          aria-label={`Add ${product.name} to cart`}
          className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-background text-foreground opacity-0 shadow-md transition-all duration-300 hover:bg-foreground hover:text-background group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Plus className="h-5 w-5" />
        </button>
      </Link>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <Link
            href={`/product/${product.id}`}
            className="font-heading text-base font-semibold uppercase tracking-wide hover:underline"
          >
            {product.name}
          </Link>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {CATEGORY_LABELS[product.category]}
          </p>
        </div>
        <div className="text-right">
          <p className="font-medium">{formatTND(product.price)}</p>
          {product.originalPrice && (
            <p className="text-xs text-muted-foreground line-through">
              {formatTND(product.originalPrice)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
