import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Store } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useLogin } from '@/shop/hooks/useAuth'

const schema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const loginMutation = useLogin()
  const from = (location.state as { from?: string })?.from || '/mi-cuenta/perfil'

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: FormData) => {
    try {
      const result = await loginMutation.mutateAsync(data)
      toast.success(`¡Bienvenido, ${result.user.name}!`)
      navigate(result.user.role === 'admin' ? '/admin' : from, { replace: true })
    } catch {
      toast.error('Correo o contraseña incorrectos')
    }
  }

  return (
    <>
      <Helmet><title>Iniciar sesión</title></Helmet>

      <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Store className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Inicia sesión</h1>
            <p className="mt-1 text-sm text-muted-foreground">en AMERICO Minimarket</p>
          </div>

          {import.meta.env.VITE_USE_MOCKS === 'true' && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">
              <p className="mb-2 font-semibold text-amber-800">Modo demo activo</p>
              <p className="text-xs text-amber-700">Usa credenciales reales del backend.</p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl><Input type="email" placeholder="tu@correo.cl" autoComplete="email" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl><Input type="password" placeholder="••••••••" autoComplete="current-password" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? 'Ingresando...' : 'Ingresar'}
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="font-medium text-primary hover:underline">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
