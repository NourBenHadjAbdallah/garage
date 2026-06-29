// app/about/page.tsx
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'About — Apex Posters',
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="border-b border-border bg-muted/20 px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Our Story</p>
        <h1 className="mt-2 font-heading text-5xl font-bold uppercase tracking-tight sm:text-6xl">About Apex</h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Born from a passion for automotive culture and a love for great design. We bring the world's most iconic cars to your walls.
        </p>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-10">
            <div>
              <h2 className="font-heading text-2xl font-bold uppercase tracking-tight">Who We Are</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Apex Posters is a Tunisian brand dedicated to bringing premium automotive art to car enthusiasts across the country. Every print in our collection is carefully curated to capture the spirit, speed, and soul of automotive culture.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                From the raw power of a Ferrari F40 to the elegance of a Rolls-Royce, each piece tells a story worth putting on your wall.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold uppercase tracking-tight">What We Do</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                We source and produce museum-grade framed prints on 250gsm fine-art matte paper with UV-resistant inks. Every poster comes ready to hang in a slim matte-black wood frame — no assembly needed.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                We ship nationwide across Tunisia via Aramex, Runex, and Yalidine, with full tracking on every order.
              </p>
            </div>
          </div>

          {/* Values */}
          <div>
            <h2 className="font-heading text-2xl font-bold uppercase tracking-tight mb-6">Our Values</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: '🎨', title: 'Quality First',  desc: 'We never compromise on print quality. Every piece goes through strict quality control before shipping.' },
                { icon: '🚗', title: 'Passion Driven', desc: 'We are car enthusiasts first. Every print is selected because we would want it on our own walls.' },
                { icon: '🤝', title: 'Customer Focus', desc: 'From browsing to delivery, we make the experience as smooth and satisfying as possible.' },
              ].map(v => (
                <div key={v.title} className="rounded-2xl border border-border p-6">
                  <span className="text-2xl">{v.icon}</span>
                  <h3 className="mt-3 font-heading text-sm font-bold uppercase tracking-wide">{v.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="rounded-2xl border border-border bg-muted/20 p-8">
            <div className="grid grid-cols-3 gap-6 text-center">
              {[
                { value: '50+',  label: 'Prints'     },
                { value: '4.9★', label: 'Rating'     },
                { value: '48h',  label: 'Delivery'   },
              ].map(s => (
                <div key={s.label}>
                  <p className="font-heading text-3xl font-bold">{s.value}</p>
                  <p className="mt-1 font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-muted/20 px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-bold uppercase tracking-tight">Ready to Upgrade Your Space?</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">Browse our full collection and find the perfect print for your wall.</p>
        <Link href="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-3.5 font-heading text-sm font-bold uppercase tracking-widest text-background transition-all hover:opacity-90">
          Shop the Collection <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <SiteFooter />
    </div>
  )
}