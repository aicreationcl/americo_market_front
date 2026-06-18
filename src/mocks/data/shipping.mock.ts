import type { ShippingZone, ShippingCalculation, PickupStore } from '@/types'

export const MOCK_SHIPPING_ZONES: ShippingZone[] = [
  { _id: 'sz-1', commune: 'Providencia', region: 'Metropolitana', baseCost: 0, freeShippingThreshold: 15000, isActive: true },
  { _id: 'sz-2', commune: 'Ñuñoa', region: 'Metropolitana', baseCost: 0, freeShippingThreshold: 15000, isActive: true },
  { _id: 'sz-3', commune: 'Santiago', region: 'Metropolitana', baseCost: 1490, freeShippingThreshold: 20000, isActive: true },
  { _id: 'sz-4', commune: 'Las Condes', region: 'Metropolitana', baseCost: 1990, freeShippingThreshold: 25000, isActive: true },
  { _id: 'sz-5', commune: 'Vitacura', region: 'Metropolitana', baseCost: 1990, freeShippingThreshold: 25000, isActive: true },
  { _id: 'sz-6', commune: 'Lo Barnechea', region: 'Metropolitana', baseCost: 2490, freeShippingThreshold: 30000, isActive: true },
  { _id: 'sz-7', commune: 'La Reina', region: 'Metropolitana', baseCost: 1990, freeShippingThreshold: 25000, isActive: true },
  { _id: 'sz-8', commune: 'Macul', region: 'Metropolitana', baseCost: 1490, freeShippingThreshold: 20000, isActive: true },
  { _id: 'sz-9', commune: 'San Miguel', region: 'Metropolitana', baseCost: 1490, freeShippingThreshold: 20000, isActive: true },
  { _id: 'sz-10', commune: 'La Florida', region: 'Metropolitana', baseCost: 1990, freeShippingThreshold: 25000, isActive: true },
  { _id: 'sz-11', commune: 'Peñalolén', region: 'Metropolitana', baseCost: 1990, freeShippingThreshold: 25000, isActive: true },
  { _id: 'sz-12', commune: 'La Granja', region: 'Metropolitana', baseCost: 1490, freeShippingThreshold: 20000, isActive: true },
  { _id: 'sz-13', commune: 'San Joaquín', region: 'Metropolitana', baseCost: 1490, freeShippingThreshold: 20000, isActive: true },
  { _id: 'sz-14', commune: 'Recoleta', region: 'Metropolitana', baseCost: 990, freeShippingThreshold: 15000, isActive: true },
  { _id: 'sz-15', commune: 'Independencia', region: 'Metropolitana', baseCost: 990, freeShippingThreshold: 15000, isActive: true },
  { _id: 'sz-16', commune: 'Conchalí', region: 'Metropolitana', baseCost: 1490, freeShippingThreshold: 20000, isActive: true },
  { _id: 'sz-17', commune: 'Huechuraba', region: 'Metropolitana', baseCost: 1990, freeShippingThreshold: 25000, isActive: true },
  { _id: 'sz-18', commune: 'Quilicura', region: 'Metropolitana', baseCost: 2490, freeShippingThreshold: 30000, isActive: true },
  { _id: 'sz-19', commune: 'Pudahuel', region: 'Metropolitana', baseCost: 2490, freeShippingThreshold: 30000, isActive: true },
  { _id: 'sz-20', commune: 'Maipú', region: 'Metropolitana', baseCost: 2490, freeShippingThreshold: 30000, isActive: true },
  { _id: 'sz-21', commune: 'Cerrillos', region: 'Metropolitana', baseCost: 1990, freeShippingThreshold: 25000, isActive: true },
  { _id: 'sz-22', commune: 'Estación Central', region: 'Metropolitana', baseCost: 990, freeShippingThreshold: 15000, isActive: true },
  { _id: 'sz-23', commune: 'Cerro Navia', region: 'Metropolitana', baseCost: 1990, freeShippingThreshold: 25000, isActive: true },
  { _id: 'sz-24', commune: 'Lo Prado', region: 'Metropolitana', baseCost: 1490, freeShippingThreshold: 20000, isActive: true },
  { _id: 'sz-25', commune: 'Renca', region: 'Metropolitana', baseCost: 1990, freeShippingThreshold: 25000, isActive: true },
]

export const MOCK_COMMUNES = MOCK_SHIPPING_ZONES.map((z) => z.commune).sort()

export function getMockShippingCalculation(commune: string, subtotal: number): ShippingCalculation {
  const zone = MOCK_SHIPPING_ZONES.find((z) => z.commune === commune)
  if (!zone) {
    return { commune, cost: 3490, isFree: false, freeThreshold: undefined, estimatedDays: 3 }
  }
  const threshold = zone.freeShippingThreshold ?? Infinity
  const isFree = subtotal >= threshold
  return {
    commune,
    cost: isFree ? 0 : zone.baseCost,
    isFree,
    freeThreshold: zone.freeShippingThreshold,
    estimatedDays: 1,
  }
}

export const MOCK_PICKUP_STORE: PickupStore = {
  _id: 'store-1',
  name: 'AMERICO Minimarket',
  address: 'Av. Providencia 1850',
  commune: 'Providencia',
  phone: '+56222334455',
  schedule: 'Lun–Sáb 8:00–21:00 | Dom 9:00–19:00',
}
