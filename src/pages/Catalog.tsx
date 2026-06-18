import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Button } from '@/components/ui/button'
import { CategorySidebar } from '@/components/catalog/CategorySidebar'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import { SearchBar } from '@/components/catalog/SearchBar'
import { CategoryPills } from '@/components/catalog/CategoryPills'
import { useProducts } from '@/hooks/useProducts'

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)

  const { data, isLoading } = useProducts({ search, page, limit: 20 })

  const goTo = (p: number) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(p))
    setSearchParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <Helmet>
        <title>Catálogo</title>
        <meta name="description" content="Explora todos los productos de AMERICO Minimarket." />
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Mobile: pills */}
        <div className="mb-4 md:hidden">
          <CategoryPills />
        </div>

        <div className="flex gap-8">
          {/* Sidebar desktop */}
          <div className="hidden md:block">
            <CategorySidebar />
          </div>

          {/* Main */}
          <div className="flex-1 min-w-0">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Catálogo</h1>
                {data && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {data.total} producto{data.total !== 1 ? 's' : ''}
                    {search && ` para "${search}"`}
                  </p>
                )}
              </div>
              <SearchBar />
            </div>

            <ProductGrid products={data?.data} isLoading={isLoading} />

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => goTo(page - 1)}
                >
                  ← Anterior
                </Button>
                <span className="text-sm text-muted-foreground">
                  {page} / {data.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= data.totalPages}
                  onClick={() => goTo(page + 1)}
                >
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
