import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Store, User, ShoppingCart, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/store/authStore'
import { useCategories } from '@/hooks/useCategories'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)
  const { data: categories } = useCategories()

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 flex w-80 flex-col bg-background shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-4">
              <Link to="/" className="flex items-center gap-2" onClick={onClose}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Store className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold tracking-tight">AMERICO</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
              <div className="space-y-1">
                <Link to="/" onClick={onClose} className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted transition-colors">
                  Inicio
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
                <Link to="/catalogo" onClick={onClose} className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted transition-colors">
                  Todo el catálogo
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
                <Link to="/carrito" onClick={onClose} className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted transition-colors">
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" /> Mi carrito
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </div>

              {categories && categories.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categorías</p>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat._id}
                        to={`/catalogo/${cat.slug}`}
                        onClick={onClose}
                        className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm hover:bg-muted transition-colors"
                      >
                        {cat.name}
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </nav>

            {/* Footer */}
            <div className="border-t border-border p-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user?.name}</p>
                    <Link to="/mi-cuenta" onClick={onClose} className="text-xs text-primary hover:underline">
                      Ver mi cuenta
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to="/login" onClick={onClose}>Ingresar</Link>
                  </Button>
                  <Button className="flex-1" asChild>
                    <Link to="/registro" onClick={onClose}>Registrarse</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
