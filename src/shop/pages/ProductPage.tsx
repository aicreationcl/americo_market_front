import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ChevronRight, ShoppingCart, CheckCircle, AlertCircle, Minus, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { useProduct } from '@/shop/hooks/useProduct'
import { useCart } from '@/shop/hooks/useCart'
import { useUIStore } from '@/store/uiStore'
import { formatCLP } from '@/utils/formatCLP'

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: product, isLoading, error } = useProduct(slug!)
  const [qty, setQty] = useState(1)
  const [selectedImg, setSelectedImg] = useState(0)
  const { addItem, isAddingItem } = useCart()
  const openCart = useUIStore((s) => s.openCart)

  const handleAddToCart = async () => {
    if (!product) return
    try {
      await addItem({ productId: product._id, quantity: qty })
      toast.success(`${product.name} agregado al carrito`)
      openCart()
    } catch {
      toast.error('No se pudo agregar al carrito')
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-bold">Producto no encontrado</h2>
        <Button className="mt-4" asChild><Link to="/catalogo">Volver al catálogo</Link></Button>
      </div>
    )
  }

  const hasDiscount = !!product.compareAtPrice && product.compareAtPrice > product.price
  const inStock = product.stock > 0
  const images = product.images?.length ? product.images : [{ url: '/placeholder-product.svg', alt: product.name }]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: images[0]?.url,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'CLP',
      price: product.price,
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  }

  return (
    <>
      <Helmet>
        <title>{product.name}</title>
        <meta name="description" content={product.shortDescription || product.description || `Compra ${product.name} en AMERICO Minimarket`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Inicio</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to={`/catalogo/${product.category?.slug}`} className="hover:text-foreground">{product.category?.name}</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="overflow-hidden rounded-xl bg-stone-100">
              <img
                src={images[selectedImg]?.url}
                alt={images[selectedImg]?.alt || product.name}
                className="aspect-square w-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${i === selectedImg ? 'border-primary' : 'border-transparent'}`}
                  >
                    <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-5">
            <div>
              {product.brand && <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{product.brand}</p>}
              <h1 className="mt-1 text-2xl font-bold leading-tight">{product.name}</h1>
              <p className="mt-1 text-xs text-muted-foreground">SKU: {product.sku}</p>
            </div>

            {/* Price */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{formatCLP(product.price)}</span>
                {hasDiscount && (
                  <span className="text-lg text-muted-foreground line-through">{formatCLP(product.compareAtPrice!)}</span>
                )}
              </div>
              {hasDiscount && (
                <Badge variant="destructive" className="mt-1">
                  {Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)}% off
                </Badge>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {inStock ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">{product.stock > 10 ? 'Disponible' : `Solo ${product.stock} en stock`}</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Sin stock</span>
                </>
              )}
            </div>

            <Separator />

            {/* Qty + Add */}
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-border">
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQty((q) => Math.min(product.stock, q + 1))} disabled={!inStock}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button className="flex-1" size="lg" disabled={!inStock || isAddingItem} onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                {inStock ? 'Agregar al carrito' : 'Sin stock'}
              </Button>
            </div>

            {/* Description */}
            {(product.description || product.shortDescription) && (
              <>
                <Separator />
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Descripción</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {product.description || product.shortDescription}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
