import Link from 'next/link'
import { CATEGORY_LABELS } from '@/lib/products'
import logo from '../public/logo.png'

const PAYMENT_METHODS = ['D17 / Sobflous', 'Flouci', 'Virement bancaire', 'Paiement à la livraison']

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-[#F7F6F3]">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">

        {/* Top grid */}
        <div className="grid gap-12 md:grid-cols-4">

          {/* Brand */}
          <div className="md:col-span-2">
            <img src={logo.src} alt="Drive Frame" width={156} height={30} className="block" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Premium framed automotive posters. Museum-grade prints delivered anywhere in Tunisia via Aramex, Runex and Yalidine.
            </p>
          </div>

          {/* Shop */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground">
              Shop
            </p>
            <ul className="mt-4 space-y-2.5">
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <li key={key}>
                  <Link
                    href={`/category/${key}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground">
              Paiement
            </p>
            <ul className="mt-4 space-y-2.5">
              {PAYMENT_METHODS.map((m) => (
                <li key={m} className="text-sm text-muted-foreground">{m}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Drive Frame. Tous droits réservés.</p>
          <Link href="/admin" className="transition-colors hover:text-foreground">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}