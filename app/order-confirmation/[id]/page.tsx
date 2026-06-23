'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Package, Truck } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getOrders, PAYMENT_LABELS, type Order } from '@/lib/orders'
import { formatTND } from '@/lib/products'

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [order, setOrder] = useState<Order | null | undefined>(undefined)

  useEffect(() => {
    const found = getOrders().find((o) => o.id === id)
    setOrder(found ?? null)
  }, [id])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-14 sm:px-6 lg:px-8">
        {order === undefined ? (
          <p className="text-center text-muted-foreground">Chargement...</p>
        ) : order === null ? (
          <div className="text-center">
            <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">
              Commande introuvable
            </h1>
            <Button asChild className="mt-6 font-heading uppercase tracking-widest">
              <Link href="/shop">Retour à la boutique</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center text-center">
              <CheckCircle2 className="h-14 w-14" />
              <h1 className="mt-4 font-heading text-3xl font-bold uppercase tracking-tight">
                Merci, {order.fullName.split(' ')[0]}!
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Votre commande{' '}
                <span className="font-mono font-medium text-foreground">
                  {order.id}
                </span>{' '}
                a bien été enregistrée. Notre équipe vérifiera votre paiement
                puis expédiera votre commande via Aramex, Runex ou Yalidine.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5" />
                <h2 className="font-heading text-sm font-semibold uppercase tracking-wide">
                  Récapitulatif
                </h2>
              </div>

              <ul className="mt-4 space-y-3">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image || '/placeholder.svg'}
                      alt={item.name}
                      className="h-14 w-12 rounded-md object-cover"
                    />
                    <div className="flex flex-1 items-center justify-between">
                      <span className="text-sm">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-sm">
                        {formatTND(item.price * item.quantity)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paiement</span>
                  <span>{PAYMENT_LABELS[order.paymentMethod]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Livraison à</span>
                  <span className="text-right">
                    {order.address}, {order.city}, {order.governorate}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{formatTND(order.total)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
              <Truck className="h-5 w-5 shrink-0" />
              <p>
                Vous recevrez un appel ou un message de confirmation avant
                l&apos;expédition. Délai estimé : 2 à 4 jours ouvrables.
              </p>
            </div>

            <Button
              asChild
              className="mt-6 w-full font-heading uppercase tracking-widest"
            >
              <Link href="/shop">Continuer mes achats</Link>
            </Button>
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
