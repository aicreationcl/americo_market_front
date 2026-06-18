import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Store, Search, User, Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { useCategories } from '@/shop/hooks/useCategories'
import { MobileMenu } from './MobileMenu'

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const itemCount = useCartStore((s) => s.itemCount)
  const openCart = useUIStore((s) => s.openCart)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)
  const { data: categories } = useCategories()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Store className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              AMERICO
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link to="/" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Inicio
            </Link>
            <div className="relative" onMouseLeave={() => setCategoriesOpen(false)}>
              <button
                className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                onMouseEnter={() => setCategoriesOpen(true)}
              >
                Catálogo <ChevronDown className="h-4 w-4" />
              </button>
              {categoriesOpen && categories && categories.length > 0 && (
                <div className="absolute left-0 top-full z-50 mt-1 min-w-[200px] rounded-xl border border-border bg-popover p-2 shadow-lg">
                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      to={`/catalogo/${cat.slug}`}
                      className="block rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
                      onClick={() => setCategoriesOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <div className="mt-1 border-t border-border pt-1">
                    <Link
                      to="/catalogo"
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-muted transition-colors"
                      onClick={() => setCategoriesOpen(false)}
                    >
                      Ver todo el catálogo →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-1">
                <input
                  autoFocus
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos..."
                  className="h-9 w-48 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => setSearchOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </form>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
                <Search className="h-5 w-5" />
              </Button>
            )}

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative" onClick={openCart}>
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1 text-[10px]">
                  {itemCount > 99 ? '99+' : itemCount}
                </Badge>
              )}
            </Button>

            {/* User */}
            <div className="hidden md:block">
              {isAuthenticated ? (
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/mi-cuenta">
                      <User className="mr-1 h-4 w-4" />
                      {user?.name?.split(' ')[0]}
                    </Link>
                  </Button>
                  {user?.role === 'admin' && (
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/admin">Admin</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login">Ingresar</Link>
                </Button>
              )}
            </div>

            {/* Mobile hamburger */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
