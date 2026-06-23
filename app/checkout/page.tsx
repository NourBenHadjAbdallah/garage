'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Upload, FileCheck2, X, Banknote, Wallet, Landmark, Truck } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/components/cart/cart-provider'
import { getProduct, formatTND } from '@/lib/products'
import {
  SHIPPING_FEE,
  BANK_ACCOUNTS,
  PAYMENT_LABELS,
  saveOrder,
  type PaymentMethod,
  type Order,
} from '@/lib/orders'
import { toast } from 'sonner'

const GOVERNORATES = [
  'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan', 'Bizerte',
  'Béja', 'Jendouba', 'Le Kef', 'Siliana', 'Sousse', 'Monastir', 'Mahdia',
  'Sfax', 'Kairouan', 'Kasserine', 'Sidi Bouzid', 'Gabès', 'Médenine',
  'Tataouine', 'Gafsa', 'Tozeur', 'Kébili',
]

const PAYMENT_OPTIONS: {
  value: PaymentMethod
  icon: typeof Wallet
  hint: string
  requiresProof: boolean
}[] = [
  { value: 'd17', icon: Wallet, hint: 'Payez via Sobflous ou un bureau de Poste, puis joignez le reçu.', requiresProof: true },
  { value: 'flouci', icon: Banknote, hint: 'Envoyez le montant via le wallet Flouci, puis joignez la capture.', requiresProof: true },
  { value: 'bank', icon: Landmark, hint: 'Effectuez un virement ou versement sur l’un des comptes ci-dessous.', requiresProof: true },
  { value: 'cod', icon: Truck, hint: 'Réglez en espèces à la réception de votre commande.', requiresProof: false },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clear } = useCart()

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    governorate: '',
    notes: '',
  })
  const [payment, setPayment] = useState<PaymentMethod | ''>('')
  const [receipt, setReceipt] = useState<{ name: string; dataUrl: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const detailed = useMemo(
    () =>
      items
        .map((item) => {
          const product = getProduct(item.id)
          return product ? { product, quantity: item.quantity } : null
        })
        .filter((x): x is NonNullable<typeof x> => x !== null),
    [items],
  )

  const shipping = subtotal > 0 ? SHIPPING_FEE : 0
  const total = subtotal + shipping
  const selectedOption = PAYMENT_OPTIONS.find((o) => o.value === payment)
  const requiresProof = selectedOption?.requiresProof ?? false

  function handleField(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Le fichier dépasse 5 Mo.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setReceipt({ name: file.name, dataUrl: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  const canSubmit =
    form.fullName &&
    form.phone &&
    form.address &&
    form.city &&
    form.governorate &&
    payment &&
    (!requiresProof || receipt)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit || !payment) {
      toast.error('Veuillez compléter tous les champs obligatoires.')
      return
    }
    setSubmitting(true)

    const order: Order = {
      id: `APX-${Date.now().toString(36).toUpperCase()}`,
      createdAt: Date.now(),
      fullName: form.fullName,
      phone: form.phone,
      email: form.email || undefined,
      address: form.address,
      city: form.city,
      governorate: form.governorate,
      notes: form.notes || undefined,
      paymentMethod: payment,
      receiptDataUrl: receipt?.dataUrl,
      receiptName: receipt?.name,
      items: detailed.map(({ product, quantity }) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
      })),
      subtotal,
      shipping,
      total,
      status: 'pending',
    }

    saveOrder(order)
    clear()
    router.push(`/order-confirmation/${order.id}`)
  }

  if (detailed.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
          <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">
            Votre panier est vide
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ajoutez un poster avant de passer commande.
          </p>
          <Button asChild className="mt-6 font-heading uppercase tracking-widest">
            <Link href="/shop">Voir la collection</Link>
          </Button>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl font-bold uppercase tracking-tight sm:text-4xl">
          Checkout
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]"
        >
          <div className="space-y-10">
            {/* Delivery */}
            <section>
              <h2 className="font-heading text-lg font-semibold uppercase tracking-wide">
                1. Livraison
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="fullName">Nom complet *</Label>
                  <Input
                    id="fullName"
                    value={form.fullName}
                    onChange={(e) => handleField('fullName', e.target.value)}
                    className="mt-1.5"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    placeholder="+216 ..."
                    value={form.phone}
                    onChange={(e) => handleField('phone', e.target.value)}
                    className="mt-1.5"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email (optionnel)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleField('email', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Adresse *</Label>
                  <Input
                    id="address"
                    value={form.address}
                    onChange={(e) => handleField('address', e.target.value)}
                    className="mt-1.5"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">Ville *</Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) => handleField('city', e.target.value)}
                    className="mt-1.5"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="governorate">Gouvernorat *</Label>
                  <select
                    id="governorate"
                    value={form.governorate}
                    onChange={(e) => handleField('governorate', e.target.value)}
                    className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  >
                    <option value="" disabled>
                      Sélectionnez...
                    </option>
                    {GOVERNORATES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="notes">Notes (optionnel)</Label>
                  <Textarea
                    id="notes"
                    value={form.notes}
                    onChange={(e) => handleField('notes', e.target.value)}
                    className="mt-1.5"
                    rows={2}
                  />
                </div>
              </div>
            </section>

            {/* Payment */}
            <section>
              <h2 className="font-heading text-lg font-semibold uppercase tracking-wide">
                2. Mode de paiement
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Choisissez une méthode locale. Aucune carte bancaire
                internationale requise.
              </p>

              <RadioGroup
                value={payment}
                onValueChange={(v) => {
                  setPayment(v as PaymentMethod)
                  setReceipt(null)
                }}
                className="mt-4 gap-3"
              >
                {PAYMENT_OPTIONS.map((option) => {
                  const active = payment === option.value
                  return (
                    <Label
                      key={option.value}
                      htmlFor={`pay-${option.value}`}
                      className={
                        active
                          ? 'flex cursor-pointer items-start gap-3 rounded-xl border-2 border-foreground p-4'
                          : 'flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4 transition-colors hover:border-foreground/40'
                      }
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={`pay-${option.value}`}
                        className="mt-0.5"
                      />
                      <option.icon className="mt-0.5 h-5 w-5 shrink-0" />
                      <div className="flex-1">
                        <span className="font-medium">
                          {PAYMENT_LABELS[option.value]}
                        </span>
                        <p className="mt-0.5 text-sm font-normal text-muted-foreground">
                          {option.hint}
                        </p>
                      </div>
                    </Label>
                  )
                })}
              </RadioGroup>

              {/* Bank details */}
              {payment === 'bank' && (
                <div className="mt-4 rounded-xl border border-border bg-muted/40 p-4">
                  <p className="font-heading text-sm font-semibold uppercase tracking-wide">
                    Coordonnées bancaires
                  </p>
                  <ul className="mt-3 space-y-3">
                    {BANK_ACCOUNTS.map((acc) => (
                      <li
                        key={acc.bank}
                        className="flex flex-col gap-0.5 border-b border-border pb-3 last:border-0 last:pb-0"
                      >
                        <span className="font-medium">{acc.bank}</span>
                        <span className="font-mono text-sm">RIB: {acc.rib}</span>
                        <span className="text-xs text-muted-foreground">
                          Bénéficiaire: {acc.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Proof of payment */}
              {requiresProof && (
                <div className="mt-4">
                  <Label className="text-sm font-medium">
                    Veuillez télécharger une capture d&apos;écran ou une photo du
                    reçu de paiement (Proof of Payment) *
                  </Label>
                  {receipt ? (
                    <div className="mt-2 flex items-center justify-between rounded-xl border border-border p-3">
                      <div className="flex items-center gap-3">
                        <FileCheck2 className="h-5 w-5 text-foreground" />
                        <span className="truncate text-sm">{receipt.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setReceipt(null)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Supprimer le reçu"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-6 text-center transition-colors hover:border-foreground/40">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Cliquez pour téléverser le reçu
                      </span>
                      <span className="text-xs text-muted-foreground">
                        JPG, PNG ou PDF — max 5 Mo
                      </span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFile}
                        className="sr-only"
                      />
                    </label>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Summary */}
          <aside className="h-fit rounded-2xl border border-border p-6 lg:sticky lg:top-24">
            <h2 className="font-heading text-lg font-semibold uppercase tracking-wide">
              Votre commande
            </h2>
            <ul className="mt-4 space-y-4">
              {detailed.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-3">
                  <div className="relative shrink-0 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={product.image || '/placeholder.svg'}
                      alt={product.name}
                      className="h-16 w-14 object-cover"
                    />
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[11px] font-semibold text-background">
                      {quantity}
                    </span>
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-2">
                    <span className="text-sm font-medium">{product.name}</span>
                    <span className="text-sm">
                      {formatTND(product.price * quantity)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <Separator className="my-4" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatTND(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Livraison</span>
                <span>{formatTND(shipping)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatTND(total)}</span>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={!canSubmit || submitting}
              className="mt-6 w-full font-heading uppercase tracking-widest"
            >
              {submitting ? 'Traitement...' : 'Confirmer la commande'}
            </Button>
            {requiresProof && !receipt && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Le reçu de paiement est requis pour valider la commande.
              </p>
            )}
          </aside>
        </form>
      </main>

      <SiteFooter />
    </div>
  )
}
