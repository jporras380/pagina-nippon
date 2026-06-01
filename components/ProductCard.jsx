"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
const PriceDisplay = dynamic(() => import("./PriceDisplay"), { ssr: false });
import Link from "next/link";

const ESTADO_STYLES = {
  "disponible":       "bg-green-100 text-green-700 border-green-200",
  "últimas unidades": "bg-amber-100 text-amber-700 border-amber-200",
  "pre-venta":        "bg-blue-100 text-blue-700 border-blue-200",
  "agotado":          "bg-red-100 text-red-600 border-red-200",
};

export default function ProductCard({ producto, index = 0 }) {
  const [lightbox, setLightbox] = useState(false);
  const [fotoActiva, setFotoActiva] = useState(0);
  const [showDetalle, setShowDetalle] = useState(false);

  const fotos = producto.imagenes?.filter(Boolean) || [];

  useEffect(() => {
    if (lightbox) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  useEffect(() => {
    const fn = (e) => {
      if (!lightbox) return;
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") setFotoActiva(p => (p + 1) % fotos.length);
      if (e.key === "ArrowLeft") setFotoActiva(p => (p - 1 + fotos.length) % fotos.length);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [lightbox, fotos.length]);

  const estadoStyle = ESTADO_STYLES[producto.estado] || ESTADO_STYLES["disponible"];
  const tieneOferta = producto.precio_oferta &&
    producto.oferta_hasta &&
    new Date(producto.oferta_hasta) > new Date();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: Math.min(index * 0.06, 0.4) }}
        className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
      >
        {/* Imagen */}
        <div
          className="relative h-48 bg-gray-50 overflow-hidden cursor-zoom-in"
          onClick={() => fotos.length > 0 && setLightbox(true)}
        >
          {fotos.length > 0 ? (
            <motion.div
              className="absolute inset-0"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
            >
              <Image
                src={fotos[0]}
                alt={producto.nombre}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-contain p-4"
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-50">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gray-300">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span className="text-gray-400 text-xs">Sin imagen</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {tieneOferta && (
              <span className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
                OFERTA
              </span>
            )}
            <span className={"text-xs font-semibold px-2 py-0.5 rounded-full border " + estadoStyle}>
              {producto.estado}
            </span>
          </div>

          {fotos.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
              {fotos.length} fotos
            </div>
          )}

          {fotos.length > 0 && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-all bg-white/90 rounded-full px-3 py-1.5 text-xs font-bold text-zinc-700 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
                Ver fotos
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          {/* Nombre y SKU */}
          <Link href={"/catalogo/" + producto.id}>
            <h3 className="text-zinc-900 font-black text-sm leading-tight mb-0.5 hover:text-red-600 transition-colors cursor-pointer">
              {producto.nombre}
            </h3>
          </Link>
          <p className="text-zinc-400 text-xs mb-2">
            SKU: {producto.sku} · Cód: {producto.codigo}
          </p>

          {/* Descripción */}
          <p className="text-zinc-500 text-xs leading-relaxed mb-3">
            {producto.descripcion}
          </p>

          {/* Detalle condición - toggle */}
          {producto.detalle_condicion && (
            <button
              onClick={() => setShowDetalle(!showDetalle)}
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 mb-3 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {showDetalle ? "Ocultar condición" : "Ver condición del producto"}
              <svg
                width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round"
                className={"transition-transform duration-200 " + (showDetalle ? "rotate-180" : "")}
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
          )}

          <AnimatePresence>
            {showDetalle && producto.detalle_condicion && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 mb-3">
                  <p className="text-blue-700 text-xs leading-relaxed">
                    {producto.detalle_condicion}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Precio */}
          <div className="mb-3">
            <PriceDisplay producto={producto} size="md" />
          </div>
          {/* Botones */}
<div className="flex flex-col gap-2">
  {/* Ver detalle */}
  <Link
    href={"/catalogo/" + producto.id}
    className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all duration-200"
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
    Ver detalle
  </Link>
{/* Carrito — próximamente */}
  <button
    disabled
    title="Próximamente — integración con Odoo"
    className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-400 font-bold py-2.5 rounded-xl text-sm cursor-not-allowed border border-dashed border-gray-200"
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6"/>
    </svg>
    Añadir al carrito — próximamente
  </button>
  {/* WhatsApp */}
  
   <a href={"https://wa.me/51994006303?text=" + encodeURIComponent(producto.whatsapp_mensaje)}
    target="_blank"
    rel="noopener noreferrer"
    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-2.5 rounded-xl text-sm transition-all duration-200"
  >
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741 1.018.982-3.656-.236-.374A9.86 9.86 0 012.1 12.042C2.1 6.545 6.545 2.1 12.042 2.1c2.624 0 5.092 1.025 6.944 2.876a9.787 9.787 0 012.876 6.945c-.003 5.497-4.448 9.941-9.94 9.941z"/>
    </svg>
    Consultar disponibilidad
  </a>
</div>
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && fotos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.95)" }}
            onClick={() => setLightbox(false)}
          >
            <motion.div
              key={fotoActiva}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl aspect-square bg-white rounded-2xl overflow-hidden mb-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={fotos[fotoActiva]}
                alt={producto.nombre + " foto " + (fotoActiva + 1)}
                fill
                sizes="100vw"
                className="object-contain p-8"
              />

              {fotos.length > 1 && (
                <>
                  <button
                    onClick={() => setFotoActiva(p => (p - 1 + fotos.length) % fotos.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="15 18 9 12 15 6"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => setFotoActiva(p => (p + 1) % fotos.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                </>
              )}

              {/* Info barra */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-sm">{producto.nombre}</p>
                  <p className="text-zinc-300 text-xs">Cód: {producto.codigo} · {fotoActiva + 1}/{fotos.length}</p>
                </div>
                
                 <a href={"https://wa.me/51994006303?text=" + encodeURIComponent(producto.whatsapp_mensaje)}
                  target="_blank" rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full transition"
                >
                  Consultar →
                </a>
              </div>
            </motion.div>

            {/* Thumbnails */}
            {fotos.length > 1 && (
              <div className="flex gap-2 justify-center" onClick={(e) => e.stopPropagation()}>
                {fotos.map((foto, i) => (
                  <button
                    key={i}
                    onClick={() => setFotoActiva(i)}
                    className={"relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all " +
                      (i === fotoActiva ? "border-white scale-110" : "border-transparent opacity-50 hover:opacity-80")}
                  >
                    <Image src={foto} alt={"Foto " + (i + 1)} fill sizes="64px" className="object-contain bg-white p-1"/>
                  </button>
                ))}
              </div>
            )}

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
    </>
  );
}