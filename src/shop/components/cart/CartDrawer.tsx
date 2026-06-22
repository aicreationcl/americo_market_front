import { AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CartItem } from './CartItem'
import { CartSummary } from './CartSummary'
import { useUIStore } from '@/store/uiStore'
import { useCartStore } from '@/store/cartStore'
import { formatCLP } from '@/utils/formatCLP'

export function CartDrawer() {
  const isOpen = useUIStore((s) => s.isCartOpen)
  const closeCart = useUIStore((s) => s.closeCart)
  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore((s) => s.subtotal)
  const itemCount = useCartStore((s) => s.itemCount)

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && closeCart()}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md p-0">
        <SheetHeader className="border-b border-border p-4">
          <SheetTitle className="flex items-center gap-2">
            Carrito
            {itemCount > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="rounded-full bg-muted p-5">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Tu carrito está vacío</p>
              <p className="mt-1 text-sm text-muted-foreground">Agrega productos para comenzar</p>
            </div>
            <Button asChild onClick={closeCart}>
              <Link to="/catalogo">Ver catálogo</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              <AnimatePresence>
                {items.map((item) => (
                  <div key={item.product}>
                    <CartItem item={item} />
                    <Separator />
                  </div>
                ))}
              </AnimatePresence>
            </div>

            <div className="border-t border-border p-4 space-y-4">
              <CartSummary subtotal={subtotal} />
              <div className="flex flex-col gap-2">
                <Button asChild onClick={closeCart}>
                  <Link to="/checkout">
                    Proceder al pago · {formatCLP(subtotal)}
                  </Link>
                </Button>
                <Button variant="outline" asChild onClick={closeCart}>
                  <Link to="/carrito">Ver carrito completo</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
