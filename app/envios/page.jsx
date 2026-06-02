import Link from "next/link";

export const metadata = {
  title: "Envíos y Pagos — NipponAutoparts",
  description: "Información sobre envíos a provincias, tarifas de embalaje y métodos de pago.",
};

const TARIFAS = [
  { categoria: "Motores completos", emoji: "⚙️", precio: "S/ 150", desc: "Embalaje especial con espuma y madera" },
  { categoria: "Cajas de cambio", emoji: "🔧", precio: "S/ 120", desc: "Embalaje reforzado con strapping" },
  { categoria: "Capots y compuertas", emoji: "🚗", precio: "S/ 80", desc: "Embalaje con cartón y plástico burbuja" },
  { categoria: "Puertas y guardafangos", emoji: "🚪", precio: "S/ 60", desc: "Embalaje con cartón reforzado" },
  { categoria: "Faros y espejos", emoji: "💡", precio: "S/ 40", desc: "Embalaje con plástico burbuja doble" },
  { categoria: "Aros de llantas", emoji: "⭕", precio: "S/ 50", desc: "Embalaje individual por aro" },
  { categoria: "Piezas pequeñas", emoji: "📦", precio: "S/ 20", desc: "Caja estándar con relleno" },
];

const PAGOS = [
  {
    nombre: "Yape / Plin",
    emoji: "📱",
    color: "bg-purple-50 border-purple-200",
    badge: "bg-purple-100 text-purple-700",
    desc: "Escanea el QR que te enviamos por WhatsApp",
    pasos: ["Solicita el QR por WhatsApp", "Escanea con tu app Yape o Plin", "Envía el comprobante de pago"],
  },
  {
    nombre: "Transferencia bancaria",
    emoji: "🏦",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    desc: "Transfiere al número de cuenta de la empresa",
    pasos: ["Solicita los datos bancarios por WhatsApp", "Realiza la transferencia", "Envía el comprobante de pago"],
  },
  {
    nombre: "Abono en cuenta",
    emoji: "💳",
    color: "bg-green-50 border-green-200",
    badge: "bg-green-100 text-green-700",
    desc: "Deposita en ventanilla o agente bancario",
    pasos: ["Solicita número de cuenta por WhatsApp", "Realiza el depósito en cualquier agente", "Envía foto del voucher"],
  },
];

const AGENCIAS = [
  { nombre: "Olva Courier", emoji: "📦", cobertura: "Todo el Perú" },
  { nombre: "Shalom", emoji: "🚚", cobertura: "Todo el Perú" },
  { nombre: "GRT", emoji: "📫", cobertura: "Lima y provincias" },
  { nombre: "Cruz del Sur Cargo", emoji: "🚌", cobertura: "Principales ciudades" },
];

