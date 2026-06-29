'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useCart } from '@/components/cart/cart-provider'
import { discountPercent, formatTND, CATEGORY_LABELS, type Product } from '@/lib/products'
import { toast } from 'sonner'

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const discount = discountPercent(product)

  return (
    <article className="group flex flex-col">

      {/* Image */}
      <Link
        href={`/product/${product.id}`}
        className="relative block overflow-hidden rounded-2xl bg-[#EDEAE5]"
      >
        {discount > 0 && (
          <span className="absolute left-3 top-3 z-10 rounded-md bg-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-background">
            -{discount}%
          </span>
        )}

        <img
          src={product.image || '/placeholder.svg'}
          alt={`${product.name} framed poster`}
          className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />

        {/* Hover scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Quick-add */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            addItem(product.id)
            toast.success(`${product.name} added to cart`)
          }}
          aria-label={`Add ${product.name} to cart`}
          className="absolute bottom-3 right-3 z-10 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-[#F7F6F3]/90 text-foreground opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-foreground hover:text-background group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </Link>

      {/* Meta */}
      <div className="mt-3.5 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link
            href={`/product/${product.id}`}
            className="block truncate text-sm font-medium text-foreground hover:underline"
          >
            {product.name}
          </Link>
          <p className="mt-0.5 text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
            {CATEGORY_LABELS[product.category]}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-semibold">{formatTND(product.price)}</p>
          {product.originalPrice && (
            <p className="text-[11px] text-muted-foreground line-through">
              {formatTND(product.originalPrice)}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}