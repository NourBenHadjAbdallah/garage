'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Phone,
  MapPin,
  Receipt,
  Package,
  CircleDot,
  CheckCheck,
  Truck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  getOrders,
  updateOrderStatus,
  PAYMENT_LABELS,
  type Order,
} from '@/lib/orders'
import { formatTND } from '@/lib/products'

const STATUS_META: Record<
  Order['status'],
  { label: string; className: string; icon: typeof CircleDot }
> = {
  pending: {
    label: 'En attente',
    className: 'bg-muted text-foreground',
    icon: CircleDot,
  },
  verified: {
    label: 'Paiement vérifié',
    className: 'bg-foreground text-background',
    icon: CheckCheck,
  },
  shipped: {
    label: 'Expédiée',
    className: 'border border-foreground bg-background text-foreground',
    icon: Truck,
  },
}

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[] | null>(null)

  useEffect(() => {
    setOrders(getOrders())
  }, [])

  function setStatus(id: string, status: Order['status']) {
    setOrders(updateOrderStatus(id, status))
  }

  if (orders === null) {
    return <p className="mt-16 text-center text-muted-foreground">Chargement...</p>
  }

  if (orders.length === 0) {
    return (
      <div className="mt-16 flex flex-col items-center text-center">
        <Package className="h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-lg font-medium">Aucune commande pour l&apos;instant</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Les nouvelles commandes apparaîtront ici en temps réel.
        </p>
        <Button asChild className="mt-6 font-heading uppercase tracking-widest">
          <Link href="/checkout">Passer une commande test</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {orders.map((order) => {
        const meta = STATUS_META[order.status]
        return (
          <article
            key={order.id}
            className="rounded-2xl border border-border p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-medium">
                    {order.id}
                  </span>
                  <Badge className={meta.className}>
                    <meta.icon className="mr-1 h-3 w-3" />
                    {meta.label}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString('fr-TN')}
                </p>
              </div>
              <p className="font-heading text-xl font-bold">
                {formatTND(order.total)}
              </p>
            </div>

            <Separator className="my-4" />

            <div className="grid gap-5 sm:grid-cols-[1fr_1fr_auto]">
              {/* Customer */}
              <div className="space-y-2 text-sm">
                <p className="font-medium">{order.fullName}</p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0" />
                  {order.phone}
                </p>
                <p className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>
                    {order.address}, {order.city}, {order.governorate}
                  </span>
                </p>
                {order.notes && (
                  <p className="text-xs italic text-muted-foreground">
                    “{order.notes}”
                  </p>
                )}
              </div>

              {/* Items + payment */}
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 font-medium">
                  <Receipt className="h-4 w-4" />
                  {PAYMENT_LABELS[order.paymentMethod]}
                </p>
                <ul className="space-y-1 text-muted-foreground">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.name} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Receipt */}
              <div className="sm:w-28">
                {order.receiptDataUrl ? (
                  <a
                    href={order.receiptDataUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block overflow-hidden rounded-lg border border-border"
                  >
                    {order.receiptDataUrl.startsWith('data:image') ? (
                      <img
                        src={order.receiptDataUrl || '/placeholder.svg'}
                        alt={`Reçu ${order.id}`}
                        className="h-28 w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-28 w-full flex-col items-center justify-center gap-1 bg-muted text-xs text-muted-foreground">
                        <Receipt className="h-5 w-5" />
                        Voir le reçu
                      </span>
                    )}
                  </a>
                ) : (
                  <div className="flex h-28 w-full items-center justify-center rounded-lg border border-dashed border-border text-center text-xs text-muted-foreground">
                    COD — pas de reçu
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={order.status === 'verified' ? 'default' : 'outline'}
                onClick={() => setStatus(order.id, 'verified')}
                className="font-heading text-xs uppercase tracking-widest"
              >
                Marquer vérifiée
              </Button>
              <Button
                size="sm"
                variant={order.status === 'shipped' ? 'default' : 'outline'}
                onClick={() => setStatus(order.id, 'shipped')}
                className="font-heading text-xs uppercase tracking-widest"
              >
                Marquer expédiée
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setStatus(order.id, 'pending')}
                className="font-heading text-xs uppercase tracking-widest"
              >
                Réinitialiser
              </Button>
            </div>
          </article>
        )
      })}
    </div>
  )
}
