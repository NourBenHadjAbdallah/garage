'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/components/cart/cart-provider'
import { CATEGORY_LABELS } from '@/lib/products'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/category/luxury', label: CATEGORY_LABELS.luxury },
  { href: '/category/sports', label: CATEGORY_LABELS.sports },
  { href: '/category/jdm', label: CATEGORY_LABELS.jdm },
  { href: '/category/f1', label: CATEGORY_LABELS.f1 },
  { href: '/shop', label: 'All' },
]

export function SiteHeader() {
  const { count } = useCart()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-heading text-2xl font-bold uppercase tracking-[0.2em] text-foreground"
        >
          Apex
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Categories">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'font-heading text-sm font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground',
                pathname === link.href && 'text-foreground',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/cart"
          className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-muted"
          aria-label={`Cart, ${count} items`}
        >
          <ShoppingBag className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[11px] font-semibold text-background">
              {count}
            </span>
          )}
        </Link>
      </div>

      <nav
        className="flex items-center justify-center gap-5 overflow-x-auto border-t border-border px-4 py-2.5 md:hidden"
        aria-label="Categories mobile"
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap font-heading text-xs font-medium uppercase tracking-widest text-muted-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
