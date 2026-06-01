"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function ModelCard({ modelo, marcaId, index }) {
  const [modal, setModal] = useState(false);
  const [unidadActiva, setUnidadActiva] = useState(0);
  const [fotoActiva, setFotoActiva] = useState(0);
  const [imgError, setImgError] = useState(false);

  const tieneUnidades = modelo?.unidades?.length > 0;

  const unidadSeleccionada = tieneUnidades ? modelo.unidades[unidadActiva] : null;
  const fotoPortada = modelo?.imagenes?.[0] || modelo.imagen;
  const fotos = tieneUnidades
    ? (modelo.unidades[unidadActiva]?.imagenes?.length > 0
        ? modelo.unidades[unidadActiva].imagenes
        : [modelo.imagen].filter(Boolean))
    : (modelo?.imagenes?.length > 0 ? modelo.imagenes : [modelo.imagen].filter(Boolean));

  useEffect(() => {
    setFotoActiva(0);
  }, [unidadActiva]);

  useEffect(() => {
    if (modal) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [modal]);

  useEffect(() => {
    const fn = (e) => {
      if (!modal) return;
      if (e.key === "Escape") setModal(false);
      if (e.key === "ArrowRight") setFotoActiva(p => (p + 1) % fotos.length);
      if (e.key === "ArrowLeft") setFotoActiva(p => (p - 1 + fotos.length) % fotos.length);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [modal, fotos.length]);

  if (!modelo) return null;

  

  return (
    <>
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: Math.min(index * 0.07, 0.5) }}
        className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
        onClick={() => setModal(true)}
      >
        {/* Imagen */}
        <div className="relative h-40 bg-gray-50 overflow-hidden">
          {!imgError && fotoPortada ? (
            <motion.div
              className="absolute inset-0"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
            >
              <Image
                src={fotoPortada}
                alt={modelo.nombre}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-contain p-4"
                onError={() => setImgError(true)}
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <span className="text-zinc-400 text-xs">Sin imagen</span>
            </div>
          )}

          {/* Badge fotos */}
          {fotos.length > 1 && (
            <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
              {fotos.length} fotos
            </div>
          )}

          {/* Overlay hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/90 rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold text-zinc-800">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
              Ver detalle
            </div>
          </div>
        </div>

        {/* Info */}
      
<div className="p-4">
  <h3 className="text-zinc-900 font-black text-sm leading-tight mb-0.5">
    {/* Nombre completo: Marca + Modelo */}
    {modelo.nombre}
  </h3>

  {/* Chasis */}
  {modelo.chasis && (
    <p className="text-zinc-500 text-xs mb-0.5">
      Chasis: <span className="font-semibold text-zinc-700">{modelo.chasis}</span>
    </p>
  )}

  {/* Año */}
  {modelo.anio && (
    <p className="text-zinc-400 text-xs mb-3">{modelo.anio}</p>
  )}

          {/* Dots de colores */}
          {/* Dots colores + estado */}
{tieneUnidades && (
  <div className="flex flex-col gap-1 mb-3">
    {modelo.unidades.map((u) => (
      <div key={u.id} className="flex items-center gap-1.5">
        {/* Color dot */}
        <div
          title={u.color_nombre}
          className="w-3.5 h-3.5 rounded-full border-2 border-white shadow ring-1 ring-gray-200 flex-shrink-0"
          style={{ backgroundColor: u.color_hex }}
        />
        <span className="text-xs text-zinc-600 font-medium">{u.color_nombre}</span>

        {/* Badge estado */}
        <span className={"text-xs font-bold px-1.5 py-0.5 rounded-full ml-auto " +
          (u.estado_unidad === "proxima-descarga"
            ? "bg-blue-100 text-blue-700"
            : u.estado_unidad === "reservado"
            ? "bg-red-100 text-red-600"
            : u.estado_unidad === "disponible"
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-500")}>
          {u.estado_unidad === "proxima-descarga" ? "🚢 Próx."
            : u.estado_unidad === "reservado" ? "🔒 Reservado"
            : u.estado_unidad === "disponible" ? "✅ Disponible"
            : u.estado_unidad || ""}
        </span>
      </div>
    ))}
  </div>
)}

          <div className="flex items-center justify-between bg-zinc-900 text-white text-xs font-bold px-3 py-2 rounded-lg">
            Ver autopartes
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Modal moderno */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.88)" }}
            onClick={() => setModal(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Imagen principal */}
              <div className="relative h-64 sm:h-80 bg-gray-50 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={fotoActiva + "-" + unidadActiva}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={fotos[fotoActiva]}
                      alt={modelo.nombre}
                      fill
                      sizes="100vw"
                      className="object-contain p-8"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Badge color activo */}
                {unidadSeleccionada && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-gray-200 shadow-sm"
                      style={{ backgroundColor: unidadSeleccionada.color_hex }}
                    />
                    <span className="text-xs font-bold text-zinc-700">{unidadSeleccionada.color_nombre}</span>
                  </div>
                )}

                {/* Flechas fotos */}
                {fotos.length > 1 && (
                  <>
                    <button
                      onClick={() => setFotoActiva(p => (p - 1 + fotos.length) % fotos.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="15 18 9 12 15 6"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => setFotoActiva(p => (p + 1) % fotos.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </button>
                  </>
                )}

                {/* Dots fotos */}
                {fotos.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {fotos.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setFotoActiva(i)}
                        className={"rounded-full transition-all duration-200 " +
                          (i === fotoActiva ? "w-5 h-1.5 bg-zinc-800" : "w-1.5 h-1.5 bg-zinc-400")}
                      />
                    ))}
                  </div>
                )}

                {/* Cerrar */}
                <button
                  onClick={() => setModal(false)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              {/* Info del modelo */}
              <div className="px-6 py-5">
                {/* Header info del modelo */}
<div className="flex items-start justify-between mb-4">
  <div>
    <h3 className="text-zinc-900 font-black text-xl mb-0.5">{modelo.nombre}</h3>
    <p className="text-zinc-500 text-sm">{modelo.chasis} · {modelo.anio}</p>
  </div>
  {tieneUnidades && (
    <span className={
      "text-xs font-bold px-3 py-1 rounded-full border " +
      (modelo.unidades.every(u => u.estado_unidad === "proxima-descarga")
        ? "bg-blue-50 text-blue-700 border-blue-200"
        : "bg-green-50 text-green-700 border-green-200")
    }>
      {modelo.unidades.every(u => u.estado_unidad === "proxima-descarga")
        ? "🚢 En camino"
        : modelo.unidades.filter(u => u.estado_unidad !== "proxima-descarga").length + " disponibles"}
    </span>
  )}
</div>

                {/* Selector de colores/unidades */}
                {tieneUnidades && (
                  <div className="mb-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">
                      Selecciona el color
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {modelo.unidades.map((u, i) => (
                        <button
                          key={u.id}
                          onClick={() => setUnidadActiva(i)}
                          className={"flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all duration-200 text-sm font-semibold " +
                            (i === unidadActiva
                              ? "border-zinc-900 bg-zinc-900 text-white"
                              : "border-gray-200 bg-white text-zinc-700 hover:border-zinc-400")}
                        >
                          <div
                            className={"w-4 h-4 rounded-full border shadow-sm " +
                              (i === unidadActiva ? "border-white/40" : "border-gray-300")}
                            style={{ backgroundColor: u.color_hex }}
                          />
                          {u.color_nombre}
                        </button>
                      ))}
                    </div>

                    {/* Nota de la unidad seleccionada */}
                    {unidadSeleccionada?.nota && (
                      <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5">
                        <p className="text-blue-700 text-xs font-medium">
                          📋 {unidadSeleccionada.nota}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Thumbnails de fotos */}
                {fotos.length > 1 && (
                  <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
                    {fotos.map((foto, i) => (
                      <button
                        key={i}
                        onClick={() => setFotoActiva(i)}
                        className={"relative w-16 h-12 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all " +
                          (i === fotoActiva ? "border-zinc-900" : "border-gray-200 opacity-60 hover:opacity-100")}
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

                
           {/* Botones CTA */}
<div className="flex gap-3">
  {unidadSeleccionada?.estado_unidad === "proxima-descarga" ? (
    <Link
      href={"/marcas/" + marcaId + "/" + modelo.id +
        "?unidad=" + unidadSeleccionada.id}
      onClick={() => setModal(false)}
      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-2xl text-sm text-center transition flex items-center justify-center gap-2"
    >
      🚢 Ver qué autopartes llegan
      {unidadSeleccionada.fecha_llegada && (
        <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
          {new Date(unidadSeleccionada.fecha_llegada).toLocaleDateString("es-PE", {
            day: "numeric", month: "short"
          })}
        </span>
      )}
    </Link>
  ) : (
    <Link
      href={"/marcas/" + marcaId + "/" + modelo.id +
        (unidadSeleccionada ? "?unidad=" + unidadSeleccionada.id : "")}
      onClick={() => setModal(false)}
      className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-2xl text-sm text-center transition flex items-center justify-center gap-2"
    >
      Ver autopartes
      {unidadSeleccionada && (
        <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
          {unidadSeleccionada.color_nombre}
        </span>
      )}
    </Link>
  )}

  
   <a href={"https://wa.me/51994006303?text=" + encodeURIComponent(
      "Hola, consulto por " + modelo.nombre +
      " (" + marcaId + ")" +
      (unidadSeleccionada?.color_nombre
        ? " color " + unidadSeleccionada.color_nombre
        : "") +
      (modelo.chasis ? " chasis " + modelo.chasis : "")
    )}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-2xl text-sm transition flex items-center gap-1.5"
  >
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741 1.018.982-3.656-.236-.374A9.86 9.86 0 012.1 12.042C2.1 6.545 6.545 2.1 12.042 2.1c2.624 0 5.092 1.025 6.944 2.876a9.787 9.787 0 012.876 6.945c-.003 5.497-4.448 9.941-9.94 9.941z"/>
    </svg>
    WA
  </a>
</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}