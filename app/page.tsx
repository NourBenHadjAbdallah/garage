// app/page.tsx
'use client'

import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ProductCard } from '@/components/product-card'
import { CATEGORY_LABELS, type Category } from '@/lib/products'
import { useAllProducts, useAllTrending } from '@/hooks/use-all-products'

const MARQUEE_ITEMS = ['Porsche', 'Ferrari', 'Lamborghini', 'McLaren', 'Bugatti', 'Formula 1', 'JDM', 'Rolls-Royce', 'Aston Martin', 'BMW M']

export default function HomePage() {
  const trending    = useAllTrending()
  const allProducts = useAllProducts()
  const categories  = Object.keys(CATEGORY_LABELS) as Category[]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">

        {/* ── HERO ── */}
        <section className="relative min-h-screen flex flex-col justify-end px-4 pb-20 sm:px-6 lg:px-8 overflow-hidden">

          {/* Background image */}
          <div className="absolute inset-0">
            <img
              src="/posters/hero-collage.png"
              alt=""
              className="h-full w-full object-cover object-center"
            />
            {/* Dark overlay gradient */}
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)' }} />
          </div>

          {/* Content */}
          <div className="relative z-10 mx-auto w-full max-w-7xl">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                New Collection Available
              </div>

              <h1 className="font-heading text-[clamp(2.8rem,7vw,6.5rem)] font-bold uppercase leading-[0.88] tracking-tight text-white">
                Art for the<br />
                Car Obsessed
              </h1>

              <p className="mt-6 max-w-lg text-base leading-relaxed text-white/60">
                Museum-grade framed prints. Every icon of automotive culture, from Le Mans legends to Tokyo street kings — ready to transform your space.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link href="/shop"
                  className="group flex items-center gap-2.5 rounded-full bg-white px-8 py-4 font-heading text-sm font-bold uppercase tracking-widest text-black transition-all hover:bg-white/90">
                  Shop Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/about"
                  className="flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-widest text-white/60 transition-colors hover:text-white">
                  Our Story <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-16 flex flex-wrap gap-8 border-t border-white/10 pt-8">
              {[
                { value: '50+',  label: 'Prints'          },
                { value: '4.9',  label: 'Avg Rating'      },
                { value: '48h',  label: 'Tunisia Delivery' },
                { value: '100%', label: 'Framed & Ready'  },
              ].map(s => (
                <div key={s.label}>
                  <p className="font-heading text-2xl font-bold text-white">{s.value}</p>
                  <p className="mt-0.5 text-xs uppercase tracking-widest text-white/40">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 right-8 hidden flex-col items-center gap-2 md:flex">
            <div className="h-10 w-px bg-white/20" />
            <p className="rotate-90 font-heading text-[10px] uppercase tracking-[0.3em] text-white/30">Scroll</p>
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <div className="overflow-hidden border-y border-border bg-muted/30 py-4">
          <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="mx-10 font-heading text-xs font-bold uppercase tracking-[0.35em] text-muted-foreground">
                {item} <span className="mx-6 opacity-30">·</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── INTRO STRIP ── */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="font-heading text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Who we are</p>
              <h2 className="mt-3 font-heading text-4xl font-bold uppercase leading-tight tracking-tight sm:text-5xl">
                Precision Prints<br />for Petrolheads
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                Apex Posters was built by car enthusiasts, for car enthusiasts. We obsess over every detail — the paper weight, the ink density, the frame finish — so you don't have to.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Each print ships in a slim matte-black frame, ready to hang the moment it arrives. No hardware needed, no guesswork.
              </p>
              <Link href="/about"
                className="group mt-8 inline-flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-widest text-foreground transition-all">
                Learn More
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Feature list */}
            <div className="space-y-3">
              {[
                { num: '01', title: 'Fine-Art Paper',    desc: '250gsm matte with UV-resistant inks. Vivid colors for decades.' },
                { num: '02', title: 'Frame Included',    desc: 'Slim matte-black wood frame. Hang it the day it arrives.'       },
                { num: '03', title: 'Local Payment',     desc: 'D17, Flouci, bank transfer, or cash on delivery.'               },
                { num: '04', title: 'Tracked Shipping',  desc: 'Aramex, Runex or Yalidine — nationwide across Tunisia.'        },
              ].map(f => (
                <div key={f.num} className="flex gap-5 rounded-2xl border border-border p-5 transition-colors hover:bg-muted/30">
                  <span className="font-heading text-xs font-bold text-muted-foreground/40 mt-0.5">{f.num}</span>
                  <div>
                    <p className="font-heading text-sm font-bold uppercase tracking-wide">{f.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CATEGORIES BENTO ── */}
        <section className="border-t border-border py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="font-heading text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Explore</p>
                <h2 className="mt-1 font-heading text-4xl font-bold uppercase tracking-tight">Collections</h2>
              </div>
              <Link href="/shop"
                className="hidden items-center gap-2 font-heading text-sm font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground sm:flex">
                All prints <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Bento grid */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {categories.map((cat, i) => {
                const count = allProducts.filter(p => p.category === cat).length
                const sizes = ['lg:col-span-2 lg:row-span-2', '', '', 'lg:col-span-2']
                return (
                  <Link key={cat} href={`/category/${cat}`}
                    className={`group relative overflow-hidden rounded-2xl border border-border bg-muted/20 p-6 transition-all duration-300 hover:border-foreground/20 hover:bg-muted/40 hover:shadow-sm ${sizes[i]}`}
                    style={{ minHeight: i === 0 ? 240 : 160 }}>
                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">{count} prints</p>
                      <p className="mt-1 font-heading text-2xl font-bold uppercase tracking-tight text-foreground">{CATEGORY_LABELS[cat]}</p>
                    </div>
                    <ArrowUpRight className="absolute right-5 top-5 h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── TRENDING ── */}
        <section className="border-t border-border py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="font-heading text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Most wanted</p>
                <h2 className="mt-1 font-heading text-4xl font-bold uppercase tracking-tight">Trending Now</h2>
              </div>
              <Link href="/shop"
                className="hidden items-center gap-2 font-heading text-sm font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground sm:flex">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {trending.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-8 flex justify-center sm:hidden">
              <Link href="/shop" className="flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="border-t border-border py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-border">
              {/* BG image */}
              <div className="absolute inset-0">
                <img src="/posters/hero-collage.png" alt="" className="h-full w-full object-cover opacity-20" />
                <div className="absolute inset-0 bg-background/60" />
              </div>
              <div className="relative z-10 flex flex-col items-center px-8 py-20 text-center lg:flex-row lg:justify-between lg:text-left">
                <div>
                  <p className="font-heading text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Limited drops</p>
                  <h2 className="mt-2 font-heading text-4xl font-bold uppercase tracking-tight sm:text-5xl">
                    Upgrade Your<br />Space Today
                  </h2>
                  <p className="mt-4 max-w-md text-sm text-muted-foreground">
                    Each print is produced in small batches. Once they're gone, they're gone.
                  </p>
                </div>
                <Link href="/shop"
                  className="mt-8 inline-flex shrink-0 items-center gap-2 rounded-full bg-foreground px-10 py-4 font-heading text-sm font-bold uppercase tracking-widest text-background transition-all hover:opacity-90 lg:mt-0">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── PAYMENT STRIP ── */}
        <div className="border-t border-border py-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-4 sm:px-6 lg:px-8">
            <p className="w-full text-center font-heading text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Accepted Payment Methods</p>
            {['D17 · Sobflous', 'Flouci', 'Virement bancaire', 'Paiement à la livraison'].map(m => (
              <div key={m} className="flex items-center gap-2 rounded-full border border-border px-5 py-2 text-xs font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {m}
              </div>
            ))}
          </div>
        </div>

      </main>

      <SiteFooter />

      <style jsx global>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}