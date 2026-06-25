import { Helmet } from 'react-helmet-async'

export default function ShippingPolicyPage() {
  return (
    <>
      <Helmet><title>Política de envíos — AMERICO</title></Helmet>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Política de envíos</h1>
        <p className="mb-8 text-sm text-muted-foreground">Última actualización: junio 2026</p>

        <div className="prose prose-stone max-w-none space-y-6 text-sm leading-relaxed text-foreground">
          <section>
            <h2 className="mb-2 text-base font-semibold">Zona de cobertura</h2>
            <p className="text-muted-foreground">
              Realizamos despachos a domicilio en comunas de la Región Metropolitana. El costo y disponibilidad de envío se calculan automáticamente al ingresar la dirección de entrega en el proceso de compra.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">Tiempos de entrega</h2>
            <p className="text-muted-foreground">
              Los pedidos se procesan de lunes a sábado entre las 08:00 y las 20:00 hrs. El tiempo estimado de entrega es de 1 a 3 horas hábiles desde la confirmación del pedido, sujeto a disponibilidad y volumen de pedidos del día.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">Costo de envío</h2>
            <p className="text-muted-foreground">
              El costo de envío varía según la comuna de destino y el monto del pedido. En el proceso de compra podrá ver el costo exacto antes de confirmar su pedido. Algunos pedidos pueden tener envío gratuito según promociones vigentes.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">Retiro en tienda</h2>
            <p className="text-muted-foreground">
              También puede retirar su pedido sin costo adicional en nuestra tienda ubicada en Sgto. Daniel Rebolledo 0739, La Pintana. Le notificaremos por correo electrónico cuando su pedido esté listo para retirar.
            </p>
            <p className="mt-2 text-muted-foreground">
              Horario de atención: Lunes a Sábado 08:00–21:00 hrs · Domingo 09:00–19:00 hrs
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">Seguimiento de pedidos</h2>
            <p className="text-muted-foreground">
              Puede hacer seguimiento de su pedido en tiempo real a través de la sección "Seguir mi pedido" en nuestra plataforma, utilizando el número de pedido que recibe por correo electrónico tras confirmar su compra.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">Problemas con la entrega</h2>
            <p className="text-muted-foreground">
              Si no estás en el domicilio al momento de la entrega, nos pondremos en contacto contigo para coordinar un nuevo intento. En caso de no poder concretar la entrega, el pedido quedará disponible para retiro en tienda por un máximo de 48 horas. Pasado ese plazo, el pedido puede ser cancelado y el monto reembolsado según el método de pago utilizado.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">Devoluciones por error en el pedido</h2>
            <p className="text-muted-foreground">
              Si recibes un producto diferente al solicitado o en mal estado, contáctanos dentro de las 24 horas siguientes a la entrega. Coordinaremos el cambio o reembolso sin costo adicional para ti.
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
