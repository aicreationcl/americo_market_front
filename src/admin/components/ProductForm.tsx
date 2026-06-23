import { useEffect, useRef, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Camera, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getCategories } from '@/api/categories.api'
import { createProduct, updateProduct, uploadProductImage } from '@/api/admin.api'
import type { Product } from '@/types'

const schema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  sku: z.string().min(1, 'SKU requerido'),
  categoryId: z.string().min(1, 'Selecciona una categoría'),
  price: z.number({ message: 'Precio inválido' }).int('Debe ser entero CLP').positive('Debe ser positivo'),
  originalPrice: z.number({ message: 'Precio inválido' }).int().positive().optional(),
  stock: z.number({ message: 'Stock inválido' }).int().min(0, 'No puede ser negativo'),
  unit: z.enum(['un', 'kg', 'lt', 'paq']),
  brand: z.string().optional(),
  shortDescription: z.string().max(200, 'Máximo 200 caracteres').optional(),
  isFeatured: z.boolean(),
})

type FormValues = z.infer<typeof schema>

interface ProductFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
}

const numericOnChange = (field: { onChange: (v: number | undefined) => void }) =>
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    field.onChange(val === '' ? undefined : parseInt(val, 10))
  }

export function ProductForm({ open, onOpenChange, product }: ProductFormProps) {
  const queryClient = useQueryClient()
  const isEdit = !!product
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingImage, setPendingImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '', sku: '', categoryId: '', price: undefined, originalPrice: undefined,
      stock: undefined, unit: 'un', brand: '', shortDescription: '', isFeatured: false,
    },
  })

  useEffect(() => {
    if (open) {
      setPendingImage(null)
      setIsUploading(false)
      if (product) {
        const catId = typeof product.category === 'object' ? product.category._id : String(product.category)
        form.reset({
          name: product.name,
          sku: product.sku,
          categoryId: catId,
          price: product.price,
          originalPrice: product.compareAtPrice,
          stock: product.stock,
          unit: (product.unit as 'un' | 'kg' | 'lt' | 'paq') || 'un',
          brand: product.brand || '',
          shortDescription: product.shortDescription || '',
          isFeatured: product.isFeatured,
        })
      } else {
        form.reset({
          name: '', sku: '', categoryId: '', price: undefined, originalPrice: undefined,
          stock: undefined, unit: 'un', brand: '', shortDescription: '', isFeatured: false,
        })
      }
    }
  }, [open, product, form])

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setIsUploading(true)
    try {
      const result = await uploadProductImage(file)
      setPendingImage(result.url)
    } catch {
      toast.error('No se pudo subir la imagen. Intenta nuevamente.')
    } finally {
      setIsUploading(false)
    }
  }, [])

  const currentImageUrl = pendingImage
    ?? (product?.images as unknown as Array<{ url: string }>)?.[0]?.url
    ?? null

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const payload = {
        name: values.name,
        sku: values.sku,
        category: values.categoryId,
        price: values.price,
        originalPrice: values.originalPrice,
        stock: values.stock,
        unit: values.unit,
        brand: values.brand || undefined,
        shortDescription: values.shortDescription || undefined,
        isFeatured: values.isFeatured,
        ...(pendingImage
          ? { images: [{ url: pendingImage, alt: values.name }] }
          : {}),
      }
      return isEdit ? updateProduct(product!._id, payload) : createProduct(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success(isEdit ? 'Producto actualizado' : 'Producto creado')
      onOpenChange(false)
    },
    onError: () => toast.error(isEdit ? 'No se pudo actualizar' : 'No se pudo crear el producto'),
  })

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar producto' : 'Nuevo producto'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4 py-2">

            {/* Image upload */}
            <div>
              <p className="mb-2 text-sm font-medium">Imagen del producto</p>
              <div className="flex items-center gap-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-stone-100">
                  {currentImageUrl ? (
                    <>
                      <img
                        src={currentImageUrl}
                        alt="Vista previa"
                        className="h-full w-full object-cover"
                      />
                      {pendingImage && (
                        <button
                          type="button"
                          onClick={() => setPendingImage(null)}
                          className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
                      <Camera className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    {isUploading ? 'Subiendo...' : currentImageUrl ? 'Cambiar imagen' : 'Subir imagen'}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG o WEBP — máx. 5 MB. Cloudinary optimiza automáticamente.
                  </p>
                  {pendingImage && (
                    <p className="text-xs text-green-600 font-medium">Imagen subida a Cloudinary ✓</p>
                  )}
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl><Input placeholder="Leche entera 1L" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="sku" render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl><Input placeholder="LAC-001" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="unit" render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidad</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="un">Unidad (un)</SelectItem>
                      <SelectItem value="kg">Kilogramo (kg)</SelectItem>
                      <SelectItem value="lt">Litro (lt)</SelectItem>
                      <SelectItem value="paq">Paquete (paq)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="categoryId" render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar categoría" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio (CLP)</FormLabel>
                  <FormControl>
                    <Input
                      type="number" min={1} placeholder="990"
                      value={field.value ?? ''}
                      onChange={numericOnChange(field)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="originalPrice" render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio antes (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number" min={1} placeholder="1290"
                      value={field.value ?? ''}
                      onChange={numericOnChange(field)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="stock" render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number" min={0} placeholder="50"
                      value={field.value ?? ''}
                      onChange={numericOnChange(field)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="brand" render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca (opcional)</FormLabel>
                  <FormControl><Input placeholder="Soprole" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="shortDescription" render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción corta (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Máximo 200 caracteres" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="isFeatured" render={({ field }) => (
              <FormItem className="flex items-center gap-3 rounded-lg border border-border p-3">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4 rounded accent-primary"
                  />
                </FormControl>
                <div>
                  <FormLabel className="cursor-pointer">Destacado en inicio</FormLabel>
                </div>
              </FormItem>
            )} />

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={mutation.isPending || isUploading}>
                {mutation.isPending ? 'Guardando...' : isUploading ? 'Subiendo imagen...' : isEdit ? 'Guardar cambios' : 'Crear producto'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
