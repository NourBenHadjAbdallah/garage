import Link from 'next/link'
import { Truck, ShieldCheck, Frame } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ProductCard } from '@/components/product-card'
import { products, CATEGORY_LABELS, type Category } from '@/lib/products'

export default function HomePage() {
  const trending = products.filter((p) => p.trending)
  const categories = Object.keys(CATEGORY_LABELS) as Category[]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <img
            src="/posters/hero-collage.png"
            alt="Collage of premium automotive posters"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/55" />
          <div className="relative mx-auto flex min-h-[520px] max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
            <p className="font-heading text-xs font-medium uppercase tracking-[0.4em] text-background/80">
              Upgrade Your Walls
            </p>
            <h1 className="mt-4 max-w-3xl text-balance font-heading text-5xl font-bold uppercase leading-[0.95] tracking-tight text-background sm:text-6xl lg:text-7xl">
              Premium Quality Posters.
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-background/85 sm:text-base">
              Museum-grade framed prints celebrating the icons of automotive
              culture. Delivered anywhere in Tunisia.
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-flex items-center justify-center rounded-md bg-background px-10 py-3.5 font-heading text-sm font-semibold uppercase tracking-widest text-foreground transition-transform hover:scale-[1.03]"
            >
              New Drop
            </Link>
          </div>
        </section>

        {/* Trust bar */}
        <section className="border-b border-border">
          <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              { icon: Frame, title: 'Framed & Ready', desc: 'Slim matte-black frames included' },
              { icon: Truck, title: 'Livraison Tunisie', desc: 'Aramex · Runex · Yalidine' },
              { icon: ShieldCheck, title: 'Paiement Local', desc: 'D17 · Flouci · Virement · COD' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3 px-4 py-5 sm:justify-center">
                <item.icon className="h-6 w-6 shrink-0" />
                <div>
                  <p className="font-heading text-sm font-semibold uppercase tracking-wide">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Category strip */}
        <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
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
        </section>

        {/* Trending */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-heading text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                Trending
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Our most-wanted prints this week.
              </p>
            </div>
            <Link
              href="/shop"
              className="hidden font-heading text-sm font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground sm:block"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {trending.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
