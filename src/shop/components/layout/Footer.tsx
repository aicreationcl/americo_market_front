import { Link } from 'react-router-dom'
import { Store, MapPin, Phone, Clock, AtSign, Share2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  return (
    <footer className="border-t border-border bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Store className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">AMERICO</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tu minimarket de confianza en Santiago. Productos frescos, buen precio y envío rápido a tu domicilio.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <AtSign className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Share2 className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categorías */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Categorías</h3>
            <ul className="space-y-2">
              {['Abarrotes', 'Bebidas', 'Lácteos', 'Carnes', 'Frutas y Verduras'].map((cat) => (
                <li key={cat}>
                  <Link to={`/catalogo?search=${cat}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/catalogo" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  Ver todo →
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Información</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/pedido/seguimiento" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Seguir mi pedido
                </Link>
              </li>
              <li>
                <Link to="/politica-envios" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Política de envíos
                </Link>
              </li>
              <li>
                <Link to="/terminos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>Av. Ejemplo 1234, Santiago Centro, RM</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span>+56 2 2345 6789</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>Lun–Sáb: 08:00–21:00<br />Dom: 09:00–19:00</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AMERICO Minimarket. Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Pagos seguros · Despacho en Santiago RM
          </p>
        </div>
      </div>
    </footer>
  )
}
