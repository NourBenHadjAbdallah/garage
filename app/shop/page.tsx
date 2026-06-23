import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ProductCard } from '@/components/product-card'
import { products, CATEGORY_LABELS, type Category } from '@/lib/products'

export const metadata = {
  title: 'Shop All — APEX Posters',
}

export default function ShopPage() {
  const categories = Object.keys(CATEGORY_LABELS) as Category[]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <header className="text-center">
          <h1 className="font-heading text-4xl font-bold uppercase tracking-tight sm:text-5xl">
            The Collection
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {products.length} premium framed automotive prints.
          </p>
        </header>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-full bg-foreground px-5 py-2 font-heading text-sm font-medium uppercase tracking-widest text-background">
            All
          </span>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/category/${cat}`}
              className="rounded-full border border-border px-5 py-2 font-heading text-sm font-medium uppercase tracking-widest transition-colors hover:bg-foreground hover:text-background"
            >
              {CATEGORY_LABELS[cat]}
            </Link>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
