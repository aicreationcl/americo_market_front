export interface CartItem {
  product: string   // MongoDB ObjectId string — identificador del ítem para update/remove
  name: string      // snapshot del nombre al momento de agregar
  price: number     // snapshot del precio CLP (integer)
  imageUrl: string  // snapshot de la URL de imagen
  quantity: number
  sku: string
  subtotal: number  // computado: price * quantity (calculado en cart.api.ts)
}

export interface Cart {
  _id: string
  sessionId?: string
  userId?: string
  items: CartItem[]
  subtotal: number   // sum de item.subtotal
  itemCount: number  // sum de item.quantity
}
