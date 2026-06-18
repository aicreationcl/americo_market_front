export interface Address {
  _id?: string
  label?: string
  street: string
  number: string
  apartment?: string
  commune: string
  references?: string
  isDefault?: boolean
}

export interface User {
  _id: string
  name: string
  email: string
  role: 'customer' | 'admin'
  phone?: string
  addresses?: Address[]
  createdAt: string
}
