import { Link, useParams } from 'react-router-dom'
import {
  Package,
  Coffee,
  Milk,
  Beef,
  Apple,
  Cookie,
  ShoppingBasket,
  Sparkles,
  LayoutGrid,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { useCategories } from '@/hooks/useCategories'

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  abarrotes: Package,
  bebidas: Coffee,
  lacteos: Milk,
  'lacteos-y-huevos': Milk,
  carnes: Beef,
  frutas: Apple,
  'frutas-y-verduras': Apple,
  galletas: Cookie,
  snacks: Cookie,
  limpieza: Sparkles,
  default: ShoppingBasket,
}

const getIcon = (slug: string) =>
  CATEGORY_ICONS[slug] || CATEGORY_ICONS.default

export function CategorySidebar() {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const { data: categories, isLoading } = useCategories()

  if (isLoading) {
    return (
      <aside className="w-56 shrink-0 space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </aside>
    )
  }

  return (
    <aside className="w-56 shrink-0">
      <h2 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Categorías
      </h2>
      <nav className="space-y-1">
        <Link
          to="/catalogo"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
            !categorySlug
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground hover:bg-muted'
          )}
        >
          <LayoutGrid className="h-4 w-4" />
          Todos los productos
        </Link>
        {categories?.map((cat) => {
          const Icon = getIcon(cat.slug)
          const isActive = cat.slug === categorySlug
          return (
            <Link
              key={cat._id}
              to={`/catalogo/${cat.slug}`}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              <Icon className="h-4 w-4" />
              {cat.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
