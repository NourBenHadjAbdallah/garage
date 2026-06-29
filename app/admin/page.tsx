// app/admin/page.tsx
'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  LogOut, Package, TrendingUp, ShoppingBag, Clock,
  Plus, Trash2, Edit2, X, Save, CheckCheck, Truck,
  CircleDot, Phone, MapPin, Receipt, BarChart2,
  ChevronUp, ChevronDown, Image as ImageIcon, Upload, Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { PAYMENT_LABELS, type Order } from '@/lib/orders'
import { formatTND, CATEGORY_LABELS, type Category, type Product } from '@/lib/products'
import logo from "../../public/logo.png"
// ── API helpers ──────────────────────────────────────────────────────────────

const EMPTY: Omit<Product, 'id'> = { name: '', subtitle: '', category: 'sports', price: 99, image: '', description: '', trending: false }

const STATUS_META = {
  pending:  { label: 'Pending',  bg: 'bg-amber-500/10 text-amber-600',   icon: CircleDot  },
  verified: { label: 'Verified', bg: 'bg-emerald-500/10 text-emerald-600', icon: CheckCheck },
  shipped:  { label: 'Shipped',  bg: 'bg-indigo-500/10 text-indigo-600',  icon: Truck      },
}

type Tab = 'overview' | 'orders' | 'products'

