import { Helmet } from 'react-helmet-async'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MOCK_PRODUCTS } from '@/mocks/data/products.mock'
import { formatCLP } from '@/utils/formatCLP'

export default function AdminProducts() {
  return (
    <>
      <Helmet><title>Productos</title></Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Productos</h1>
            <p className="mt-1 text-sm text-muted-foreground">{MOCK_PRODUCTS.length} productos en catálogo (demo)</p>
          </div>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo producto
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-background overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
                  <th className="px-5 py-3">Producto</th>
                  <th className="px-5 py-3">Categoría</th>
                  <th className="px-5 py-3 text-right">Precio</th>
                  <th className="px-5 py-3 text-right">Stock</th>
                  <th className="px-5 py-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_PRODUCTS.map((product) => (
                  <tr key={product._id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                          <img
                            src={product.images?.[0]?.url || '/placeholder-product.jpg'}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium max-w-[200px]">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{product.category.name}</td>
                    <td className="px-5 py-3 text-right font-medium">{formatCLP(product.price)}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={product.stock === 0 ? 'text-destructive font-medium' : product.stock <= 5 ? 'text-amber-600 font-medium' : ''}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <Badge variant={product.isActive ? 'default' : 'secondary'} className="text-xs">
                        {product.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
