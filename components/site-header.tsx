// components/site-header.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '@/components/cart/cart-provider'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/',        label: 'Home'       },
  { href: '/shop',    label: 'Collection' },
  { href: '/about',   label: 'About'      },
  { href: '/contact', label: 'Contact'    },
]

export function SiteHeader() {
  const { count }           = useCart()
  const pathname            = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const isHome              = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  const transparent = isHome && !scrolled && !open

  return (
    <>
      <header className={cn(
        'fixed top-0 z-50 w-full transition-all duration-500',
        transparent
          ? 'bg-transparent'
          : 'border-b border-border bg-background/95 backdrop-blur-md'
      )}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link href="/" aria-label="Apex Posters — home">
            <img
              src="/logo.png"
              alt="Apex Posters"
              width={120}
              height={32}

            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-10 md:flex">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className={cn(
                  'relative font-heading text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:transition-all after:duration-300 hover:after:w-full',
                  transparent
                    ? 'text-white/70 hover:text-white after:bg-white'
                    : 'text-muted-foreground hover:text-foreground after:bg-foreground',
                  pathname === link.href && (transparent ? 'text-white after:w-full' : 'text-foreground after:w-full')
                )}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-1">
            <Link href="/cart" aria-label={`Cart ${count} items`}
              className={cn(
                'relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300',
                transparent ? 'text-white hover:bg-white/10' : 'text-foreground hover:bg-muted'
              )}>
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.75} />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[9px] font-bold text-background">
                  {count}
                </span>
              )}
            </Link>

            {/* Mobile toggle */}
            <button onClick={() => setOpen(o => !o)} aria-label="Menu"
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 md:hidden',
                transparent ? 'text-white hover:bg-white/10' : 'text-foreground hover:bg-muted'
              )}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      <div className={cn(
        'fixed inset-0 z-40 flex flex-col bg-background transition-all duration-300 ease-in-out md:hidden',
        open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
      )}>
        <div className="h-16 shrink-0" />
        <nav className="flex flex-1 flex-col items-center justify-center gap-10">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href}
              className={cn(
                'font-heading text-4xl font-bold uppercase tracking-widest transition-colors',
                pathname === link.href ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}>
              {link.label}
            </Link>
          ))}
          <Link href="/cart"
            className="mt-2 flex items-center gap-2.5 font-heading text-base font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground">
            <ShoppingBag className="h-5 w-5" />
            Cart {count > 0 && `(${count})`}
          </Link>
        </nav>
        <p className="p-8 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Apex Posters</p>
      </div>

      {/* Push content down on non-home pages */}
      {!isHome && <div className="h-16" />}
    </>
  )
}