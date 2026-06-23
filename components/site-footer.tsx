import Link from 'next/link'
import { CATEGORY_LABELS } from '@/lib/products'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <span className="font-heading text-2xl font-bold uppercase tracking-[0.2em]">
            Apex
          </span>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Premium framed automotive posters. Museum-grade prints, delivered
            anywhere in Tunisia via Aramex, Runex and Yalidine.
          </p>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-widest">
            Shop
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <li key={key}>
                <Link href={`/category/${key}`} className="hover:text-foreground">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-widest">
            Paiement
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>D17 / Sobflous</li>
            <li>Flouci</li>
            <li>Virement bancaire</li>
            <li>Paiement à la livraison</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} APEX Posters. Tous droits réservés.</p>
          <Link href="/admin" className="hover:text-foreground">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
