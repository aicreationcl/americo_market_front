import { Helmet } from 'react-helmet-async'

export default function TermsPage() {
  return (
    <>
      <Helmet><title>Términos y condiciones — AMERICO</title></Helmet>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Términos y condiciones</h1>
        <p className="mb-8 text-sm text-muted-foreground">Última actualización: junio 2026</p>

        <div className="prose prose-stone max-w-none space-y-6 text-sm leading-relaxed text-foreground">
          <section>
            <h2 className="mb-2 text-base font-semibold">1. Aceptación de los términos</h2>
            <p className="text-muted-foreground">
              Al acceder y utilizar la plataforma de AMERICO Minimarket, usted acepta quedar vinculado por estos términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">2. Descripción del servicio</h2>
            <p className="text-muted-foreground">
              AMERICO Minimarket ofrece un servicio de venta de productos de consumo masivo a través de su plataforma en línea, con opciones de despacho a domicilio en la Región Metropolitana y retiro en tienda en Sgto. Daniel Rebolledo 0739, La Pintana.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">3. Proceso de compra</h2>
            <p className="text-muted-foreground">
              Los pedidos realizados a través de nuestra plataforma están sujetos a disponibilidad de stock. Nos reservamos el derecho de cancelar un pedido en caso de error en el precio publicado, falta de stock o cualquier otra circunstancia que lo justifique, realizando el reembolso correspondiente en el menor tiempo posible.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">4. Precios y pagos</h2>
            <p className="text-muted-foreground">
              Todos los precios publicados incluyen IVA y están expresados en pesos chilenos (CLP). Aceptamos pagos en efectivo al momento de la entrega, y mediante tarjetas de débito, crédito o transferencia a través de los medios de pago habilitados en la plataforma.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">5. Política de devoluciones</h2>
            <p className="text-muted-foreground">
              En caso de recibir un producto en mal estado o diferente al solicitado, contáctenos dentro de las 24 horas siguientes a la entrega para coordinar la reposición o devolución del dinero según corresponda.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">6. Limitación de responsabilidad</h2>
            <p className="text-muted-foreground">
              AMERICO Minimarket no será responsable por daños indirectos, incidentales o consecuentes derivados del uso de nuestra plataforma o de los productos adquiridos, más allá de lo establecido por la legislación chilena vigente.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">7. Modificaciones</h2>
            <p className="text-muted-foreground">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor al ser publicados en esta página. El uso continuado del servicio implica la aceptación de los nuevos términos.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">8. Contacto</h2>
            <p className="text-muted-foreground">
              Para consultas relacionadas con estos términos, puede contactarnos a través de nuestro formulario de contacto o visitarnos en Sgto. Daniel Rebolledo 0739, La Pintana, Región Metropolitana.
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
