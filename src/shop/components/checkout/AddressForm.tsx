import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCommunes } from '@/shop/hooks/useShipping'

const schema = z.object({
  street: z.string().min(3, 'Ingresa la calle'),
  number: z.string().min(1, 'Ingresa el número'),
  apartment: z.string().optional(),
  commune: z.string().min(1, 'Selecciona una comuna'),
  references: z.string().optional(),
})

export type AddressData = z.infer<typeof schema>

interface AddressFormProps {
  onDataChange: (data: AddressData, isValid: boolean) => void
  defaultValues?: Partial<AddressData>
}

export function AddressForm({ onDataChange, defaultValues }: AddressFormProps) {
  const { data: communes = [] } = useCommunes()
  const form = useForm<AddressData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || { street: '', number: '', apartment: '', commune: '', references: '' },
    mode: 'onChange',
  })

  const values = form.watch()
  useEffect(() => {
    const isValid = form.formState.isValid
    onDataChange(values, isValid)
  }, [JSON.stringify(values), form.formState.isValid])

  return (
    <Form {...form}>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calle</FormLabel>
                  <FormControl><Input placeholder="Av. Libertador" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número</FormLabel>
                <FormControl><Input placeholder="1234" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="apartment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Depto / Oficina <span className="text-muted-foreground">(opcional)</span></FormLabel>
              <FormControl><Input placeholder="Dpto 4B" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="commune"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comuna</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu comuna..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {communes.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="references"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referencias <span className="text-muted-foreground">(opcional)</span></FormLabel>
              <FormControl><Input placeholder="Casa con reja verde, timbre no funciona..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  )
}
