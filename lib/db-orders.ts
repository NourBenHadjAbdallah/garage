// lib/db-orders.ts
import { supabase } from './supabase'
import type { Order, PaymentMethod } from './orders'

export async function getOrdersFromDB(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })
  if (error) { console.error(error); return [] }

  return (data || []).map(row => ({
    id:             row.id,
    createdAt:      row.created_at,
    fullName:       row.full_name,
    phone:          row.phone,
    email:          row.email ?? undefined,
    address:        row.address,
    city:           row.city,
    governorate:    row.governorate,
    notes:          row.notes ?? undefined,
    paymentMethod:  row.payment_method as PaymentMethod,
    receiptDataUrl: row.receipt_data_url ?? undefined,
    receiptName:    row.receipt_name ?? undefined,
    subtotal:       row.subtotal,
    shipping:       row.shipping,
    total:          row.total,
    status:         row.status,
    items: (row.order_items || []).map((item: Record<string, unknown>) => ({
      id:       item.product_id as string,
      name:     item.name as string,
      price:    item.price as number,
      quantity: item.quantity as number,
      image:    item.image as string,
    })),
  }))
}

export async function saveOrderToDB(order: Order): Promise<boolean> {
  // Insert order
  const { error: orderError } = await supabase.from('orders').insert({
    id:               order.id,
    created_at:       order.createdAt,
    full_name:        order.fullName,
    phone:            order.phone,
    email:            order.email ?? null,
    address:          order.address,
    city:             order.city,
    governorate:      order.governorate,
    notes:            order.notes ?? null,
    payment_method:   order.paymentMethod,
    receipt_data_url: order.receiptDataUrl ?? null,
    receipt_name:     order.receiptName ?? null,
    subtotal:         order.subtotal,
    shipping:         order.shipping,
    total:            order.total,
    status:           order.status,
  })
  if (orderError) { console.error(orderError); return false }

  // Insert order items
  const items = order.items.map(item => ({
    order_id:   order.id,
    product_id: item.id,
    name:       item.name,
    price:      item.price,
    quantity:   item.quantity,
    image:      item.image,
  }))
  const { error: itemsError } = await supabase.from('order_items').insert(items)
  if (itemsError) { console.error(itemsError); return false }

  return true
}

export async function updateOrderStatusInDB(id: string, status: Order['status']): Promise<boolean> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
  if (error) { console.error(error); return false }
  return true
}