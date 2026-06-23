'use client'

import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/components/cart/cart-provider'
import { getProduct, formatTND } from '@/lib/products'
import { SHIPPING_FEE } from '@/lib/orders'

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart()

  const detailed = items
    .map((item) => {
      const product = getProduct(item.id)
      return product ? { ...item, product } : null
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)

  const shipping = subtotal > 0 ? SHIPPING_FEE : 0
  const total = subtotal + shipping

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl font-bold uppercase tracking-tight sm:text-4xl">
          Your Cart
        </h1>

        {detailed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">Your cart is empty</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Find a poster that speaks to you.
            </p>
            <Button asChild className="mt-6 font-heading uppercase tracking-widest">
              <Link href="/shop">Browse the collection</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
            <ul className="divide-y divide-border border-y border-border">
              {detailed.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-4 py-5">
                  <Link
                    href={`/product/${product.id}`}
                    className="shrink-0 overflow-hidden rounded-xl bg-muted"
                  >
                    <img
                      src={product.image || '/placeholder.svg'}
                      alt={product.name}
                      className="h-28 w-24 object-cover"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/product/${product.id}`}
                          className="font-heading font-semibold uppercase tracking-wide hover:underline"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">
                          {product.subtitle}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                        aria-label={`Remove ${product.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-md border border-border">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(product.id, quantity - 1)
                          }
                          className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-7 text-center text-sm font-medium">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(product.id, quantity + 1)
                          }
                          className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="font-medium">
                        {formatTND(product.price * quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-2xl border border-border p-6">
              <h2 className="font-heading text-lg font-semibold uppercase tracking-wide">
                Summary
              </h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatTND(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Livraison</span>
                  <span>{formatTND(shipping)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{formatTND(total)}</span>
                </div>
              </div>

              <Button
                asChild
                size="lg"
                className="mt-6 w-full font-heading uppercase tracking-widest"
              >
                <Link href="/checkout">Checkout</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="mt-2 w-full font-heading uppercase tracking-widest"
              >
                <Link href="/shop">Continue shopping</Link>
              </Button>
            </aside>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
