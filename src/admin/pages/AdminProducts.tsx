import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { Plus, Pencil, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { getAdminProducts, updateProduct } from '@/api/admin.api'
import { formatCLP } from '@/utils/formatCLP'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { ProductForm } from '@/admin/components/ProductForm'
import { useDebounce } from '@/hooks/useDebounce'
import type { Product } from '@/types'

const LIMIT = 15

export default function AdminProducts() {
  const queryClient = useQueryClient()

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [confirmTarget, setConfirmTarget] = useState<Product | null>(null)

  const debouncedSearch = useDebounce(search, 350)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'products', { search: debouncedSearch, page }],
    queryFn: () => getAdminProducts({ search: debouncedSearch, page, limit: LIMIT }),
    staleTime: 30 * 1000,
  })

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => updateProduct(id, { isActive: false } as Parameters<typeof updateProduct>[1]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Producto desactivado')
      setConfirmTarget(null)
    },
    onError: () => toast.error('No se pudo desactivar el producto'),
  })

  const activateMutation = useMutation({
    mutationFn: (id: string) => updateProduct(id, { isActive: true } as Parameters<typeof updateProduct>[1]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Producto activado')
    },
    onError: () => toast.error('No se pudo activar el producto'),
  })

  const products = data?.data ?? []
  const pagination = data?.pagination
  const totalPages = pagination?.totalPages ?? 1

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const openCreate = () => {
    setEditingProduct(null)
    setFormOpen(true)
  }

  const openEdit = (product: Product) => {
    setEditingProduct(product)
    setFormOpen(true)
  }

  return (
    <>
      <Helmet><title>Productos — Admin AMERICO</title></Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Productos</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isLoading ? '...' : `${pagination?.total ?? 0} productos en total`}
            </p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo producto
          </Button>
        </div>

        {/* Buscador */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, SKU o marca…"
            value={search}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>

        {/* Tabla */}
        <div className="rounded-xl border border-border bg-background overflow-hidden">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="space-y-3 p-5">
                {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : products.length === 0 ? (
              <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                {search ? `Sin resultados para "${search}"` : 'No hay productos aún'}
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
                    <th className="px-5 py-3">Producto</th>
                    <th className="px-5 py-3">Categoría</th>
                    <th className="px-5 py-3 text-right">Precio</th>
                    <th className="px-5 py-3 text-right">Stock</th>
                    <th className="px-5 py-3 text-center">Estado</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                            <img
                              src={(product.images as unknown as Array<{ url: string }>)?.[0]?.url || '/placeholder-product.svg'}
                              alt={product.name}
                              className="h-full w-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.svg' }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium max-w-[200px]">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {typeof product.category === 'object' && 'name' in product.category
                          ? (product.category as { name: string }).name
                          : '—'}
                      </td>
                      <td className="px-5 py-3 text-right font-medium">{formatCLP(product.price)}</td>
                      <td className="px-5 py-3 text-right">
                        <span className={
                          product.stock === 0 ? 'text-destructive font-medium' :
                          product.stock <= 5 ? 'text-amber-600 font-medium' : ''
                        }>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <Badge variant={product.isActive ? 'default' : 'secondary'} className="text-xs">
                          {product.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(product)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          {product.isActive ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs text-destructive hover:text-destructive"
                              onClick={() => setConfirmTarget(product)}
                            >
                              Desactivar
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs text-primary hover:text-primary"
                              disabled={activateMutation.isPending}
                              onClick={() => activateMutation.mutate(product._id)}
                            >
                              Activar
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Paginación */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Página {page} de {totalPages}
              {pagination && ` · ${pagination.total} productos`}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmación para desactivar */}
      <ConfirmDialog
        open={!!confirmTarget}
        onOpenChange={(open) => { if (!open) setConfirmTarget(null) }}
        title="¿Desactivar producto?"
        description={`"${confirmTarget?.name}" dejará de mostrarse en el catálogo. Puedes volver a activarlo en cualquier momento.`}
        confirmLabel="Desactivar"
        variant="destructive"
        isLoading={deactivateMutation.isPending}
        onConfirm={() => confirmTarget && deactivateMutation.mutate(confirmTarget._id)}
      />

      {/* Formulario de producto */}
      <ProductForm
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editingProduct}
      />
    </>
  )
}
