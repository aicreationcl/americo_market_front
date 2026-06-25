import { motion, AnimatePresence } from 'framer-motion'
import { Truck, Store } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { FulfillmentType } from '@/types'

interface DeliverySelectorProps {
  value: FulfillmentType
  onChange: (value: FulfillmentType) => void
  addressContent?: React.ReactNode
  pickupContent?: React.ReactNode
}

export function DeliverySelector({ value, onChange, addressContent, pickupContent }: DeliverySelectorProps) {
  return (
    <div className="space-y-4">
      <RadioGroup value={value} onValueChange={(v) => onChange(v as FulfillmentType)} className="grid grid-cols-2 gap-3">
        <Label
          htmlFor="delivery"
          className={cn(
            'flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors',
            value === 'delivery' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          )}
        >
          <RadioGroupItem value="delivery" id="delivery" className="sr-only" />
          <Truck className={cn('h-6 w-6', value === 'delivery' ? 'text-primary' : 'text-muted-foreground')} />
          <span className="text-sm font-medium">Envío a domicilio</span>
        </Label>
        <Label
          htmlFor="pickup"
          className={cn(
            'flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors',
            value === 'pickup' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          )}
        >
          <RadioGroupItem value="pickup" id="pickup" className="sr-only" />
          <Store className={cn('h-6 w-6', value === 'pickup' ? 'text-primary' : 'text-muted-foreground')} />
          <span className="text-sm font-medium">Retiro en tienda</span>
        </Label>
      </RadioGroup>

      <AnimatePresence mode="wait">
        {value === 'delivery' && addressContent && (
          <motion.div
            key="delivery"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {addressContent}
          </motion.div>
        )}
        {value === 'pickup' && (
          <motion.div
            key="pickup"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {pickupContent || (
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-sm font-medium">Tienda AMERICO</p>
                <p className="mt-1 text-sm text-muted-foreground">Sgto. Daniel Rebolledo 0739, La Pintana</p>
                <p className="text-sm text-muted-foreground">Lun–Sáb: 08:00–21:00 · Dom: 09:00–19:00</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
