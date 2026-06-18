import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DeliverySelector } from '@/components/checkout/DeliverySelector'
import { GuestInfoForm } from '@/components/checkout/GuestInfoForm'
import { AddressForm } from '@/components/checkout/AddressForm'
import { ShippingCostDisplay } from '@/components/checkout/ShippingCostDisplay'
import { OrderSummary } from '@/components/checkout/OrderSummary'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useShipping } from '@/hooks/useShipping'
import { useCreateOrder } from '@/hooks/useOrders'
import type { FulfillmentType } from '@/types'
import type { GuestInfoData } from '@/components/checkout/GuestInfoForm'
import type { AddressData } from '@/components/checkout/AddressForm'

const STEPS = ['Revisar pedido', 'Entrega', 'Confirmar']

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore((s) => s.subtotal)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)
  const createOrder = useCreateOrder()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [fulfillment, setFulfillment] = useState<FulfillmentType>('delivery')
  const [guestInfo, setGuestInfo] = useState<GuestInfoData | null>(null)
  const [address, setAddress] = useState<AddressData | null>(null)
  const [addressValid, setAddressValid] = useState(false)

  const commune = fulfillment === 'delivery' ? (address?.commune || '') : ''
  const { data: shipping } = useShipping(commune, subtotal)
  const shippingCost = fulfillment === 'pickup' ? 0 : (shipping?.cost ?? undefined)

  if (items.length === 0) return <Navigate to="/catalogo" replace />

  const canProceed = () => {
    if (step === 0) return true
    if (step === 1) {
      const contactOk = isAuthenticated || !!guestInfo
      if (fulfillment === 'delivery') return contactOk && addressValid
      return contactOk
    }
    return true
  }

  const handleConfirm = async () => {
    try {
      const payload = {
        fulfillmentType: fulfillment,
        ...(isAuthenticated
          ? {}
          : { guestName: guestInfo?.name, guestEmail: guestInfo?.email, guestPhone: guestInfo?.phone }),
        ...(fulfillment === 'delivery' && address
          ? { deliveryAddress: address }
          : {}),
      }
      const result = await createOrder.mutateAsync(payload)
      navigate(`/pedido/confirmacion/${result.orderId}`, {
        state: { orderNumber: result.orderNumber, total: result.total, email: guestInfo?.email || user?.email },
      })
    } catch {
      toast.error('No se pudo crear el pedido. Intenta nuevamente.')
    }
  }

  return (
    <>
      <Helmet><title>Checkout</title></Helmet>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Stepper */}
        <div className="mb-8 flex items-center justify-center gap-0">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${i < step ? 'bg-primary text-primary-foreground' : i === step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`ml-2 text-sm font-medium ${i === step ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
              {i < STEPS.length - 1 && <Separator orientation="horizontal" className="mx-4 w-12" />}
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {step === 0 && (
                <div>
                  <h2 className="mb-4 text-lg font-semibold">Revisión del pedido</h2>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item._id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                          <img src={item.product.images?.[0]?.url || '/placeholder-product.jpg'} alt={item.product.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">× {item.quantity}</p>
                        </div>
                        <p className="text-sm font-bold">{item.subtotal.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 })}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  {!isAuthenticated && (
                    <div>
                      <h2 className="mb-4 text-lg font-semibold">Datos de contacto</h2>
                      <GuestInfoForm onDataChange={setGuestInfo} />
                    </div>
                  )}
                  <div>
                    <h2 className="mb-4 text-lg font-semibold">Método de entrega</h2>
                    <DeliverySelector
                      value={fulfillment}
                      onChange={setFulfillment}
                      addressContent={
                        <div className="space-y-3">
                          <AddressForm onDataChange={(data, valid) => { setAddress(data); setAddressValid(valid) }} />
                          {address?.commune && <ShippingCostDisplay commune={address.commune} />}
                        </div>
                      }
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="mb-4 text-lg font-semibold">Confirmar pedido</h2>
                  <div className="rounded-xl border border-border p-4 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Entrega</span>
                      <span className="font-medium">{fulfillment === 'delivery' ? `Envío a ${address?.commune}` : 'Retiro en tienda'}</span>
                    </div>
                    {!isAuthenticated && guestInfo && (
                      <>
                        <div className="flex justify-between"><span className="text-muted-foreground">Nombre</span><span>{guestInfo.name}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{guestInfo.email}</span></div>
                      </>
                    )}
                    <Separator />
                    <p className="text-xs text-muted-foreground text-center">Método de pago: <strong>Efectivo al recibir</strong></p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <OrderSummary shippingCost={shippingCost} commune={address?.commune} />
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
            ← Anterior
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}>
              Continuar →
            </Button>
          ) : (
            <Button onClick={handleConfirm} disabled={createOrder.isPending || !canProceed()}>
              {createOrder.isPending ? 'Procesando...' : 'Confirmar pedido'}
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
