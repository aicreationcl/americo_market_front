import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { AnimatePresence } from 'framer-motion'
import { ShoppingBag, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CartItem } from '@/components/cart/CartItem'
import { CartSummary } from '@/components/cart/CartSummary'
import { useCartStore } from '@/store/cartStore'
import { useCart } from '@/hooks/useCart'

export default function CartPage() {
  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore((s) => s.subtotal)
  const { clearCart } = useCart()
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const navigate = useNavigate()

  const handleClear = async () => {
    try {
      await clearCart()
      setClearDialogOpen(false)
      toast.success('Carrito vaciado')
    } catch {
      toast.error('No se pudo vaciar el carrito')
    }
  }

  if (items.length === 0) {
    return (
      <>
        <Helmet><title>Mi carrito</title></Helmet>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="rounded-full bg-muted p-6">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Tu carrito está vacío</h1>
          <p className="mt-2 text-muted-foreground">Explora el catálogo y agrega productos</p>
          <Button className="mt-6" asChild>
            <Link to="/catalogo">Ver catálogo</Link>
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet><title>Mi carrito</title></Helmet>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Mi carrito</h1>
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setClearDialogOpen(true)}>
            <Trash2 className="mr-1.5 h-4 w-4" />
            Vaciar carrito
          </Button>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Items */}
          <div className="flex-1">
            <AnimatePresence>
              {items.map((item) => (
                <div key={item._id}>
                  <CartItem item={item} />
                  <Separator />
                </div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="w-full lg:w-80">
            <div className="sticky top-24 rounded-xl border border-border p-5">
              <CartSummary subtotal={subtotal} />
              <div className="mt-4 flex flex-col gap-2">
                <Button size="lg" className="w-full" onClick={() => navigate('/checkout')}>
                  Proceder al pago
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/catalogo">Seguir comprando</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Vaciar carrito?</DialogTitle>
            <DialogDescription>Se eliminarán todos los productos del carrito. Esta acción no se puede deshacer.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClearDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleClear}>Vaciar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