// ── Mini bar chart ────────────────────────────────────────────────────────────
function MiniBar({ data, color = '#111' }: { data: { label: string; value: number }[]; color?: string }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="flex h-28 items-end gap-1.5">
      {data.map((d, i) => (
        <div key={i} className="group relative flex flex-1 flex-col items-center gap-1">
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-foreground px-1.5 py-0.5 text-[10px] text-background opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
            {d.value}
          </div>
          <div
            className="w-full rounded-t-sm transition-all duration-700"
            style={{ height: `${(d.value / max) * 88}px`, background: color, opacity: d.value === 0 ? 0.12 : 0.85 }}
          />
          <span className="text-[9px] text-muted-foreground">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

// ── Donut chart ───────────────────────────────────────────────────────────────
function DonutChart({ slices }: { slices: { label: string; value: number; color: string }[] }) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1
  let offset = 0
  const r = 36, cx = 44, cy = 44, circ = 2 * Math.PI * r
  return (
    <div className="flex items-center gap-6">
      <svg width="88" height="88" viewBox="0 0 88 88">
        {slices.map((s, i) => {
          const pct = s.value / total
          const dash = pct * circ
          const el = (
            <circle key={i} cx={cx} cy={cy} r={r}
              fill="none" stroke={s.color} strokeWidth="14"
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset * circ}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '44px 44px' }}
            />
          )
          offset += pct
          return el
        })}
        <circle cx={cx} cy={cy} r="28" fill="var(--background)" />
        <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="700" fill="currentColor">{total}</text>
        <text x={cx} y={cy + 13} textAnchor="middle" dominantBaseline="middle" fontSize="7" fill="#888">total</text>
      </svg>
      <div className="space-y-2">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: s.color }} />
            <span className="text-muted-foreground">{s.label}</span>
            <span className="ml-auto font-semibold tabular-nums">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, trend }: {
  label: string; value: string | number; sub?: string; icon: typeof Package; trend?: number
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</p>
          <p className="mt-1.5 font-heading text-2xl font-bold tracking-tight">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
        </div>
        <div className="rounded-xl bg-foreground/5 p-2.5">
          <Icon className="h-5 w-5 text-foreground" />
        </div>
      </div>
      {trend !== undefined && (
        <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {trend >= 0 ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          {Math.abs(trend)}% vs last week
        </div>
      )}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('overview')
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [editing, setEditing] = useState<Product | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [form, setForm] = useState<Omit<Product, 'id'>>(EMPTY)
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    // Local preview
    setUploadPreview(URL.createObjectURL(file))
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Upload failed')
      const { url } = await res.json()
      setForm(f => ({ ...f, image: url }))
    } catch {
      alert('Image upload failed. Please try again.')
      setUploadPreview(null)
    } finally {
      setUploading(false)
    }
  }

  useEffect(() => {
    // Fetch orders from Supabase
    fetch('/api/orders')
      .then(r => r.json())
      .then(data => setOrders(data))
      .catch(() => setOrders([]))
    // Fetch products from Supabase
    fetch('/api/products')
      .then(r => r.json())
      .then(data => setProducts(data))
      .catch(() => setProducts([]))
  }, [])

  // ── Stats ──
  const revenue  = useMemo(() => orders.reduce((s, o) => s + o.total, 0), [orders])
  const pending  = orders.filter(o => o.status === 'pending').length
  const shipped  = orders.filter(o => o.status === 'shipped').length
  const verified = orders.filter(o => o.status === 'verified').length

  const last7 = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i))
      return { label: d.toLocaleDateString('en', { weekday: 'short' }), date: d.toDateString(), value: 0 }
    })
    orders.forEach(o => { const s = days.find(x => x.date === new Date(o.createdAt).toDateString()); if (s) s.value++ })
    return days
  }, [orders])

  const revenueByDay = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i))
      return { label: d.toLocaleDateString('en', { weekday: 'short' }), date: d.toDateString(), value: 0 }
    })
    orders.forEach(o => { const s = days.find(x => x.date === new Date(o.createdAt).toDateString()); if (s) s.value += o.total })
    return days.map(d => ({ ...d, value: Math.round(d.value) }))
  }, [orders])

  const paymentBreakdown = useMemo(() => {
    const counts: Record<string, number> = {}
    orders.forEach(o => { counts[o.paymentMethod] = (counts[o.paymentMethod] || 0) + 1 })
    const colors: Record<string, string> = { d17: '#6366f1', flouci: '#f59e0b', bank: '#10b981', cod: '#f43f5e' }
    return Object.entries(counts).map(([k, v]) => ({ label: PAYMENT_LABELS[k as keyof typeof PAYMENT_LABELS] || k, value: v, color: colors[k] || '#888' }))
  }, [orders])

  const topProducts = useMemo(() => {
    const counts: Record<string, { name: string; qty: number; revenue: number }> = {}
    orders.forEach(o => o.items.forEach(item => {
      if (!counts[item.id]) counts[item.id] = { name: item.name, qty: 0, revenue: 0 }
      counts[item.id].qty += item.quantity
      counts[item.id].revenue += item.price * item.quantity
    }))
    return Object.values(counts).sort((a, b) => b.qty - a.qty).slice(0, 5)
  }, [orders])

  // ── Actions ──
  async function setStatus(id: string, status: Order['status']) {
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }
  async function handleLogout() { await fetch('/api/admin/logout', { method: 'POST' }); router.push('/admin/login'); router.refresh() }
  function startNew() { setEditing(null); setIsNew(true); setForm(EMPTY); setUploadPreview(null) }
  function startEdit(p: Product) { setEditing(p); setIsNew(false); setUploadPreview(null); setForm({ name: p.name, subtitle: p.subtitle, category: p.category, price: p.price, originalPrice: p.originalPrice, image: p.image, description: p.description, trending: p.trending }) }
  function cancelForm() { setEditing(null); setIsNew(false); setUploadPreview(null) }
  async function saveForm() {
    if (isNew) {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const newProduct = await res.json()
        setProducts(prev => [newProduct, ...prev])
      }
    } else if (editing) {
      const res = await fetch(`/api/products/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const updated = await res.json()
        setProducts(prev => prev.map(p => p.id === editing.id ? updated : p))
      }
    }
    cancelForm()
  }
  async function deleteProduct(id: string) {
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    setProducts(prev => prev.filter(p => p.id !== id))
  }
  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  const tabs: { id: Tab; label: string; icon: typeof BarChart2 }[] = [
    { id: 'overview', label: 'Overview',  icon: BarChart2   },
    { id: 'orders',   label: 'Orders',    icon: ShoppingBag },
    { id: 'products', label: 'Products',  icon: Package     },
  ]

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-muted/30">

      {/* ── Sidebar ── */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-background lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <img src={logo.src} alt="Drive Frame" className="mx-auto" width={160} height={30}/>

        </div>
        <nav className="flex-1 space-y-1 p-3 pt-4">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${tab === t.id ? 'bg-foreground text-background shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
              <t.icon className="h-4 w-4" />{t.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <button onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* ── Content ── */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6 shrink-0">
          {/* Mobile tabs */}
          <div className="flex gap-1 lg:hidden">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${tab === t.id ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted'}`}>
                {t.label}
              </button>
            ))}
          </div>
          <h1 className="hidden font-heading text-base font-bold uppercase tracking-wide lg:block">
            {tab === 'overview' ? 'Dashboard Overview' : tab === 'orders' ? 'Order Management' : 'Product Catalog'}
          </h1>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:block">
              {new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
            <button onClick={handleLogout} className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">

          {/* ══ OVERVIEW ══ */}
          {tab === 'overview' && (
            <div className="space-y-6 max-w-6xl">

              {/* Stat cards */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total Revenue" value={formatTND(revenue)} icon={TrendingUp} sub={`from ${orders.length} orders`} />
                <StatCard label="Total Orders"  value={orders.length}      icon={ShoppingBag} sub="All time" />
                <StatCard label="Pending"       value={pending}            icon={Clock}       sub="Need verification" />
                <StatCard label="Shipped"       value={shipped}            icon={Truck}       sub="Delivered" />
              </div>

              {/* Charts row 1 */}
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-2xl border border-border bg-background p-5">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Orders — Last 7 Days</p>
                  <p className="mb-4 font-heading text-2xl font-bold">{orders.length}</p>
                  <MiniBar data={last7} color="#111827" />
                </div>
                <div className="rounded-2xl border border-border bg-background p-5">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Order Status</p>
                  <p className="mb-4 font-heading text-2xl font-bold">{pending} pending</p>
                  <DonutChart slices={[
                    { label: 'Pending',  value: pending,  color: '#f59e0b' },
                    { label: 'Verified', value: verified, color: '#10b981' },
                    { label: 'Shipped',  value: shipped,  color: '#6366f1' },
                  ]} />
                </div>
              </div>

              {/* Charts row 2 */}
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-2xl border border-border bg-background p-5">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Revenue (DT) — Last 7 Days</p>
                  <p className="mb-4 font-heading text-2xl font-bold">{formatTND(revenue)}</p>
                  <MiniBar data={revenueByDay} color="#6366f1" />
                </div>
                <div className="rounded-2xl border border-border bg-background p-5">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Payment Methods</p>
                  <p className="mb-4 font-heading text-2xl font-bold">{paymentBreakdown.length} types</p>
                  {paymentBreakdown.length === 0
                    ? <p className="text-sm text-muted-foreground">No orders yet</p>
                    : <DonutChart slices={paymentBreakdown} />}
                </div>
              </div>

              {/* Top products */}
              <div className="rounded-2xl border border-border bg-background p-5">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Top Products by Sales</p>
                {topProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No orders yet</p>
                ) : (
                  <div className="space-y-4">
                    {topProducts.map((p, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <span className="w-5 shrink-0 text-xs font-bold text-muted-foreground">#{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between text-sm mb-1.5">
                            <span className="font-medium truncate">{p.name}</span>
                            <span className="text-muted-foreground ml-2 shrink-0">{formatTND(p.revenue)}</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-muted">
                            <div className="h-1.5 rounded-full bg-foreground transition-all duration-700"
                              style={{ width: `${(p.qty / (topProducts[0]?.qty || 1)) * 100}%` }} />
                          </div>
                        </div>
                        <span className="w-14 shrink-0 text-right text-xs text-muted-foreground">{p.qty} sold</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent orders */}
              <div className="rounded-2xl border border-border bg-background p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Recent Orders</p>
                  <button onClick={() => setTab('orders')} className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                    View all →
                  </button>
                </div>
                {orders.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No orders yet</p>
                ) : (
                  <div className="space-y-2">
                    {orders.slice(0, 6).map(o => {
                      const meta = STATUS_META[o.status]
                      return (
                        <div key={o.id} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="font-mono text-xs text-muted-foreground shrink-0">{o.id}</span>
                            <span className="font-medium text-sm truncate">{o.fullName}</span>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.bg}`}>{meta.label}</span>
                            <span className="font-semibold text-sm">{formatTND(o.total)}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══ ORDERS ══ */}
          {tab === 'orders' && (
            <div className="space-y-4 max-w-4xl">
              {orders.length === 0 ? (
                <div className="flex flex-col items-center py-24 text-center">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 font-medium">No orders yet</p>
                </div>
              ) : orders.map(order => {
                const meta = STATUS_META[order.status]
                return (
                  <article key={order.id} className="rounded-2xl border border-border bg-background p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold">{order.id}</span>
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.bg}`}>{meta.label}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleString('fr-TN')}</p>
                      </div>
                      <p className="font-heading text-xl font-bold">{formatTND(order.total)}</p>
                    </div>

                    <Separator className="my-4" />

                    <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
                      <div className="space-y-1.5 text-sm">
                        <p className="font-semibold">{order.fullName}</p>
                        <p className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5 shrink-0" />{order.phone}</p>
                        <p className="flex items-start gap-2 text-muted-foreground"><MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" /><span>{order.address}, {order.city}, {order.governorate}</span></p>
                        {order.notes && <p className="text-xs italic text-muted-foreground">"{order.notes}"</p>}
                      </div>
                      <div className="space-y-1.5 text-sm">
                        <p className="flex items-center gap-2 font-medium"><Receipt className="h-3.5 w-3.5" />{PAYMENT_LABELS[order.paymentMethod]}</p>
                        <ul className="space-y-0.5 text-muted-foreground">
                          {order.items.map(item => <li key={item.id}>{item.name} × {item.quantity}</li>)}
                        </ul>
                      </div>
                      <div className="w-24 shrink-0">
                        {order.receiptDataUrl ? (
                          <a href={order.receiptDataUrl} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-xl border border-border">
                            {order.receiptDataUrl.startsWith('data:image')
                              ? <img src={order.receiptDataUrl} alt="Receipt" className="h-24 w-full object-cover" />
                              : <span className="flex h-24 flex-col items-center justify-center gap-1 bg-muted text-xs text-muted-foreground"><Receipt className="h-4 w-4" />View</span>}
                          </a>
                        ) : (
                          <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-border text-xs text-muted-foreground text-center px-1">COD — no receipt</div>
                        )}
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex flex-wrap gap-2">
                      {(['pending', 'verified', 'shipped'] as Order['status'][]).map(s => (
                        <button key={s} onClick={() => setStatus(order.id, s)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${order.status === s ? 'bg-foreground text-background' : 'border border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground'}`}>
                          {STATUS_META[s].label}
                        </button>
                      ))}
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          {/* ══ PRODUCTS ══ */}
          {tab === 'products' && (
            <div className="space-y-6 max-w-5xl">

              {/* Form panel */}
              {(isNew || editing) && (
                <div className="rounded-2xl border border-border bg-background p-6">
                  <h2 className="font-heading text-base font-bold uppercase tracking-wide mb-4">
                    {isNew ? '+ New Product' : 'Edit Product'}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Name *</Label>
                      <Input className="mt-1.5" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Subtitle</Label>
                      <Input className="mt-1.5" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <select className="mt-1.5 flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))}>
                        {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label>Price (DT) *</Label>
                      <Input className="mt-1.5" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} />
                    </div>
                    <div>
                      <Label>Original Price (optional)</Label>
                      <Input className="mt-1.5" type="number" value={form.originalPrice ?? ''} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value ? Number(e.target.value) : undefined }))} />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Product Image</Label>
                      <div className="mt-1.5 flex gap-4 items-start">
                        {/* Preview */}
                        <div className="h-28 w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-muted flex items-center justify-center">
                          {uploadPreview || form.image
                            ? <img src={uploadPreview || form.image} alt="Preview" className="h-full w-full object-cover" />
                            : <ImageIcon className="h-8 w-8 text-muted-foreground/30" />}
                        </div>
                        {/* Upload button */}
                        <div className="flex-1">
                          <label className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-5 text-center transition-colors hover:border-foreground/40 ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
                            {uploading
                              ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                              : <Upload className="h-5 w-5 text-muted-foreground" />}
                            <span className="text-sm font-medium">
                              {uploading ? 'Uploading...' : 'Click to upload image'}
                            </span>
                            <span className="text-xs text-muted-foreground">JPG, PNG, WEBP — max 5MB</span>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" disabled={uploading} />
                          </label>
                          {form.image && !uploading && (
                            <p className="mt-2 truncate text-xs text-muted-foreground">{form.image}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Description</Label>
                      <Textarea className="mt-1.5" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="trending" checked={!!form.trending}
                        onChange={e => setForm(f => ({ ...f, trending: e.target.checked }))} className="h-4 w-4 cursor-pointer accent-foreground" />
                      <Label htmlFor="trending">Show in Trending section</Label>
                    </div>
                  </div>
                  <div className="mt-5 flex gap-2">
                    <Button onClick={saveForm} className="font-heading text-xs uppercase tracking-widest">
                      <Save className="mr-1.5 h-4 w-4" /> Save Product
                    </Button>
                    <Button variant="ghost" onClick={cancelForm} className="font-heading text-xs uppercase tracking-widest">
                      <X className="mr-1.5 h-4 w-4" /> Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Input placeholder="Search products..." value={search}
                    onChange={e => setSearch(e.target.value)} className="w-52" />
                  <span className="text-sm text-muted-foreground">{filtered.length} product(s)</span>
                </div>
                <Button onClick={startNew} className="font-heading text-xs uppercase tracking-widest">
                  <Plus className="mr-1.5 h-4 w-4" /> Add Product
                </Button>
              </div>

              {/* Grid */}
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center py-24 text-center">
                  <Package className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 font-medium">No products yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">Click "Add Product" to create your first one.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map(p => (
                    <div key={p.id} className="overflow-hidden rounded-2xl border border-border bg-background hover:shadow-md transition-shadow">
                      <div className="relative h-44 bg-muted">
                        {p.image
                          ? <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                          : <div className="flex h-full items-center justify-center"><ImageIcon className="h-10 w-10 text-muted-foreground/30" /></div>}
                        {p.trending && (
                          <span className="absolute right-2 top-2 rounded-md bg-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background">Trending</span>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-heading font-semibold uppercase tracking-wide truncate">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[p.category]} · {p.subtitle}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-semibold">{formatTND(p.price)}</p>
                            {p.originalPrice && <p className="text-xs text-muted-foreground line-through">{formatTND(p.originalPrice)}</p>}
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button onClick={() => startEdit(p)}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-1.5 text-xs font-medium text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-colors">
                            <Edit2 className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button onClick={() => deleteProduct(p.id)}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-1.5 text-xs font-medium text-muted-foreground hover:border-red-400 hover:text-red-500 transition-colors">
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  )
}