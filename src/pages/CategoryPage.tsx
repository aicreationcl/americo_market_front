import { useParams, Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategorySidebar } from '@/components/catalog/CategorySidebar'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import { SearchBar } from '@/components/catalog/SearchBar'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'

export default function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)

  const { data: categories } = useCategories()
  const category = categories?.find((c) => c.slug === categorySlug)
  const { data, isLoading } = useProducts({ category: categorySlug, search, page, limit: 20 })

  const goTo = (p: number) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(p))
    setSearchParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <Helmet>
        <title>{category?.name || 'Categoría'}</title>
        <meta name="description" content={`Productos de ${category?.name} en AMERICO Minimarket.`} />
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Inicio</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/catalogo" className="hover:text-foreground">Catálogo</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">{category?.name || categorySlug}</span>
        </nav>

        <div className="flex gap-8">
          <div className="hidden md:block">
            <CategorySidebar />
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{category?.name || categorySlug}</h1>
                {data && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {data.total} producto{data.total !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              <SearchBar />
            </div>

            <ProductGrid products={data?.data} isLoading={isLoading} />

            {data && data.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => goTo(page - 1)}>
                  ← Anterior
                </Button>
                <span className="text-sm text-muted-foreground">{page} / {data.totalPages}</span>
                <Button variant="outline" size="sm" disabled={page >= data.totalPages} onClick={() => goTo(page + 1)}>
                  Siguiente →
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
