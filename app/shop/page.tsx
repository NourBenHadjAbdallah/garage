// app/shop/page.tsx
'use client'

import { useState, useMemo } from 'react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ProductCard } from '@/components/product-card'
import { CATEGORY_LABELS, type Category } from '@/lib/products'
import { useAllProducts } from '@/hooks/use-all-products'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'

const SORT_OPTIONS = [
  { value: 'default',    label: 'Featured'     },
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'name-asc',   label: 'Name A → Z'  },
]

export default function CollectionPage() {
  const allProducts               = useAllProducts()
  const categories                = Object.keys(CATEGORY_LABELS) as Category[]
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')
  const [sort, setSort]           = useState('default')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sortOpen, setSortOpen]   = useState(false)
  const [maxPrice, setMaxPrice]   = useState(300)

  const filtered = useMemo(() => {
    let list = activeCategory === 'all'
      ? allProducts
      : allProducts.filter(p => p.category === activeCategory)

    list = list.filter(p => p.price <= maxPrice)

    if (sort === 'price-asc')  list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'name-asc')   list = [...list].sort((a, b) => a.name.localeCompare(b.name))

    return list
  }, [allProducts, activeCategory, sort, maxPrice])

  const activeSort = SORT_OPTIONS.find(o => o.value === sort)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      {/* ── Page header ── */}
      <section className="border-b border-border bg-muted/20 px-4 py-14 text-center sm:px-6 lg:px-8">
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Apex Posters
        </p>
        <h1 className="mt-2 font-heading text-5xl font-bold uppercase tracking-tight sm:text-6xl">
          The Collection
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          {allProducts.length} museum-grade framed prints. Every icon of automotive culture, ready to hang.
        </p>
      </section>

      {/* ── Toolbar ── */}
      <div className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

          {/* Mobile filter toggle */}
          <button
            onClick={() => setFiltersOpen(o => !o)}
            className="flex items-center gap-2 font-heading text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground md:hidden">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filter {activeCategory !== 'all' && `· ${CATEGORY_LABELS[activeCategory as Category]}`}
          </button>

          {/* Desktop active filter indicator */}
          <div className="hidden items-center gap-2 md:flex">
            {activeCategory !== 'all' && (
              <span className="flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider text-background">
                {CATEGORY_LABELS[activeCategory as Category]}
                <button onClick={() => setActiveCategory('all')}><X className="h-3 w-3" /></button>
              </span>
            )}
            {maxPrice < 300 && (
              <span className="flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider text-background">
                ≤{maxPrice} DT
                <button onClick={() => setMaxPrice(300)}><X className="h-3 w-3" /></button>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Result count */}
            <span className="hidden text-xs text-muted-foreground sm:block">
              {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
            </span>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(o => !o)}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 font-heading text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground">
                {activeSort?.label}
                <ChevronDown className={`h-3 w-3 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              {sortOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                  <div className="absolute right-0 top-full z-20 mt-1 w-48 overflow-hidden rounded-xl border border-border bg-background shadow-lg">
                    {SORT_OPTIONS.map(o => (
                      <button key={o.value}
                        onClick={() => { setSort(o.value); setSortOpen(false) }}
                        className={`flex w-full items-center px-4 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-muted ${sort === o.value ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {o.label}
                        {sort === o.value && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-foreground" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile category drawer */}
        {filtersOpen && (
          <div className="border-t border-border bg-background px-4 py-4 md:hidden">
            <div className="flex items-center justify-between mb-3">
              <p className="font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground">Category</p>
              <button onClick={() => setFiltersOpen(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => { setActiveCategory('all'); setFiltersOpen(false) }}
                className={`rounded-full px-4 py-1.5 font-heading text-xs font-semibold uppercase tracking-wider border transition-colors ${activeCategory === 'all' ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground'}`}>
                All
              </button>
              {categories.map(cat => (
                <button key={cat}
                  onClick={() => { setActiveCategory(cat); setFiltersOpen(false) }}
                  className={`rounded-full px-4 py-1.5 font-heading text-xs font-semibold uppercase tracking-wider border transition-colors ${activeCategory === cat ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground'}`}>
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground">Max Price</p>
                <p className="font-heading text-xs font-bold">{maxPrice} DT</p>
              </div>
              <input type="range" min={50} max={300} step={10} value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* ── Main content ── */}
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex gap-8">

          {/* Desktop sidebar filters */}
          <aside className="hidden w-52 shrink-0 lg:block">
            <div className="sticky top-32 space-y-8">
              {/* Category */}
              <div>
                <p className="mb-3 font-heading text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Category</p>
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 font-heading text-xs font-semibold uppercase tracking-wider transition-colors ${activeCategory === 'all' ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                    All
                    <span className="text-[10px] opacity-60">{allProducts.length}</span>
                  </button>
                  {categories.map(cat => (
                    <button key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 font-heading text-xs font-semibold uppercase tracking-wider transition-colors ${activeCategory === cat ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                      {CATEGORY_LABELS[cat]}
                      <span className="text-[10px] opacity-60">{allProducts.filter(p => p.category === cat).length}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Max Price</p>
                  <p className="font-heading text-xs font-bold">{maxPrice} DT</p>
                </div>
                <input type="range" min={50} max={300} step={10} value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-foreground" />
                <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                  <span>50 DT</span>
                  <span>300 DT</span>
                </div>
              </div>

              {/* Active filters */}
              {(activeCategory !== 'all' || maxPrice < 300) && (
                <div>
                  <p className="mb-2 font-heading text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Active Filters</p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCategory !== 'all' && (
                      <button
                        onClick={() => setActiveCategory('all')}
                        className="flex items-center gap-1 rounded-full bg-foreground px-2.5 py-1 font-heading text-[10px] font-bold uppercase tracking-wider text-background">
                        {CATEGORY_LABELS[activeCategory as Category]}
                        <X className="h-2.5 w-2.5" />
                      </button>
                    )}
                    {maxPrice < 300 && (
                      <button
                        onClick={() => setMaxPrice(300)}
                        className="flex items-center gap-1 rounded-full bg-foreground px-2.5 py-1 font-heading text-[10px] font-bold uppercase tracking-wider text-background">
                        ≤{maxPrice} DT
                        <X className="h-2.5 w-2.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <p className="font-heading text-2xl font-bold uppercase tracking-tight">No results</p>
                <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters.</p>
                <button
                  onClick={() => { setActiveCategory('all'); setMaxPrice(300) }}
                  className="mt-6 rounded-full border border-border px-6 py-2 font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:bg-foreground hover:text-background">
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <p className="mb-6 text-xs text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filtered.length}</span> prints
                  {activeCategory !== 'all' && <> in <span className="font-semibold text-foreground">{CATEGORY_LABELS[activeCategory as Category]}</span></>}
                </p>
                <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
                  {filtered.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}