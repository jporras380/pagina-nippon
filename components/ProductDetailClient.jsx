"use client";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
const PriceDisplay = dynamic(() => import("./PriceDisplay"), { ssr: false });
import ProductCard from "./ProductCard";

export default function ProductDetailClient({
  producto, marca, modelo, categoria, relacionados, todasMarcas, todasCategorias
}) {
  const [fotoActiva, setFotoActiva] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [lightbox, setLightbox] = useState(false);
  const imgRef = useRef(null);

  const fotos = producto.imagenes?.filter(Boolean) || [];
  const fotoActual = fotos[fotoActiva] || null;

  const tieneOferta = producto.precio_oferta &&
    producto.oferta_hasta &&
    new Date(producto.oferta_hasta) > new Date();

  // Manejo del zoom con mouse
  const handleMouseMove = useCallback((e) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) });
  }, []);

  const ESTADO_STYLES = {
    "disponible": "bg-green-50 text-green-700 border-green-200",
    "últimas unidades": "bg-amber-50 text-amber-700 border-amber-200",
    "pre-venta": "bg-blue-50 text-blue-700 border-blue-200",
    "agotado": "bg-red-50 text-red-500 border-red-200",
  };
  const estadoStyle = ESTADO_STYLES[producto.estado] || ESTADO_STYLES["disponible"];
  const [filtroTaller, setFiltroTaller] = useState("pendiente");
  const waMsg = encodeURIComponent(
    producto.whatsapp_mensaje ||
    "Hola, consulto por " + producto.nombre + " (SKU: " + producto.sku + ")"
  );

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
            <Link href="/" className="hover:text-gray-600 transition">Inicio</Link>
            <span>/</span>
            <Link href="/catalogo" className="hover:text-gray-600 transition">Catálogo</Link>
            {marca && (
              <>
                <span>/</span>
                <Link href={"/marcas/" + marca.id} className="hover:text-gray-600 transition">{marca.nombre}</Link>
              </>
            )}
            {modelo && (
              <>
                <span>/</span>
                <Link href={"/marcas/" + marca?.id + "/" + modelo.id} className="hover:text-gray-600 transition">{modelo.nombre}</Link>
              </>
            )}
            {categoria && (
              <>
                <span>/</span>
                <span className="text-gray-500">{categoria.nombre}</span>
              </>
            )}
            <span>/</span>
            <span className="text-gray-700 font-medium truncate max-w-xs">{producto.nombre}</span>
          </div>
        </div>
      </div>

      {/* Detalle principal */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

            {/* Columna izquierda — galería */}
            <div className="p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-100">

              {/* Imagen principal con zoom */}
              <div
                ref={imgRef}
                className="relative h-72 sm:h-96 bg-gray-50 rounded-2xl overflow-hidden mb-4 cursor-zoom-in select-none"
                onMouseEnter={() => fotos.length > 0 && setZoom(true)}
                onMouseLeave={() => setZoom(false)}
                onMouseMove={handleMouseMove}
                onClick={() => fotos.length > 0 && setLightbox(true)}
              >
                {fotoActual ? (
                  <>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={fotoActiva}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={fotoActual}
                          alt={producto.nombre}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-contain p-6"
                          priority
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Lupa zoom overlay */}
                    <AnimatePresence>
                      {zoom && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            backgroundImage: "url(" + fotoActual + ")",
                            backgroundSize: "250%",
                            backgroundPosition: zoomPos.x + "% " + zoomPos.y + "%",
                            backgroundRepeat: "no-repeat",
                          }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Indicador zoom */}
                    {!zoom && (
                      <div className="absolute top-3 right-3 bg-white/90 rounded-lg p-1.5 shadow-sm border border-gray-100">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-500">
                          <circle cx="11" cy="11" r="8"/>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                          <line x1="11" y1="8" x2="11" y2="14"/>
                          <line x1="8" y1="11" x2="14" y2="11"/>
                        </svg>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gray-300">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <span className="text-gray-400 text-sm">Sin imagen</span>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                  {tieneOferta && (
                    <span className="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow">
                      OFERTA
                    </span>
                  )}
                  <span className={"text-xs font-semibold px-2.5 py-1 rounded-full border " + estadoStyle}>
                    {producto.estado}
                  </span>
                </div>
              </div>

              {/* Thumbnails */}
              {fotos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {fotos.map((foto, i) => (
                    <button
                      key={i}
                      onClick={() => setFotoActiva(i)}
                      className={"relative w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all duration-200 " +
                        (i === fotoActiva
                          ? "border-red-500 shadow-md"
                          : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100")}
                    >
                      <Image
                        src={foto}
                        alt={"Foto " + (i + 1)}
                        fill
                        sizes="64px"
                        className="object-contain bg-gray-50 p-1"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Hint zoom */}
              {fotos.length > 0 && (
                <p className="text-gray-400 text-xs text-center mt-3">
                  Pasa el cursor sobre la imagen para hacer zoom · Click para ampliar
                </p>
              )}
            </div>

            {/* Columna derecha — info */}
            <div className="p-6 lg:p-8">

              {/* Marca + categoría */}
              <div className="flex items-center gap-2 mb-3">
                {marca && (
                  <Link href={"/marcas/" + marca.id}
                    className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-xs font-semibold text-gray-600 transition">
                    <Image
                      src={marca.logo}
                      alt={marca.nombre}
                      width={16}
                      height={16}
                      className="object-contain w-4 h-4"
                    />
                    {marca.nombre}
                  </Link>
                )}
                {categoria && (
                  <span className="bg-red-50 text-red-600 text-xs font-semibold px-3 py-1 rounded-full border border-red-100">
                    {categoria.icono} {categoria.nombre}
                  </span>
                )}
              </div>

              {/* Nombre */}
              <h1 className="text-zinc-900 font-black text-xl sm:text-2xl leading-tight mb-2">
                {producto.nombre}
              </h1>

              {/* SKU y código */}
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="text-gray-400 text-xs">
                  SKU: <span className="text-gray-600 font-semibold">{producto.sku}</span>
                </span>
                <span className="text-gray-300">·</span>
                <span className="text-gray-400 text-xs">
                  Cód: <span className="text-gray-600 font-semibold">{producto.codigo}</span>
                </span>
                {modelo && (
                  <>
                    <span className="text-gray-300">·</span>
                    <span className="text-gray-400 text-xs">
                      Modelo: <span className="text-gray-600 font-semibold">{modelo.nombre}</span>
                    </span>
                  </>
                )}
              </div>

              {/* Descripción */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {producto.descripcion}
              </p>

              {/* Detalle condición */}
              {producto.detalle_condicion && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 mb-5">
                  <div className="flex items-start gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-blue-500 mt-0.5 flex-shrink-0">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <div>
                      <p className="text-blue-700 text-xs font-bold mb-0.5 uppercase tracking-wide">Condición del producto</p>
                      <p className="text-blue-600 text-sm leading-relaxed">{producto.detalle_condicion}</p>
                    </div>
                  </div>
                </div>
              )}

{/* Video YouTube — solo para motores */}
{producto.categoria_id === "motores" && (
  <div className="mb-5">
    {producto.motor_encendido && producto.video_youtube ? (
      <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 bg-white">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          <p className="text-sm font-black text-zinc-900">Motor verificado en taller</p>
          {producto.fecha_encendido && (
            <span className="text-gray-400 text-xs ml-auto">
              {new Date(producto.fecha_encendido).toLocaleDateString("es-PE")}
            </span>
          )}
        </div>
        {/* Video embed */}
        {(() => {
          const match = producto.video_youtube.match(/(?:v=|youtu\.be\/)([^&\s]+)/);
          const videoId = match?.[1];
          return videoId ? (
            <div className="aspect-video">
              <iframe
                src={"https://www.youtube.com/embed/" + videoId + "?rel=0"}
                className="w-full h-full"
                allowFullScreen
                title={"Motor " + producto.nombre}
                loading="lazy"
              />
            </div>
          ) : null;
        })()}
        {/* Info compresión */}
        {(producto.compresion || producto.tecnico_taller) && (
          <div className="flex flex-wrap gap-3 px-4 py-2.5 bg-white border-t border-gray-100">
            {producto.compresion && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500">Compresión:</span>
                <span className="text-xs font-bold text-zinc-900">{producto.compresion}</span>
              </div>
            )}
            {producto.tecnico_taller && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500">Verificado por:</span>
                <span className="text-xs font-bold text-zinc-900">{producto.tecnico_taller}</span>
              </div>
            )}
          </div>
        )}
      </div>
    ) : (
      /* Motor no encendido aún */
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
        <span className="text-xl flex-shrink-0">⚠️</span>
        <div>
          <p className="text-amber-800 font-black text-sm">Motor pendiente de verificación</p>
          <p className="text-amber-600 text-xs mt-0.5 leading-relaxed">
            Este motor aún no ha sido encendido en nuestro taller.
            Será verificado próximamente y se subirá el video de comprobación.
            Puedes consultarnos por WhatsApp para más información.
          </p>
        </div>
      </div>
    )}
  </div>
)}


              {/* Separador */}
              <div className="border-t border-gray-100 my-5" />

              {/* Precio */}
              <div className="mb-5">
                <PriceDisplay producto={producto} size="lg" />
              </div>

              {/* Badges de garantía */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                {[
                  { icon: "🚢", title: "Importado directo", sub: "Desde Japón" },
                  { icon: "✅", title: "Verificado", sub: "Control de calidad" },
                  { icon: "📦", title: "Stock real", sub: "Listo para entrega" },
                  { icon: "💬", title: "Asesoría", sub: "Por WhatsApp" },
                ].map((b) => (
                  <div key={b.title} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                    <span className="text-lg">{b.icon}</span>
                    <div>
                      <p className="text-zinc-800 text-xs font-bold">{b.title}</p>
                      <p className="text-gray-400 text-xs">{b.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botones CTA */}
              <div className="flex flex-col gap-3">
                
                 <a href={"https://wa.me/51994006303?text=" + waMsg}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 bg-green-600 hover:bg-green-500 text-white font-black py-3.5 rounded-2xl text-sm transition-all duration-200 shadow-lg shadow-green-100 hover:-translate-y-0.5"
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741 1.018.982-3.656-.236-.374A9.86 9.86 0 012.1 12.042C2.1 6.545 6.545 2.1 12.042 2.1c2.624 0 5.092 1.025 6.944 2.876a9.787 9.787 0 012.876 6.945c-.003 5.497-4.448 9.941-9.94 9.941z"/>
                  </svg>
                  Consultar disponibilidad por WhatsApp
                </a>

                {/* Placeholder carrito — visible a futuro */}
                <button
                  disabled
                  title="Próximamente — integración con Odoo"
                  className="flex items-center justify-center gap-2 bg-gray-100 text-gray-400 font-bold py-3 rounded-2xl text-sm cursor-not-allowed border border-dashed border-gray-200"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6"/>
                  </svg>
                  Añadir al carrito — próximamente
                </button>

                <Link
                  href={modelo ? "/marcas/" + marca?.id + "/" + modelo.id : "/catalogo"}
                  className="flex items-center justify-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm font-semibold transition py-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                  Volver a {modelo?.nombre || "catálogo"}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Productos relacionados */}
        {relacionados.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-zinc-900">Productos relacionados</h2>
                <p className="text-gray-400 text-sm mt-0.5">
                  Más autopartes para {modelo?.nombre || marca?.nombre || "este vehículo"}
                </p>
              </div>
              <Link
                href="/catalogo"
                className="text-red-500 hover:text-red-600 text-sm font-semibold transition flex items-center gap-1"
              >
                Ver todo
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {relacionados.map((p, i) => (
                <ProductCard key={p.id} producto={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && fotoActual && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.95)" }}
            onClick={() => setLightbox(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-3xl aspect-square bg-white rounded-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={fotos[fotoActiva]}
                alt={producto.nombre}
                fill
                sizes="100vw"
                className="object-contain p-10"
              />
              {fotos.length > 1 && (
                <>
                  <button
                    onClick={() => setFotoActiva(p => (p - 1 + fotos.length) % fotos.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="15 18 9 12 15 6"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => setFotoActiva(p => (p + 1) % fotos.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                </>
              )}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-4 py-1.5 rounded-full">
                {fotoActiva + 1} / {fotos.length}
              </div>
            </motion.div>
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}