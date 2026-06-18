export interface ShippingZone {
  _id: string
  commune: string
  region: string
  baseCost: number
  freeShippingThreshold?: number
  isActive: boolean
}

export interface ShippingCalculation {
  commune: string
  cost: number
  isFree: boolean
  freeThreshold?: number
  estimatedDays: number
}

export interface PickupStore {
  _id: string
  name: string
  address: string
  commune: string
  phone: string
  schedule: string
}
