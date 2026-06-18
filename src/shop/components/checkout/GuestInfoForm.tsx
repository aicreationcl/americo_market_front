import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const schema = z.object({
  name: z.string().min(2, 'Ingresa tu nombre completo'),
  email: z.string().email('Correo electrónico inválido'),
  phone: z.string().regex(/^\+?[0-9]{9,12}$/, 'Teléfono inválido (ej: +56912345678)'),
})

export type GuestInfoData = z.infer<typeof schema>

interface GuestInfoFormProps {
  onDataChange: (data: GuestInfoData) => void
  defaultValues?: Partial<GuestInfoData>
}

export function GuestInfoForm({ onDataChange, defaultValues }: GuestInfoFormProps) {
  const form = useForm<GuestInfoData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || { name: '', email: '', phone: '' },
    mode: 'onChange',
  })

  return (
    <Form {...form}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Datos de contacto</h3>
          <Link to="/login" className="text-xs text-primary hover:underline">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre completo</FormLabel>
              <FormControl>
                <Input placeholder="Juan Pérez" {...field} onChange={(e) => { field.onChange(e); form.trigger('name').then(() => onDataChange(form.getValues())) }} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input type="email" placeholder="juan@ejemplo.cl" {...field} onChange={(e) => { field.onChange(e); form.trigger('email').then(() => onDataChange(form.getValues())) }} />
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
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+56912345678" {...field} onChange={(e) => { field.onChange(e); form.trigger('phone').then(() => onDataChange(form.getValues())) }} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  )
}
