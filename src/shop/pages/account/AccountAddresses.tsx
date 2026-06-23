import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, MapPin, Star } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Skeleton } from '@/components/ui/skeleton'
import { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from '@/api/addresses.api'
import { useCommunes } from '@/shop/hooks/useShipping'
import type { Address } from '@/types'

const schema = z.object({
  alias: z.string().min(1, 'Alias requerido').max(50),
  street: z.string().min(2, 'Calle requerida'),
  number: z.string().min(1, 'Número requerido'),
  commune: z.string().min(1, 'Selecciona una comuna'),
  region: z.string().min(1),
  additionalInfo: z.string().max(200).optional(),
})

type FormValues = z.infer<typeof schema>

interface AddressDialogProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  address?: Address | null
  communes: string[]
  onSave: (values: FormValues) => void
  isSaving: boolean
}

function AddressDialog({ open, onOpenChange, address, communes, onSave, isSaving }: AddressDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: address
      ? { alias: address.alias, street: address.street, number: address.number, commune: address.commune, region: address.region, additionalInfo: address.additionalInfo ?? '' }
      : { alias: 'Casa', street: '', number: '', commune: '', region: 'Región Metropolitana', additionalInfo: '' },
  })

  useEffect(() => {
    if (open) {
      form.reset(address
        ? { alias: address.alias, street: address.street, number: address.number, commune: address.commune, region: address.region, additionalInfo: address.additionalInfo ?? '' }
        : { alias: 'Casa', street: '', number: '', commune: '', region: 'Región Metropolitana', additionalInfo: '' }
      )
    }
  }, [open, address]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{address ? 'Editar dirección' : 'Nueva dirección'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-4 py-1">
            <FormField control={form.control} name="alias" render={({ field }) => (
              <FormItem>
                <FormLabel>Alias</FormLabel>
                <FormControl><Input placeholder="Casa, Trabajo..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <FormField control={form.control} name="street" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calle</FormLabel>
                    <FormControl><Input placeholder="Av. Providencia" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="number" render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl><Input placeholder="1234" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="commune" render={({ field }) => (
              <FormItem>
                <FormLabel>Comuna</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Selecciona tu comuna..." /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {communes.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="additionalInfo" render={({ field }) => (
              <FormItem>
                <FormLabel>Depto / Referencias <span className="text-muted-foreground">(opcional)</span></FormLabel>
                <FormControl><Input placeholder="Dpto 4B, casa con reja verde..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Guardando...' : address ? 'Guardar cambios' : 'Agregar dirección'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default function AccountAddresses() {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Address | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null)

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: getAddresses,
    staleTime: 2 * 60 * 1000,
  })

  const { data: communes = [] } = useCommunes()

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['addresses'] })

  const addMutation = useMutation({
    mutationFn: addAddress,
    onSuccess: () => { invalidate(); setDialogOpen(false); toast.success('Dirección agregada') },
    onError: () => toast.error('No se pudo agregar la dirección'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FormValues> }) => updateAddress(id, data),
    onSuccess: () => { invalidate(); setDialogOpen(false); setEditTarget(null); toast.success('Dirección actualizada') },
    onError: () => toast.error('No se pudo actualizar la dirección'),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => { invalidate(); setDeleteTarget(null); toast.success('Dirección eliminada') },
    onError: () => toast.error('No se pudo eliminar la dirección'),
  })

  const defaultMutation = useMutation({
    mutationFn: setDefaultAddress,
    onSuccess: () => { invalidate(); toast.success('Dirección predeterminada actualizada') },
    onError: () => toast.error('No se pudo actualizar'),
  })

  const handleSave = (values: FormValues) => {
    if (editTarget) {
      updateMutation.mutate({ id: editTarget._id, data: values })
    } else {
      addMutation.mutate(values)
    }
  }

  const isSaving = addMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Mis direcciones</h2>
          <p className="text-sm text-muted-foreground">Máximo 5 direcciones guardadas</p>
        </div>
        {addresses.length < 5 && (
          <Button size="sm" onClick={() => { setEditTarget(null); setDialogOpen(true) }}>
            <Plus className="mr-2 h-4 w-4" /> Nueva dirección
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-12 text-center">
          <MapPin className="mx-auto mb-3 h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">No tienes direcciones guardadas</p>
          <p className="mt-1 text-xs text-muted-foreground">Agrega una para agilizar tus próximas compras</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className="flex items-start justify-between rounded-xl border border-border bg-background p-4"
            >
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{addr.alias}</span>
                    {addr.isDefault && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                        <Star className="h-3 w-3" /> Predeterminada
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {addr.street} {addr.number}{addr.additionalInfo ? `, ${addr.additionalInfo}` : ''}
                  </p>
                  <p className="text-xs text-muted-foreground">{addr.commune}, {addr.region}</p>
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                {!addr.isDefault && (
                  <Button
                    variant="ghost" size="sm" className="text-xs"
                    disabled={defaultMutation.isPending}
                    onClick={() => defaultMutation.mutate(addr._id)}
                  >
                    Predeterminar
                  </Button>
                )}
                <Button
                  variant="ghost" size="sm" className="text-xs"
                  onClick={() => { setEditTarget(addr); setDialogOpen(true) }}
                >
                  Editar
                </Button>
                <Button
                  variant="ghost" size="sm" className="text-xs text-destructive hover:text-destructive"
                  onClick={() => setDeleteTarget(addr)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddressDialog
        open={dialogOpen}
        onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditTarget(null) }}
        address={editTarget}
        communes={communes}
        onSave={handleSave}
        isSaving={isSaving}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(v) => { if (!v) setDeleteTarget(null) }}
        title="Eliminar dirección"
        description={`¿Eliminar "${deleteTarget?.alias}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget._id, { onSettled: () => setDeleteTarget(null) })}
      />
    </div>
  )
}
