import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Store } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <>
      <Helmet><title>Página no encontrada</title></Helmet>

      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Store className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-foreground">404</h1>
        <h2 className="mt-2 text-xl font-semibold">Página no encontrada</h2>
        <p className="mt-3 max-w-sm text-muted-foreground">
          La página que buscas no existe o fue movida. Vuelve al inicio para seguir comprando.
        </p>
        <div className="mt-8 flex gap-3">
          <Button asChild>
            <Link to="/">Ir al inicio</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/catalogo">Ver catálogo</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
