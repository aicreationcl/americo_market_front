import { NavLink, Outlet, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { User, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

const TABS = [
  { to: '/mi-cuenta/perfil', label: 'Mi perfil', icon: User },
  { to: '/mi-cuenta/pedidos', label: 'Mis pedidos', icon: ShoppingBag },
]

export default function AccountPage() {
  const user = useAuthStore((s) => s.user)

  return (
    <>
      <Helmet><title>Mi cuenta — AMERICO</title></Helmet>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Mi cuenta</h1>
          {user && (
            <p className="mt-1 text-sm text-muted-foreground">
              Hola, <span className="font-medium text-foreground">{user.name}</span>
            </p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-[200px_1fr]">
          {/* Sidebar nav */}
          <nav className="flex flex-row gap-1 md:flex-col">
            {TABS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
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

          {/* Content */}
          <div className="min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
}

export function AccountIndex() {
  return <Navigate to="/mi-cuenta/perfil" replace />
}
