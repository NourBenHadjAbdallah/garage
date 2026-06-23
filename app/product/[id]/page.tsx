import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check, ChevronRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ProductCard } from '@/components/product-card'
import { AddToCart } from '@/components/add-to-cart'
import {
  products,
  getProduct,
  discountPercent,
  formatTND,
  CATEGORY_LABELS,
} from '@/lib/products'

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }))
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = getProduct(id)
  if (!product) notFound()

  const discount = discountPercent(product)
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <nav
          className="flex items-center gap-1 text-xs uppercase tracking-widest text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link
            href={`/category/${product.category}`}
            className="hover:text-foreground"
          >
            {CATEGORY_LABELS[product.category]}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl bg-muted">
            {discount > 0 && (
              <span className="absolute right-4 top-4 z-10 rounded-md bg-foreground px-2.5 py-1 text-sm font-semibold text-background">
                -{discount}%
              </span>
            )}
            <img
              src={product.image || '/placeholder.svg'}
              alt={`${product.name} framed poster`}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {CATEGORY_LABELS[product.category]}
            </p>
            <h1 className="mt-2 font-heading text-4xl font-bold uppercase tracking-tight sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-1 text-lg text-muted-foreground">
              {product.subtitle}
            </p>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-semibold">
                {formatTND(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatTND(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="mt-5 leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <ul className="mt-6 space-y-2 text-sm">
              {[
                '250gsm premium matte fine-art paper',
                'Slim matte-black wood frame included',
                'Ships protected anywhere in Tunisia',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <AddToCart product={product} />
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Paiement local : D17 · Flouci · Virement bancaire · Paiement à la
              livraison.
            </p>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-8 font-heading text-2xl font-bold uppercase tracking-tight">
              You may also like
            </h2>
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
