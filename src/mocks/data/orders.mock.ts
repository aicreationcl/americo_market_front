import type { Order } from '@/types'
import { MOCK_PRODUCTS } from './products.mock'

const [arroz, fideos, aceite, , , , cocaCola, agua, , , leche, , queso, huevos] = MOCK_PRODUCTS

export const MOCK_ORDERS: Order[] = [
  {
    _id: 'order-1',
    orderNumber: 'AMR-20250115-001',
    status: 'delivered',
    customerData: { name: 'María González', email: 'maria.gonzalez@gmail.com', phone: '+56912345678' },
    fulfillmentData: {
      type: 'delivery',
      shippingCost: 0,
      address: { street: 'Av. Providencia', number: '1234', commune: 'Providencia', additionalInfo: 'Dto 5B, frente al Jumbo' },
    },
    items: [
      { product: arroz._id, name: arroz.name, sku: arroz.sku, price: arroz.price, quantity: 2, imageUrl: arroz.images?.[0]?.url ?? '', subtotal: arroz.price * 2 },
      { product: leche._id, name: leche.name, sku: leche.sku, price: leche.price, quantity: 3, imageUrl: leche.images?.[0]?.url ?? '', subtotal: leche.price * 3 },
      { product: huevos._id, name: huevos.name, sku: huevos.sku, price: huevos.price, quantity: 1, imageUrl: huevos.images?.[0]?.url ?? '', subtotal: huevos.price },
    ],
    subtotal: arroz.price * 2 + leche.price * 3 + huevos.price,
    total: arroz.price * 2 + leche.price * 3 + huevos.price,
    statusHistory: [{ status: 'delivered', changedAt: '2025-01-15T14:30:00.000Z' }],
    createdAt: '2025-01-15T11:00:00.000Z',
    updatedAt: '2025-01-15T14:30:00.000Z',
  },
  {
    _id: 'order-2',
    orderNumber: 'AMR-20250310-042',
    status: 'in_transit',
    customerData: { name: 'Carlos Rojas', email: 'carlos.rojas@outlook.com', phone: '+56987654321' },
    fulfillmentData: {
      type: 'delivery',
      shippingCost: 2490,
      address: { street: 'Calle Larga', number: '456', commune: 'Ñuñoa', additionalInfo: 'Cerca de la Plaza Ñuñoa' },
    },
    items: [
      { product: cocaCola._id, name: cocaCola.name, sku: cocaCola.sku, price: cocaCola.price, quantity: 2, imageUrl: cocaCola.images?.[0]?.url ?? '', subtotal: cocaCola.price * 2 },
      { product: fideos._id, name: fideos.name, sku: fideos.sku, price: fideos.price, quantity: 4, imageUrl: fideos.images?.[0]?.url ?? '', subtotal: fideos.price * 4 },
      { product: queso._id, name: queso.name, sku: queso.sku, price: queso.price, quantity: 1, imageUrl: queso.images?.[0]?.url ?? '', subtotal: queso.price },
      { product: agua._id, name: agua.name, sku: agua.sku, price: agua.price, quantity: 6, imageUrl: agua.images?.[0]?.url ?? '', subtotal: agua.price * 6 },
    ],
    subtotal: cocaCola.price * 2 + fideos.price * 4 + queso.price + agua.price * 6,
    total: cocaCola.price * 2 + fideos.price * 4 + queso.price + agua.price * 6 + 2490,
    statusHistory: [{ status: 'in_transit', changedAt: '2025-03-10T13:20:00.000Z' }],
    createdAt: '2025-03-10T09:45:00.000Z',
    updatedAt: '2025-03-10T13:20:00.000Z',
  },
  {
    _id: 'order-3',
    orderNumber: 'AMR-20250410-078',
    status: 'preparing',
    customerData: { name: 'Pedro Sánchez', email: 'pedro.sanchez@gmail.com', phone: '+56933221100' },
    fulfillmentData: { type: 'pickup', shippingCost: 0 },
    items: [
      { product: aceite._id, name: aceite.name, sku: aceite.sku, price: aceite.price, quantity: 1, imageUrl: aceite.images?.[0]?.url ?? '', subtotal: aceite.price },
      { product: arroz._id, name: arroz.name, sku: arroz.sku, price: arroz.price, quantity: 5, imageUrl: arroz.images?.[0]?.url ?? '', subtotal: arroz.price * 5 },
      { product: huevos._id, name: huevos.name, sku: huevos.sku, price: huevos.price, quantity: 2, imageUrl: huevos.images?.[0]?.url ?? '', subtotal: huevos.price * 2 },
    ],
    subtotal: aceite.price + arroz.price * 5 + huevos.price * 2,
    total: aceite.price + arroz.price * 5 + huevos.price * 2,
    statusHistory: [{ status: 'preparing', changedAt: '2025-04-10T16:25:00.000Z' }],
    createdAt: '2025-04-10T16:20:00.000Z',
    updatedAt: '2025-04-10T16:25:00.000Z',
  },
  {
    _id: 'order-4',
    orderNumber: 'AMR-20250618-099',
    status: 'pending_payment',
    customerData: { name: 'Ana Torres', email: 'ana.torres@icloud.com', phone: '+56966778899' },
    fulfillmentData: {
      type: 'delivery',
      shippingCost: 1990,
      address: { street: 'Los Leones', number: '890', commune: 'Las Condes' },
    },
    items: [
      { product: leche._id, name: leche.name, sku: leche.sku, price: leche.price, quantity: 6, imageUrl: leche.images?.[0]?.url ?? '', subtotal: leche.price * 6 },
      { product: cocaCola._id, name: cocaCola.name, sku: cocaCola.sku, price: cocaCola.price, quantity: 4, imageUrl: cocaCola.images?.[0]?.url ?? '', subtotal: cocaCola.price * 4 },
    ],
    subtotal: leche.price * 6 + cocaCola.price * 4,
    total: leche.price * 6 + cocaCola.price * 4 + 1990,
    statusHistory: [{ status: 'pending_payment', changedAt: '2025-06-18T08:00:00.000Z' }],
    createdAt: '2025-06-18T08:00:00.000Z',
    updatedAt: '2025-06-18T08:00:00.000Z',
  },
]
