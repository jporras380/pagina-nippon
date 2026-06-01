import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Nosotros — NipponAutoparts",
  description: "Importadores directos de autopartes japonesas. Calidad garantizada desde Japón al Perú.",
};

const STATS = [
  { valor: "13,000+", label: "Autopartes en catálogo", icono: "📦" },
  { valor: "10+", label: "Marcas japonesas", icono: "🚗" },
  { valor: "1–3", label: "Contenedores por mes", icono: "🚢" },
  { valor: "100%", label: "Originales japonesas", icono: "✅" },
];

const VALORES = [
  {
    icono: "🇯🇵",
    titulo: "Origen garantizado",
    desc: "Importamos directamente desde Japón — sin intermediarios. Cada autoparte tiene trazabilidad de origen.",
  },
  {
    icono: "🔍",
    titulo: "Verificación en taller",
    desc: "Todos nuestros motores son encendidos y verificados en taller antes de la venta. Medimos compresión y grabamos video.",
  },
  {
    icono: "💬",
    titulo: "Asesoría personalizada",
    desc: "Nuestro equipo conoce cada modelo y chasis. Te ayudamos a encontrar exactamente la pieza que necesitas.",
  },
  {
    icono: "🚚",
    titulo: "Despacho rápido",
    desc: "Stock real disponible en tienda. Sin esperas innecesarias — lo que ves en el catálogo está físicamente en Lima.",
  },
];

const PROCESO = [
  {
    numero: "01",
    titulo: "Selección en Japón",
    desc: "Nuestros proveedores en Japón seleccionan los vehículos y autopartes de mayor calidad, verificando kilometraje y estado.",
    color: "bg-red-50 border-red-200",
    numColor: "text-red-500",
  },
  {
    numero: "02",
    titulo: "Desarmado y embalaje",
    desc: "Los vehículos se desarman correctamente y se embalan para proteger cada pieza durante el transporte marítimo.",
    color: "bg-blue-50 border-blue-200",
    numColor: "text-blue-500",
  },
  {
    numero: "03",
    titulo: "Importación CDK",
    desc: "Importamos en formato CDK — todo el vehículo excepto el chasis metálico (prohibido en Perú). Incluye motor, caja, carrocería y plásticos.",
    color: "bg-amber-50 border-amber-200",
    numColor: "text-amber-500",
  },
  {
    numero: "04",
    titulo: "Verificación en taller",
    desc: "Al llegar a Lima, nuestro equipo técnico enciende los motores, mide la compresión y documenta el estado con video.",
    color: "bg-green-50 border-green-200",
    numColor: "text-green-500",
  },
  {
    numero: "05",
    titulo: "Disponible para el cliente",
    desc: "Una vez verificado, el producto se publica en el catálogo con fotos reales, video de encendido y precio transparente.",
    color: "bg-purple-50 border-purple-200",
    numColor: "text-purple-500",
  },
];

const FOTOS = [
  { src: "/nosotros/local-01.jpg", alt: "Local NipponAutoparts", span: "col-span-2 row-span-2" },
  { src: "/nosotros/almacen-01.jpg", alt: "Almacén de autopartes" },
  { src: "/nosotros/taller-01.jpg", alt: "Taller de verificación" },
  { src: "/nosotros/equipo-01.jpg", alt: "Equipo NipponAutoparts" },
  { src: "/nosotros/contenedor-01.jpg", alt: "Descarga de contenedor" },
];

