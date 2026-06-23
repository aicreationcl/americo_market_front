export interface Address {
  _id: string
  alias: string
  street: string
  number: string
  commune: string
  region: string
  additionalInfo?: string
  isDefault: boolean
}

export interface User {
  _id: string
  name: string
  email: string
  role: 'customer' | 'admin'
  phone?: string
  profileImage?: string
  addresses?: Address[]
  createdAt: string
}
