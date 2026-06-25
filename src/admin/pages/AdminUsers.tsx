import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { getAdminUsers, updateUserRole } from '@/api/admin.api'
import { toast } from 'sonner'
import type { User } from '@/types'

const PAGE_SIZE = 15

export default function AdminUsers() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'customer' | 'admin'>('all')
  const [confirmTarget, setConfirmTarget] = useState<User | null>(null)
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', search, roleFilter, page],
    queryFn: () =>
      getAdminUsers({
        search: search || undefined,
        role: roleFilter === 'all' ? undefined : roleFilter,
        page,
        limit: PAGE_SIZE,
      }),
    staleTime: 30 * 1000,
  })

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: 'customer' | 'admin' }) =>
      updateUserRole(id, role),
    onSuccess: (updatedUser: User) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success(`Rol de ${updatedUser.name} actualizado a ${updatedUser.role}`)
    },
    onError: () => toast.error('No se pudo actualizar el rol'),
  })

  const users = data?.data ?? []

  const totalPages = data?.pagination.totalPages ?? 1

  const toggleRole = (user: User) => {
    setConfirmTarget(user)
  }

  const handleConfirmRole = () => {
    if (!confirmTarget) return
    const newRole = confirmTarget.role === 'admin' ? 'customer' : 'admin'
    roleMutation.mutate(
      { id: confirmTarget._id, role: newRole },
      { onSettled: () => setConfirmTarget(null) }
    )
  }

  return (
    <>
      <Helmet><title>Usuarios — Admin AMERICO</title></Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLoading ? '...' : `${data?.pagination.total ?? 0} usuarios registrados`}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o correo..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'customer', 'admin'] as const).map((r) => (
              <Button
                key={r}
                size="sm"
                variant={roleFilter === r ? 'default' : 'outline'}
                onClick={() => { setRoleFilter(r); setPage(1) }}
              >
                {r === 'all' ? 'Todos' : r === 'customer' ? 'Clientes' : 'Admins'}
              </Button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background overflow-hidden">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="space-y-3 p-5">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : users.length === 0 ? (
              <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                No se encontraron usuarios
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
                    <th className="px-5 py-3">Nombre</th>
                    <th className="px-5 py-3">Correo</th>
                    <th className="px-5 py-3">Rol</th>
                    <th className="px-5 py-3">Registrado</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-5 py-3 font-medium">{user.name}</td>
                      <td className="px-5 py-3 text-muted-foreground">{user.email}</td>
                      <td className="px-5 py-3">
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                          {user.role === 'admin' ? 'Admin' : 'Cliente'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground text-xs">
                        {new Date(user.createdAt).toLocaleDateString('es-CL', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          disabled={roleMutation.isPending}
                          onClick={() => toggleRole(user)}
                        >
                          {user.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            Página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isLoading}
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmTarget !== null}
        onOpenChange={(open) => { if (!open) setConfirmTarget(null) }}
        title={confirmTarget?.role === 'admin' ? 'Quitar permisos de admin' : 'Dar permisos de admin'}
        description={
          confirmTarget?.role === 'admin'
            ? `${confirmTarget?.name} dejará de tener acceso al panel de administración.`
            : `${confirmTarget?.name} podrá acceder al panel de administración.`
        }
        confirmLabel={confirmTarget?.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
        variant={confirmTarget?.role === 'admin' ? 'destructive' : 'default'}
        isLoading={roleMutation.isPending}
        onConfirm={handleConfirmRole}
      />
    </>
  )
}
