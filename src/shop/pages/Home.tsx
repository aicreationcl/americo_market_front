import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ShoppingCart, ArrowRight, Truck, Clock, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryPills } from '@/shop/components/catalog/CategoryPills'
import { ProductGrid } from '@/shop/components/catalog/ProductGrid'
import { useFeaturedProducts } from '@/shop/hooks/useProducts'

export default function Home() {
  const { data: featured, isLoading } = useFeaturedProducts()

  return (
    <>
      <Helmet>
        <title>AMERICO Minimarket | Compra en línea</title>
        <meta name="description" content="Compra en AMERICO Minimarket. Productos frescos, abarrotes, bebidas y más. Envío a domicilio en Santiago." />
      </Helmet>

      {/* Hero */}
      <section className="relative bg-stone-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Minimarket online
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              Todo lo que necesitas,{' '}
              <span className="text-primary">a tu puerta</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Abarrotes, bebidas, lácteos y más. Despacho a domicilio en toda la Región Metropolitana o retira en nuestra tienda.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/catalogo">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Ver catálogo
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/pedido/seguimiento">
                  Seguir mi pedido <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Beneficios */}
        <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: Truck, title: 'Envío rápido', desc: 'Despacho en todo Santiago RM' },
              { icon: Clock, title: 'Horario extendido', desc: 'Lun–Sáb 08:00–21:00' },
              { icon: ShieldCheck, title: 'Pago seguro', desc: 'Contra entrega o en tienda' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3 rounded-xl border border-border bg-background p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Explora por categoría</h2>
            <Link to="/catalogo" className="text-sm font-medium text-primary hover:underline">
              Ver todo →
            </Link>
          </div>
          <CategoryPills />
        </div>
      </section>

      {/* Productos destacados */}
      <section className="py-8 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Productos destacados</h2>
            <Link to="/catalogo" className="text-sm font-medium text-primary hover:underline">
              Ver todos →
            </Link>
          </div>
          <ProductGrid products={featured} isLoading={isLoading} />
        </div>
      </section>
    </>
  )
}
