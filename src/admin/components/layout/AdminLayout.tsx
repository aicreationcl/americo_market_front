import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ClipboardList, LogOut, Menu, X, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/productos', label: 'Productos', icon: Package, end: false },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ClipboardList, end: false },
]

function NavItems({ onClose }: { onClose?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onClose}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )
          }
        >
          <Icon className="h-4 w-4 shrink-0" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export default function AdminLayout() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    useAuthStore.getState().clearAuth()
    navigate('/login', { replace: true })
  }

  const sidebar = (
    <div className="flex h-full flex-col px-3 py-4">
      <div className="mb-6 flex items-center gap-2 px-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Store className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-bold leading-none">AMERICO</p>
          <p className="text-xs text-muted-foreground">Panel admin</p>
        </div>
      </div>

      <div className="flex-1">
        <NavItems onClose={() => setMobileOpen(false)} />
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="mt-4 w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        Cerrar sesión
      </Button>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-border bg-background md:block">
        {sidebar}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <aside className="absolute left-0 top-0 h-full w-56 bg-background" onClick={(e) => e.stopPropagation()}>
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="flex h-14 items-center gap-3 border-b border-border bg-background px-4 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <span className="text-sm font-bold">Panel Admin</span>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
