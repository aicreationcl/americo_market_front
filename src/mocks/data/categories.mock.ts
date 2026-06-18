import type { Category } from '@/types'

export const MOCK_CATEGORIES: Category[] = [
  {
    _id: 'cat-1',
    name: 'Abarrotes y Despensa',
    slug: 'abarrotes',
    description: 'Arroz, fideos, aceite, conservas y todo lo esencial para tu despensa',
    sortOrder: 1,
  },
  {
    _id: 'cat-2',
    name: 'Bebidas y Jugos',
    slug: 'bebidas',
    description: 'Aguas, jugos, bebidas gaseosas, cervezas y más',
    sortOrder: 2,
  },
  {
    _id: 'cat-3',
    name: 'Lácteos y Huevos',
    slug: 'lacteos',
    description: 'Leche, yogurt, queso, mantequilla y huevos frescos',
    sortOrder: 3,
  },
  {
    _id: 'cat-4',
    name: 'Carnes y Embutidos',
    slug: 'carnes',
    description: 'Pollo, vacuno, cerdo, jamón, salchichas y embutidos',
    sortOrder: 4,
  },
  {
    _id: 'cat-5',
    name: 'Frutas y Verduras',
    slug: 'frutas-y-verduras',
    description: 'Frutas frescas, verduras de temporada y hierbas',
    sortOrder: 5,
  },
  {
    _id: 'cat-6',
    name: 'Limpieza y Hogar',
    slug: 'limpieza',
    description: 'Detergentes, desinfectantes, papel higiénico y artículos del hogar',
    sortOrder: 6,
  },
  {
    _id: 'cat-7',
    name: 'Snacks y Confites',
    slug: 'snacks',
    description: 'Papas fritas, galletas, chocolates, dulces y cecinas',
    sortOrder: 7,
  },
]
