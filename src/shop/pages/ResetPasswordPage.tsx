import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Store } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useResetPassword } from '@/shop/hooks/useAuth'

const schema = z.object({
  newPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const navigate = useNavigate()
  const resetMutation = useResetPassword()

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  })

  if (!token) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-4 text-center">
          <p className="text-sm text-destructive font-medium">Enlace inválido o incompleto.</p>
          <Link to="/recuperar-contrasena" className="text-sm font-medium text-primary hover:underline">
            Solicitar un nuevo enlace
          </Link>
        </div>
      </div>
    )
  }

  const onSubmit = async (data: FormData) => {
    try {
      await resetMutation.mutateAsync({ token, newPassword: data.newPassword })
      toast.success('Contraseña actualizada correctamente')
      navigate('/login', { replace: true })
    } catch {
      toast.error('El enlace es inválido o ha expirado. Solicita uno nuevo.')
    }
  }

  return (
    <>
      <Helmet><title>Nueva contraseña — AMERICO</title></Helmet>

      <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Store className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Nueva contraseña</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Elige una contraseña segura para tu cuenta
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nueva contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Repite la contraseña"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={resetMutation.isPending}>
                {resetMutation.isPending ? 'Actualizando...' : 'Guardar nueva contraseña'}
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-muted-foreground">
            <Link to="/recuperar-contrasena" className="text-primary hover:underline">
              Solicitar un nuevo enlace
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
