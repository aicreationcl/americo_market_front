import type { Cart } from '@/types'
import { MOCK_PRODUCTS } from './products.mock'

const [arroz, , , , , , cocaCola, agua, , , leche] = MOCK_PRODUCTS

export const MOCK_CART: Cart = {
  _id: 'cart-demo-1',
  sessionId: 'mock-session-uuid-1234',
  items: [
    { product: leche._id, name: leche.name, price: leche.price, imageUrl: leche.images?.[0]?.url ?? '', quantity: 3, sku: leche.sku, subtotal: leche.price * 3 },
    { product: arroz._id, name: arroz.name, price: arroz.price, imageUrl: arroz.images?.[0]?.url ?? '', quantity: 2, sku: arroz.sku, subtotal: arroz.price * 2 },
    { product: cocaCola._id, name: cocaCola.name, price: cocaCola.price, imageUrl: cocaCola.images?.[0]?.url ?? '', quantity: 4, sku: cocaCola.sku, subtotal: cocaCola.price * 4 },
    { product: agua._id, name: agua.name, price: agua.price, imageUrl: agua.images?.[0]?.url ?? '', quantity: 6, sku: agua.sku, subtotal: agua.price * 6 },
  ],
  subtotal: leche.price * 3 + arroz.price * 2 + cocaCola.price * 4 + agua.price * 6,
  itemCount: 15,
}

export const MOCK_EMPTY_CART: Cart = {
  _id: 'cart-demo-empty',
  sessionId: 'mock-session-uuid-empty',
  items: [],
  subtotal: 0,
  itemCount: 0,
}
