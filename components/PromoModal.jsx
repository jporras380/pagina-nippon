"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import promosData from "../data/promos.json";

const WA_NUMBER = "51994006303";

const BADGE_STYLES = {
  rojo:    "bg-red-500 text-white",
  verde:   "bg-green-500 text-white",
  azul:    "bg-blue-500 text-white",
  negro:   "bg-zinc-900 text-white",
  naranja: "bg-orange-500 text-white",
};

export default function PromoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  const productosActivos = promosData.productos?.filter((p) => p.activo) || [];

  useEffect(() => {
    if (!promosData.activo || productosActivos.length === 0) return;
    const t = setTimeout(() => setIsOpen(true), (promosData.delay_segundos || 1) * 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  if (!promosData.activo || productosActivos.length === 0) return null;

  const producto = productosActivos[current];
  const badgeStyle = BADGE_STYLES[producto.badge_color] || BADGE_STYLES.rojo;

  const tieneOferta = producto.precio && producto.precio_antes;
  const descuento = tieneOferta
    ? Math.round((1 - parseFloat(producto.precio.replace(/[^0-9.]/g, "")) /
        parseFloat(producto.precio_antes.replace(/[^0-9.]/g, ""))) * 100)
    : 0;

  const waLink = "https://wa.me/" + WA_NUMBER + "?text=" +
    encodeURIComponent(producto.whatsapp_mensaje || "Hola, consulto por " + producto.nombre);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
          >
            {/* Imagen grande */}
            <div className="relative w-full h-56 sm:h-72 bg-gray-100 overflow-hidden">
              <Image
                src={producto.imagen}
                alt={producto.nombre}
                fill
                sizes="(max-width: 640px) 100vw, 512px"
                className="object-cover"
                priority
                onError={(e) => { e.target.style.display = "none"; }}
              />

              {/* Overlay degradado bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Badge */}
              <div className="absolute top-3 left-3 flex gap-2">
                <span className={"text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow " + badgeStyle}>
                  {producto.badge}
                </span>
                {tieneOferta && descuento > 0 && (
                  <span className="bg-red-500 text-white text-xs font-black px-2.5 py-1.5 rounded-full shadow">
                    -{descuento}%
                  </span>
                )}
              </div>

              {/* Cerrar */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>

              {/* Estado */}
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-zinc-700 text-xs font-semibold px-3 py-1 rounded-full">
                {producto.estado}
              </div>

              {/* Nombre sobre imagen */}
              <div className="absolute bottom-3 right-3 left-24">
                <p className="text-white font-black text-base sm:text-lg leading-tight drop-shadow-lg line-clamp-2">
                  {producto.nombre}
                </p>
              </div>
            </div>

            {/* Contenido */}
            <div className="px-5 sm:px-6 py-4">

              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-widest">
                    {promosData.titulo_seccion}
                  </p>
                  <h2 className="text-zinc-900 font-black text-base sm:text-lg leading-tight">
                    {producto.nombre}
                  </h2>
                </div>
              </div>

              {/* Descripción */}
              {producto.descripcion && (
                <p className="text-gray-500 text-sm mb-3 leading-relaxed">
                  {producto.descripcion}
                </p>
              )}

              {/* Precio */}
              <div className="flex items-center gap-3 mb-4">
                {producto.precio && (
                  <span className="text-red-600 font-black text-2xl sm:text-3xl">
                    {producto.precio}
                  </span>
                )}
                {producto.precio_antes && (
                  <span className="text-gray-400 text-sm line-through">
                    {producto.precio_antes}
                  </span>
                )}
                {producto.precio === "Consultar" && (
                  <span className="bg-gray-100 text-gray-600 text-sm font-semibold px-3 py-1 rounded-full">
                    Precio a consultar
                  </span>
                )}
              </div>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-2">
                
                <a  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-black py-3 rounded-2xl transition text-sm shadow-lg shadow-green-100"
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741 1.018.982-3.656-.236-.374A9.86 9.86 0 012.1 12.042C2.1 6.545 6.545 2.1 12.042 2.1c2.624 0 5.092 1.025 6.944 2.876a9.787 9.787 0 012.876 6.945c-.003 5.497-4.448 9.941-9.94 9.941z"/>
                  </svg>
                  Consultar disponibilidad
                </a>
                <button
                  onClick={() => setIsOpen(false)}
                  className="sm:w-auto px-5 py-3 rounded-2xl border-2 border-gray-200 text-gray-500 hover:border-gray-300 font-semibold text-sm transition"
                >
                  Ver más tarde
                </button>
              </div>
            </div>

            {/* Dots */}
            {productosActivos.length > 1 && (
              <div className="flex items-center justify-center gap-2 pb-4 px-5">
                <button
                  onClick={() => setCurrent(p => (p - 1 + productosActivos.length) % productosActivos.length)}
                  className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                </button>
                <div className="flex gap-1.5">
                  {productosActivos.map((_, i) => (
                    <button key={i} onClick={() => setCurrent(i)}>
                      <div className={"rounded-full transition-all duration-300 " +
                        (i === current ? "w-6 h-2 bg-red-500" : "w-2 h-2 bg-gray-300")} />
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrent(p => (p + 1) % productosActivos.length)}
                  className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}