// lib/db-products.ts
import { supabase } from './supabase'
import type { Product, Category } from './products'

// Convert snake_case from DB to camelCase
function toProduct(row: Record<string, unknown>): Product {
  return {
    id:            row.id as string,
    name:          row.name as string,
    subtitle:      row.subtitle as string,
    category:      row.category as Category,
    price:         row.price as number,
    originalPrice: row.original_price as number | undefined,
    image:         row.image as string,
    description:   row.description as string,
    trending:      row.trending as boolean,
  }
}

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) { console.error(error); return [] }
  return (data || []).map(toProduct)
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  if (error || !data) return null
  return toProduct(data)
}

export async function getTrendingProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('trending', true)
    .order('created_at', { ascending: false })
  if (error) { console.error(error); return [] }
  return (data || []).map(toProduct)
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })
  if (error) { console.error(error); return [] }
  return (data || []).map(toProduct)
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
  const id = `product-${Date.now()}-${Math.random().toString(36).slice(2)}`
  const { data, error } = await supabase
    .from('products')
    .insert({
      id,
      name:           product.name,
      subtitle:       product.subtitle,
      category:       product.category,
      price:          product.price,
      original_price: product.originalPrice ?? null,
      image:          product.image,
      description:    product.description,
      trending:       product.trending ?? false,
    })
    .select()
    .single()
  if (error) { console.error(error); return null }
  return toProduct(data)
}

export async function updateProduct(id: string, product: Omit<Product, 'id'>): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .update({
      name:           product.name,
      subtitle:       product.subtitle,
      category:       product.category,
      price:          product.price,
      original_price: product.originalPrice ?? null,
      image:          product.image,
      description:    product.description,
      trending:       product.trending ?? false,
    })
    .eq('id', id)
    .select()
    .single()
  if (error) { console.error(error); return null }
  return toProduct(data)
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) { console.error(error); return false }
  return true
}