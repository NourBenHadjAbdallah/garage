import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ProductCard } from '@/components/product-card'
import { products, CATEGORY_LABELS, type Category } from '@/lib/products'

const categoryKeys = Object.keys(CATEGORY_LABELS) as Category[]

export function generateStaticParams() {
  return categoryKeys.map((category) => ({ category }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const label = CATEGORY_LABELS[category as Category]
  return { title: label ? `${label} — APEX Posters` : 'APEX Posters' }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  if (!categoryKeys.includes(category as Category)) notFound()

  const cat = category as Category
  const list = products.filter((p) => p.category === cat)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <header className="text-center">
          <h1 className="font-heading text-4xl font-bold uppercase tracking-tight sm:text-5xl">
            {CATEGORY_LABELS[cat]}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {list.length} {list.length === 1 ? 'print' : 'prints'} in this
            collection.
          </p>
        </header>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/shop"
            className="rounded-full border border-border px-5 py-2 font-heading text-sm font-medium uppercase tracking-widest transition-colors hover:bg-foreground hover:text-background"
          >
            All
          </Link>
          {categoryKeys.map((c) => (
            <Link
              key={c}
              href={`/category/${c}`}
              className={
                c === cat
                  ? 'rounded-full bg-foreground px-5 py-2 font-heading text-sm font-medium uppercase tracking-widest text-background'
                  : 'rounded-full border border-border px-5 py-2 font-heading text-sm font-medium uppercase tracking-widest transition-colors hover:bg-foreground hover:text-background'
              }
            >
              {CATEGORY_LABELS[c]}
            </Link>
          ))}
        </div>

        {list.length > 0 ? (
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {list.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-muted-foreground">
            No prints in this category yet. Check back soon.
          </p>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
