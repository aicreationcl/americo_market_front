import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/UserAvatar'
import { useGetMe, useUpdateMe, useChangePassword } from '@/shop/hooks/useAuth'

const schema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phone: z.string().min(8, 'Teléfono inválido').optional().or(z.literal('')),
})

type FormData = z.infer<typeof schema>

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Ingresa tu contraseña actual'),
  newPassword: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirma la nueva contraseña'),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

type PasswordFormData = z.infer<typeof passwordSchema>

const MAX_SIZE = 150

function resizeToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      const scale = Math.min(MAX_SIZE / img.width, MAX_SIZE / img.height, 1)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = reject
    img.src = objectUrl
  })
}

export default function AccountProfile() {
  const { data: user, isLoading } = useGetMe()
  const updateMutation = useUpdateMe()
  const changePasswordMutation = useChangePassword()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [pendingImage, setPendingImage] = useState<string | null>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', phone: '' },
  })

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  useEffect(() => {
    if (user) {
      form.reset({ name: user.name, phone: user.phone ?? '' })
      setPreviewImage(user.profileImage || null)
    }
  }, [user, form])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede superar los 5 MB')
      return
    }
    try {
      const dataUrl = await resizeToDataUrl(file)
      setPreviewImage(dataUrl)
      setPendingImage(dataUrl)
    } catch {
      toast.error('No se pudo procesar la imagen')
    }
    e.target.value = ''
  }

  const onSubmit = async (data: FormData) => {
    try {
      await updateMutation.mutateAsync({
        name: data.name,
        phone: data.phone || undefined,
        ...(pendingImage !== null ? { profileImage: pendingImage } : {}),
      })
      setPendingImage(null)
      toast.success('Perfil actualizado correctamente')
    } catch {
      toast.error('No se pudo actualizar el perfil')
    }
  }

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      await changePasswordMutation.mutateAsync({ currentPassword: data.currentPassword, newPassword: data.newPassword })
      passwordForm.reset()
      toast.success('Contraseña cambiada correctamente')
    } catch {
      toast.error('La contraseña actual es incorrecta')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
    )
  }

  const displayUser = previewImage
    ? { ...user, profileImage: previewImage }
    : user

  return (
    <div className="space-y-6">
      {/* Avatar + info */}
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <UserAvatar user={displayUser} size="lg" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-sm transition-opacity hover:opacity-80"
            title="Cambiar foto"
          >
            <Camera className="h-3 w-3" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <p className="font-semibold">{user?.name}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {user?.role === 'admin' ? 'Administrador' : 'Cliente'}
          </p>
          {pendingImage && (
            <p className="mt-1 text-xs text-amber-600 font-medium">
              Nueva foto pendiente — guarda los cambios
            </p>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="rounded-xl border border-border bg-background p-5">
        <h2 className="mb-4 text-sm font-semibold">Editar información</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu nombre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Teléfono{' '}
                    <span className="font-normal text-muted-foreground">(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="+56 9 1234 5678" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-1">
              <p className="mb-3 text-xs text-muted-foreground">
                <strong>Correo:</strong> {user?.email}{' '}
                <span className="italic">(no es posible modificarlo)</span>
              </p>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      {/* Change password */}
      <div className="rounded-xl border border-border bg-background p-5">
        <h2 className="mb-4 text-sm font-semibold">Cambiar contraseña</h2>

        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <FormField
              control={passwordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña actual</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" autoComplete="current-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nueva contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Mínimo 6 caracteres" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar nueva contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Repite la contraseña" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="outline" disabled={changePasswordMutation.isPending}>
              {changePasswordMutation.isPending ? 'Cambiando...' : 'Cambiar contraseña'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
