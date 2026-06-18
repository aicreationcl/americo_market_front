import type { QueryClient } from '@tanstack/react-query'
import { MOCK_CATEGORIES } from './data/categories.mock'
import { MOCK_PRODUCTS, MOCK_FEATURED_PRODUCTS } from './data/products.mock'
import { MOCK_CART } from './data/cart.mock'
import { MOCK_ORDERS } from './data/orders.mock'
import { MOCK_COMMUNES, MOCK_SHIPPING_ZONES, MOCK_PICKUP_STORE, getMockShippingCalculation } from './data/shipping.mock'

// Pre-populates TanStack Query cache so all hooks serve mock data
// without modifying any existing API or hook file.
// Activated by adding VITE_USE_MOCKS=true to .env.local
export function setupMocks(queryClient: QueryClient): void {
  // Categories
  queryClient.setQueryData(['categories'], MOCK_CATEGORIES)

  // Products — key must match exactly what useProducts builds: ['products', filters]
  // Catalog.tsx passes { search: '', page: 1, limit: 20 }
  queryClient.setQueryData(
    ['products', { search: '', page: 1, limit: 20 }],
    { data: MOCK_PRODUCTS, total: MOCK_PRODUCTS.length, page: 1, limit: 20, totalPages: 1 }
  )
  queryClient.setQueryData(['products', 'featured'], MOCK_FEATURED_PRODUCTS)

  // Per-category — CategoryPage.tsx passes { category: slug, search: '', page: 1, limit: 20 }
  const categorySlugs = ['abarrotes', 'bebidas', 'lacteos', 'carnes', 'frutas-y-verduras', 'limpieza', 'snacks']
  for (const slug of categorySlugs) {
    const items = MOCK_PRODUCTS.filter((p) => p.category.slug === slug)
    queryClient.setQueryData(
      ['products', { category: slug, search: '', page: 1, limit: 20 }],
      { data: items, total: items.length, page: 1, limit: 20, totalPages: 1 }
    )
  }

  // Individual products by slug
  for (const product of MOCK_PRODUCTS) {
    queryClient.setQueryData(['product', product.slug], product)
  }

  // Cart
  queryClient.setQueryData(['cart'], MOCK_CART)

  // Shipping
  queryClient.setQueryData(['communes'], MOCK_COMMUNES)
  queryClient.setQueryData(['shipping-zones'], MOCK_SHIPPING_ZONES)
  queryClient.setQueryData(['pickup-store'], MOCK_PICKUP_STORE)

  // Pre-calculated shipping costs for common communes
  for (const commune of MOCK_COMMUNES) {
    const sampleSubtotal = 18000
    const calc = getMockShippingCalculation(commune, sampleSubtotal)
    queryClient.setQueryData(['shipping', commune, sampleSubtotal], calc)
  }

  // Orders
  queryClient.setQueryData(['orders'], MOCK_ORDERS)
  for (const order of MOCK_ORDERS) {
    queryClient.setQueryData(['order', order.orderNumber], order)
  }

  console.info('[AMERICO] Mock mode active — serving %d products, %d categories', MOCK_PRODUCTS.length, MOCK_CATEGORIES.length)
}
