import { Helmet } from 'react-helmet-async'

export default function PrivacyPage() {
  return (
    <>
      <Helmet><title>Política de privacidad — AMERICO</title></Helmet>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Política de privacidad</h1>
        <p className="mb-8 text-sm text-muted-foreground">Última actualización: junio 2026</p>

        <div className="prose prose-stone max-w-none space-y-6 text-sm leading-relaxed text-foreground">
          <section>
            <h2 className="mb-2 text-base font-semibold">1. Responsable del tratamiento</h2>
            <p className="text-muted-foreground">
              AMERICO Minimarket, con domicilio en Sgto. Daniel Rebolledo 0739, La Pintana, Región Metropolitana, es el responsable del tratamiento de sus datos personales conforme a la Ley N° 19.628 sobre Protección de la Vida Privada.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">2. Datos que recopilamos</h2>
            <p className="text-muted-foreground">Recopilamos los siguientes datos personales:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Nombre y correo electrónico (para crear su cuenta y procesar pedidos)</li>
              <li>Número de teléfono (opcional, para coordinación de despacho)</li>
              <li>Dirección de entrega (para pedidos con despacho a domicilio)</li>
              <li>Historial de compras (para gestión de pedidos y servicio al cliente)</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">3. Finalidad del tratamiento</h2>
            <p className="text-muted-foreground">
              Sus datos personales se utilizan exclusivamente para: procesar y gestionar sus pedidos, enviar notificaciones sobre el estado de sus compras, mejorar nuestros servicios, y cumplir con obligaciones legales. No compartimos sus datos con terceros, salvo cuando sea estrictamente necesario para la ejecución del servicio (como servicios de pago o despacho).
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">4. Seguridad de los datos</h2>
            <p className="text-muted-foreground">
              Implementamos medidas técnicas y organizativas para proteger sus datos personales contra acceso no autorizado, pérdida o divulgación. Las contraseñas se almacenan encriptadas y nunca en texto plano.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">5. Sus derechos</h2>
            <p className="text-muted-foreground">
              Conforme a la Ley N° 19.628, usted tiene derecho a acceder, rectificar, cancelar y oponerse al tratamiento de sus datos personales. Para ejercer estos derechos, contáctenos directamente en tienda o a través de los canales de atención disponibles.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">6. Cookies</h2>
            <p className="text-muted-foreground">
              Nuestra plataforma utiliza cookies estrictamente necesarias para el funcionamiento del sitio (sesión, carrito de compras). No utilizamos cookies de seguimiento ni publicidad de terceros.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">7. Contacto</h2>
            <p className="text-muted-foreground">
              Para consultas sobre el tratamiento de sus datos, visítenos en Sgto. Daniel Rebolledo 0739, La Pintana, Región Metropolitana, o contáctenos a través de nuestros canales de atención al cliente.
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
