import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Store } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForgotPassword } from '@/shop/hooks/useAuth'

const schema = z.object({
  email: z.string().email('Correo electrónico inválido'),
})

type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const forgotMutation = useForgotPassword()

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: FormData) => {
    await forgotMutation.mutateAsync(data.email)
    setSent(true)
  }

  return (
    <>
      <Helmet><title>Recuperar contraseña — AMERICO</title></Helmet>

      <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Store className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Recupera tu contraseña</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Ingresa tu correo y te enviaremos instrucciones
            </p>
          </div>

          {sent ? (
            <div className="rounded-xl border border-border bg-muted/30 p-6 text-center space-y-3">
              <p className="text-sm font-medium">Revisa tu bandeja de entrada</p>
              <p className="text-sm text-muted-foreground">
                Si el correo está registrado en AMERICO, recibirás un enlace para restablecer tu contraseña. El enlace expira en 1 hora.
              </p>
              <Link to="/login" className="block mt-2 text-sm font-medium text-primary hover:underline">
                Volver a iniciar sesión
              </Link>
            </div>
          ) : (
            <>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo electrónico</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="tu@correo.cl"
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={forgotMutation.isPending}>
                    {forgotMutation.isPending ? 'Enviando...' : 'Enviar instrucciones'}
                  </Button>
                </form>
              </Form>

              <p className="text-center text-sm text-muted-foreground">
                <Link to="/login" className="font-medium text-primary hover:underline">
                  ← Volver al inicio de sesión
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  )
}
