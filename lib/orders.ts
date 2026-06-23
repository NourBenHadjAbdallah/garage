export type PaymentMethod = 'd17' | 'flouci' | 'bank' | 'cod'

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  d17: 'D17 (Sobflous / La Poste)',
  flouci: 'Flouci',
  bank: 'Virement / Versement bancaire',
  cod: 'Paiement à la livraison',
}

export type OrderItem = {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export type Order = {
  id: string
  createdAt: number
  fullName: string
  phone: string
  email?: string
  address: string
  city: string
  governorate: string
  notes?: string
  paymentMethod: PaymentMethod
  receiptDataUrl?: string
  receiptName?: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  status: 'pending' | 'verified' | 'shipped'
}

const STORAGE_KEY = 'apex-orders-v1'

export function getOrders(): Order[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Order[]) : []
  } catch {
    return []
  }
}

export function saveOrder(order: Order) {
  const orders = getOrders()
  orders.unshift(order)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

export function updateOrderStatus(id: string, status: Order['status']) {
  const orders = getOrders().map((o) => (o.id === id ? { ...o, status } : o))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  return orders
}

export const SHIPPING_FEE = 8

export const BANK_ACCOUNTS = [
  { bank: 'Attijari Bank', rib: '04 123 0001234567890 12', label: 'APEX Posters' },
  { bank: 'BIAT', rib: '08 200 0009876543210 88', label: 'APEX Posters' },
  { bank: 'BH Bank', rib: '14 050 0004567891230 47', label: 'APEX Posters' },
]