export default function EnviosPage() {
  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <div className="bg-gray-50 border-b border-gray-100 pt-24 pb-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-gray-600 transition">Inicio</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">Envíos y Pagos</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 mb-2">
            Envíos y Pagos
          </h1>
          <p className="text-gray-500 text-base max-w-xl">
            Enviamos autopartes a todo el Perú. Aquí encontrarás las tarifas
            de embalaje, métodos de pago y cómo funciona el proceso.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-10">

        {/* Cómo funciona */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-red-500 rounded-full" />
            <h2 className="text-2xl font-black text-zinc-900">¿Cómo funciona?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { num: "1", titulo: "Elige tu autoparte", desc: "Encuentra la pieza en el catálogo y contáctanos por WhatsApp", emoji: "🔍" },
              { num: "2", titulo: "Confirma y paga", desc: "Te enviamos los datos de pago — Yape, transferencia o abono", emoji: "💳" },
              { num: "3", titulo: "Embalamos", desc: "Preparamos la pieza con embalaje adecuado según su tipo", emoji: "📦" },
              { num: "4", titulo: "Enviamos", desc: "Despachamos a la agencia de tu preferencia — tú pagas el flete", emoji: "🚚" },
            ].map((paso) => (
              <div key={paso.num}
                className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-black text-sm">{paso.num}</span>
                </div>
                <div className="text-2xl mb-2">{paso.emoji}</div>
                <p className="font-black text-zinc-900 text-sm mb-1">{paso.titulo}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{paso.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Aviso flete */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
          <span className="text-3xl flex-shrink-0">⚠️</span>
          <div>
            <p className="font-black text-amber-800 text-base mb-1">
              El flete NO está incluido
            </p>
            <p className="text-amber-700 text-sm leading-relaxed">
              NipponAutoparts cubre el <strong>embalaje</strong> de la pieza.
              El costo del flete interprovincial (Olva, Shalom, GRT, etc.)
              lo paga el cliente directamente a la agencia de transporte.
              Coordinamos el envío a la agencia de tu preferencia en Lima.
            </p>
          </div>
        </div>

        {/* Tarifas de embalaje */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-red-500 rounded-full" />
            <h2 className="text-2xl font-black text-zinc-900">Tarifas de embalaje</h2>
          </div>
          <p className="text-gray-500 text-sm mb-4 -mt-2">
            Precios referenciales — pueden variar según el tamaño y peso exacto de la pieza.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TARIFAS.map((t) => (
              <div key={t.categoria}
                className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-2xl flex-shrink-0">
                  {t.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-zinc-900 text-sm">{t.categoria}</p>
                  <p className="text-gray-400 text-xs">{t.desc}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className="bg-red-50 border border-red-200 text-red-600 font-black text-sm px-3 py-1 rounded-full">
                    {t.precio}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-gray-400 text-xs mt-3 text-center">
            * Precios incluyen materiales de embalaje. No incluyen flete.
          </p>
        </div>

        {/* Métodos de pago */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-red-500 rounded-full" />
            <h2 className="text-2xl font-black text-zinc-900">Métodos de pago</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PAGOS.map((p) => (
              <div key={p.nombre}
                className={"rounded-2xl p-5 border " + p.color}>
                <div className="text-3xl mb-3">{p.emoji}</div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-black text-zinc-900 text-base">{p.nombre}</h3>
                  <span className={"text-xs font-bold px-2 py-0.5 rounded-full " + p.badge}>
                    Disponible
                  </span>
                </div>
                <p className="text-gray-500 text-xs mb-3 leading-relaxed">{p.desc}</p>
                <div className="flex flex-col gap-1.5">
                  {p.pasos.map((paso, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-4 h-4 bg-white rounded-full border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-gray-600 text-xs leading-relaxed">{paso}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agencias */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-red-500 rounded-full" />
            <h2 className="text-2xl font-black text-zinc-900">Agencias de transporte</h2>
          </div>
          <p className="text-gray-500 text-sm mb-4 -mt-2">
            Trabajamos con las principales agencias. Tú eliges la de tu preferencia.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {AGENCIAS.map((a) => (
              <div key={a.nombre}
                className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center">
                <div className="text-3xl mb-2">{a.emoji}</div>
                <p className="font-bold text-zinc-900 text-sm">{a.nombre}</p>
                <p className="text-gray-400 text-xs mt-0.5">{a.cobertura}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cobertura */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <span className="text-4xl flex-shrink-0">🇵🇪</span>
            <div>
              <h3 className="font-black text-zinc-900 text-lg mb-1">
                Solo enviamos dentro del Perú
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-3">
                Actualmente hacemos envíos a todas las regiones del Perú.
                No realizamos envíos internacionales.
                Para Lima Metropolitana puedes recoger en nuestra tienda
                o coordinar delivery local.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Lima", "Arequipa", "Trujillo", "Chiclayo", "Piura",
                  "Cusco", "Iquitos", "Huancayo", "y más..."].map((ciudad) => (
                  <span key={ciudad}
                    className="bg-white border border-gray-200 text-gray-600 text-xs px-2.5 py-1 rounded-full font-medium">
                    {ciudad}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-red-600 rounded-3xl p-8 text-center">
          <h3 className="text-white font-black text-2xl mb-2">
            ¿Listo para hacer tu pedido?
          </h3>
          <p className="text-red-200 text-sm mb-6">
            Escríbenos por WhatsApp y te ayudamos con el proceso completo
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            
            <a href={"https://wa.me/51994006303?text=" + encodeURIComponent(
                "Hola, quiero hacer un pedido y coordinar el envío a provincias"
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-black px-8 py-3.5 rounded-full transition text-sm"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741 1.018.982-3.656-.236-.374A9.86 9.86 0 012.1 12.042C2.1 6.545 6.545 2.1 12.042 2.1c2.624 0 5.092 1.025 6.944 2.876a9.787 9.787 0 012.876 6.945c-.003 5.497-4.448 9.941-9.94 9.941z"/>
              </svg>
              Consultar por WhatsApp
            </a>
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-red-600 font-black px-8 py-3.5 rounded-full transition text-sm"
            >
              Ver catálogo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}