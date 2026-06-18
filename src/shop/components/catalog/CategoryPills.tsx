import { Link, useParams } from 'react-router-dom'
import { LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { useCategories } from '@/shop/hooks/useCategories'

export function CategoryPills() {
  const { categorySlug } = useParams<{ categorySlug?: string }>()
  const { data: categories, isLoading } = useCategories()

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 shrink-0 rounded-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <Link
        to="/catalogo"
        className={cn(
          'flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap',
          !categorySlug
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border bg-background hover:bg-muted'
        )}
      >
        <LayoutGrid className="h-4 w-4" />
        Todo
      </Link>
      {categories?.map((cat) => (
        <Link
          key={cat._id}
          to={`/catalogo/${cat.slug}`}
          className={cn(
            'flex shrink-0 items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap',
            cat.slug === categorySlug
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-background hover:bg-muted'
          )}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  )
}
