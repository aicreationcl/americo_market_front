import type { Cart } from '@/types'
import { MOCK_PRODUCTS } from './products.mock'

const [arroz, , , , , , cocaCola, agua, , , leche] = MOCK_PRODUCTS

export const MOCK_CART: Cart = {
  _id: 'cart-demo-1',
  sessionId: 'mock-session-uuid-1234',
  items: [
    { _id: 'ci-1', product: leche, quantity: 3, price: leche.price, subtotal: leche.price * 3 },
    { _id: 'ci-2', product: arroz, quantity: 2, price: arroz.price, subtotal: arroz.price * 2 },
    { _id: 'ci-3', product: cocaCola, quantity: 4, price: cocaCola.price, subtotal: cocaCola.price * 4 },
    { _id: 'ci-4', product: agua, quantity: 6, price: agua.price, subtotal: agua.price * 6 },
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
