export type Category = 'luxury' | 'sports' | 'jdm' | 'f1'

export type Product = {
  id: string
  name: string
  subtitle: string
  category: Category
  price: number
  originalPrice?: number
  image: string
  description: string
  trending?: boolean
}

export const CATEGORY_LABELS: Record<Category, string> = {
  luxury: 'Luxury',
  sports: 'Sports',
  jdm: 'JDM',
  f1: 'Formula 1',
}

export const products: Product[] = [
  {
    id: 'porsche-911',
    name: 'Porsche 911',
    subtitle: 'Silver Carrera',
    category: 'sports',
    price: 129,
    originalPrice: 149,
    image: '/posters/porsche-911.png',
    description:
      'A timeless icon captured in dramatic studio light. The 911 silhouette printed on premium 250gsm matte fine-art paper, framed in a slim matte-black wood frame.',
    trending: true,
  },
  {
    id: 'lamborghini-huracan',
    name: 'Lamborghini Huracán',
    subtitle: 'Arancio Borealis',
    category: 'sports',
    price: 139,
    originalPrice: 159,
    image: '/posters/lamborghini.png',
    description:
      'Low, wide and unapologetic. Shot from a ground-level angle to emphasise the aggressive stance, this print pops against any wall.',
    trending: true,
  },
  {
    id: 'nissan-gtr',
    name: 'Nissan GT-R R35',
    subtitle: 'Tokyo Nights',
    category: 'jdm',
    price: 119,
    originalPrice: 139,
    image: '/posters/gtr.png',
    description:
      'Godzilla under neon. A love letter to JDM culture and the streets of Tokyo, rendered with deep contrast and electric blues.',
    trending: true,
  },
  {
    id: 'f1-redline',
    name: 'Formula 1 — Redline',
    subtitle: 'Apex Series',
    category: 'f1',
    price: 149,
    originalPrice: 169,
    image: '/posters/f1.png',
    description:
      'Pure speed frozen in motion. Motion-blurred grandstands and a scarlet single-seater on the limit through the apex.',
    trending: true,
  },
  {
    id: 'mercedes-amg-gt',
    name: 'Mercedes-AMG GT',
    subtitle: 'Stealth Black',
    category: 'luxury',
    price: 134,
    originalPrice: 154,
    image: '/posters/mercedes-amg.png',
    description:
      'Menacing and refined. A matte-black AMG GT bathed in moody light — understated luxury for the modern wall.',
    trending: true,
  },
  {
    id: 'toyota-supra',
    name: 'Toyota Supra MK4',
    subtitle: 'Golden Hour',
    category: 'jdm',
    price: 124,
    originalPrice: 144,
    image: '/posters/supra.png',
    description:
      'The legend that defined a generation of tuners, caught in warm sunset tones. A must-have for any JDM collection.',
    trending: true,
  },
  {
    id: 'ferrari-f40',
    name: 'Ferrari F40',
    subtitle: 'Rosso Corsa',
    category: 'sports',
    price: 144,
    originalPrice: 164,
    image: '/posters/ferrari.png',
    description:
      'The last Ferrari signed off by Enzo himself. Raw, analog and iconic — the F40 in its purest Rosso Corsa form.',
    trending: true,
  },
  {
    id: 'rolls-royce',
    name: 'Rolls-Royce',
    subtitle: 'Black Tie',
    category: 'luxury',
    price: 154,
    originalPrice: 179,
    image: '/posters/rolls-royce.png',
    description:
      'Effortless opulence. A minimalist composition of the most prestigious silhouette in motoring, finished in deep black.',
    trending: true,
  },
]

export function getProduct(id: string) {
  return products.find((p) => p.id === id)
}

export function discountPercent(product: Product) {
  if (!product.originalPrice) return 0
  return Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  )
}

export function formatTND(amount: number) {
  return `${amount.toFixed(0)} DT`
}