export default function NosotrosPage() {
  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <div className="bg-gray-50 border-b border-gray-100 pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
            <Link href="/" className="hover:text-gray-600 transition">Inicio</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">Nosotros</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block bg-red-50 text-red-600 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider mb-4">
                🇯🇵 Importadores directos desde Japón
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 leading-tight mb-4">
                La autoparte japonesa
                <span className="text-red-600"> que buscas,</span>
                <br />en Lima
              </h1>
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                Somos NipponAutoparts S.R.L., empresa peruana especializada en
                importación directa de autopartes japonesas. Cada mes traemos
                contenedores con motores, cajas, carrocería y más — verificados
                en nuestro taller antes de llegar a tus manos.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/catalogo"
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-2xl text-sm transition shadow-lg shadow-red-100"
                >
                  Ver catálogo
                </Link>
                
                <a  href="https://wa.me/51994006303"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-gray-50 border border-gray-200 text-zinc-700 font-bold px-6 py-3 rounded-2xl text-sm transition"
                >
                  Contactar equipo
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {STATS.map((s) => (
                <div key={s.label}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
                  <div className="text-3xl mb-2">{s.icono}</div>
                  <p className="text-zinc-900 font-black text-2xl mb-0.5">{s.valor}</p>
                  <p className="text-gray-500 text-xs leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Galería del local */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-red-500 rounded-full" />
          <h2 className="text-2xl font-black text-zinc-900">Nuestro local</h2>
        </div>

        <div className="grid grid-cols-3 grid-rows-2 gap-3 h-80 sm:h-96">
          {/* Foto grande */}
          <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
              <div className="text-center">
                <div className="text-5xl mb-2">🏪</div>
                <p className="text-sm font-semibold">Foto del local</p>
                <p className="text-xs">Sube a /public/nosotros/local-01.jpg</p>
              </div>
            </div>
            {/* Cuando suban la foto, este Image se activa */}
            {/* <Image src="/nosotros/local-01.jpg" alt="Local" fill className="object-cover" /> */}
          </div>

          {/* Fotos pequeñas */}
          {[
            { label: "Almacén", file: "almacen-01.jpg", emoji: "📦" },
            { label: "Taller", file: "taller-01.jpg", emoji: "🔧" },
            { label: "Equipo", file: "equipo-01.jpg", emoji: "👥" },
            { label: "Contenedor", file: "contenedor-01.jpg", emoji: "🚢" },
          ].slice(0, 2).map((f) => (
            <div key={f.file}
              className="relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl mb-1">{f.emoji}</div>
                <p className="text-gray-400 text-xs">{f.label}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-gray-400 text-xs text-center mt-3">
          📸 NOTA FALTA IMAGEN DE LA EMPRESA <code className="bg-gray-100 px-1 rounded">public/nosotros/</code> RECORDAR DESCOMENTAR IMAGEN EL CODIGO
        </p>
      </div>

      {/* Historia */}
      <div className="bg-gray-50 border-y border-gray-100 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-red-500 rounded-full" />
            <h2 className="text-2xl font-black text-zinc-900">Nuestra historia</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <p className="text-gray-600 leading-relaxed">
                NipponAutoparts nació de una necesidad clara en el mercado peruano:
                acceder a autopartes japonesas de calidad sin pagar precios
                exorbitantes por intermediarios. Identificamos que Japón renueva
                su flota vehicular constantemente, generando un excedente de
                autopartes en perfecto estado.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Desarrollamos relaciones directas con proveedores japoneses
                y establecimos un sistema de importación eficiente que nos
                permite traer motores, cajas de cambio, carrocería y accesorios
                a precios competitivos — manteniendo siempre la calidad original.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Hoy contamos con más de 13,000 referencias en catálogo,
                atendemos a mecánicos, talleres y propietarios en todo Lima
                y enviamos a provincias.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { año: "Inicio", hito: "Primeros contenedores desde Japón — motores Toyota y Nissan" },
                { año: "Crecimiento", hito: "Ampliamos a 10+ marcas japonesas y abrimos tienda en Av. Colonial" },
                { año: "Expansión", hito: "Más de 13,000 productos en catálogo y envíos a provincias" },
                { año: "Hoy", hito: "Contenedores mensuales, taller de verificación propio y plataforma digital" },
              ].map((h, i) => (
                <div key={i} className="flex gap-4 items-start bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 font-black text-xs text-center leading-tight">{h.año}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{h.hito}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Proceso de importación */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-8 bg-red-500 rounded-full" />
          <h2 className="text-2xl font-black text-zinc-900">
            Cómo importamos
          </h2>
        </div>
        <p className="text-gray-500 text-sm mb-8 ml-5">
          De Japón a tu taller — proceso transparente paso a paso
        </p>

        <div className="flex flex-col gap-4">
          {PROCESO.map((p, i) => (
            <div key={i}
              className={"flex items-start gap-4 rounded-2xl p-5 border " + p.color}>
              <div className={"font-black text-3xl flex-shrink-0 " + p.numColor}>
                {p.numero}
              </div>
              <div>
                <h3 className="font-black text-zinc-900 text-base mb-1">{p.titulo}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CDK Explicación */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <h3 className="font-black text-amber-800 text-base mb-2">
            🔧 ¿Qué significa CDK?
          </h3>
          <p className="text-amber-700 text-sm leading-relaxed mb-3">
            CDK (Completely Knocked Down) significa que importamos el vehículo
            completamente desarmado. En Perú está prohibida la importación del
            chasis metálico, por lo que traemos todo lo demás:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              "✅ Motor", "✅ Caja de cambios", "✅ Puertas",
              "✅ Faros y luces", "✅ Capot y guardafangos", "✅ Parachoques",
              "✅ Plásticos internos", "✅ Tablero", "✅ Asientos",
              "✅ Parabrisas", "❌ Chasis/bastidor", "❌ Techo (a veces)",
            ].map((item) => (
              <span key={item} className={"text-xs font-semibold px-2.5 py-1.5 rounded-lg " +
                (item.startsWith("✅")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600")}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Valores */}
      <div className="bg-zinc-950 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-red-500 rounded-full" />
            <h2 className="text-2xl font-black text-white">
              Por qué elegirnos
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VALORES.map((v) => (
              <div key={v.titulo}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition">
                <div className="text-3xl mb-3">{v.icono}</div>
                <h3 className="text-white font-black text-base mb-1">{v.titulo}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ubicación */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-red-500 rounded-full" />
          <h2 className="text-2xl font-black text-zinc-900">Encuéntranos</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Info */}
          <div className="flex flex-col gap-4">
            {[
              {
                icono: "📍",
                titulo: "Dirección",
                detalle: "Av. Colonial 515, Cercado de Lima",
                link: "https://maps.google.com/?q=Av.+Colonial+515,+Cercado+de+Lima",
                cta: "Ver en Google Maps",
              },
              {
                icono: "🕘",
                titulo: "Horario de atención",
                detalle: "Lun–Vie: 9:00 am – 5:30 pm\nSáb: 9:00 am – 1:30 pm",
              },
              {
                icono: "📞",
                titulo: "Teléfono fijo",
                detalle: "01 431 4148",
                link: "tel:0114314148",
                cta: "Llamar",
              },
              {
                icono: "💬",
                titulo: "WhatsApp",
                detalle: "+51 994 006 303",
                link: "https://wa.me/51994006303",
                cta: "Escribir mensaje",
                ctaColor: "bg-green-600 hover:bg-green-500",
              },
              {
                icono: "✉️",
                titulo: "Correo electrónico",
                detalle: "nippon.ventas@gmail.com",
                link: "mailto:nippon.ventas@gmail.com",
                cta: "Enviar email",
              },
            ].map((item) => (
              <div key={item.titulo}
                className="flex items-start gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-xl border border-gray-200 flex items-center justify-center flex-shrink-0 text-xl">
                  {item.icono}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-zinc-900 text-sm">{item.titulo}</p>
                  <p className="text-gray-500 text-xs mt-0.5 whitespace-pre-line">{item.detalle}</p>
                </div>
                {item.link && (
                  
                  <a href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={"flex-shrink-0 text-white font-bold text-xs px-3 py-2 rounded-xl transition " +
                      (item.ctaColor || "bg-zinc-800 hover:bg-zinc-700")}
                  >
                    {item.cta}
                  </a>
                )}
              </div>
            ))}

            {/* Redes sociales */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <p className="font-bold text-zinc-900 text-sm mb-3">Síguenos en redes</p>
              <div className="flex justify-center gap-3 flex-wrap">
  
   <a href="https://facebook.com/LasMejoresAutopartesDelPeru"
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col items-center gap-1 text-white font-bold px-5 py-3 rounded-2xl transition bg-blue-600 hover:bg-blue-500"
  >
    <span className="text-sm font-black">Facebook</span>
    <span className="text-xs opacity-75">@LasMejoresAutopartesDelPeru</span>
  </a>
  
   <a href="https://youtube.com/@NipponAutopartsVentasPeru"
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col items-center gap-1 text-white font-bold px-5 py-3 rounded-2xl transition bg-red-600 hover:bg-red-500"
  >
    <span className="text-sm font-black">YouTube</span>
    <span className="text-xs opacity-75">@NipponAutopartsVentasPeru</span>
  </a>
  
   <a href="https://tiktok.com/@nipponautopartslima"
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col items-center gap-1 text-white font-bold px-5 py-3 rounded-2xl transition bg-zinc-900 hover:bg-zinc-700"
  >
    <span className="text-sm font-black">TikTok</span>
    <span className="text-xs opacity-75">@nipponautopartslima</span>
  </a>
</div>
               
              </div>
            </div>
          </div>

          {/* Mapa */}
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm h-96 lg:h-auto">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.5!2d-77.0553!3d-12.0464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sAv.+Colonial+515%2C+Cercado+de+Lima!5e0!3m2!1ses!2spe!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "300px" }}
              allowFullScreen
              loading="lazy"
              title="Ubicación NipponAutoparts"
            />
          </div>
        </div>
      </div>

         

    
  );
}