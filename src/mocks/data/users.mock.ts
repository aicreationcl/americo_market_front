import type { User } from '@/types'

export const MOCK_USERS: User[] = [
  {
    _id: 'user-1',
    name: 'María González',
    email: 'maria.gonzalez@gmail.com',
    role: 'customer',
    phone: '+56912345678',
    addresses: [
      {
        _id: 'addr-1',
        alias: 'Casa',
        street: 'Av. Providencia',
        number: '1234',
        commune: 'Providencia',
        region: 'Región Metropolitana',
        additionalInfo: 'Dto 5B, edificio color beige',
        isDefault: true,
      },
      {
        _id: 'addr-2',
        alias: 'Trabajo',
        street: 'Av. Andrés Bello',
        number: '2800',
        commune: 'Las Condes',
        region: 'Región Metropolitana',
        isDefault: false,
      },
    ],
    createdAt: '2024-11-15T10:30:00.000Z',
  },
  {
    _id: 'user-2',
    name: 'Carlos Rojas',
    email: 'carlos.rojas@outlook.com',
    role: 'customer',
    phone: '+56987654321',
    addresses: [
      {
        _id: 'addr-3',
        alias: 'Departamento',
        street: 'Calle Larga',
        number: '456',
        commune: 'Ñuñoa',
        region: 'Región Metropolitana',
        additionalInfo: 'Cerca de la Plaza Ñuñoa',
        isDefault: true,
      },
    ],
    createdAt: '2025-01-20T14:00:00.000Z',
  },
  {
    _id: 'user-admin-1',
    name: 'Administrador AMERICO',
    email: 'admin@americominimarket.cl',
    role: 'admin',
    phone: '+56922334455',
    addresses: [],
    createdAt: '2024-06-01T08:00:00.000Z',
  },
]

export const MOCK_CUSTOMER = MOCK_USERS[0]
export const MOCK_ADMIN = MOCK_USERS[2]
