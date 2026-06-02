"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "./ProductCard";

function ProximaDescargaCard({ producto, index, unidad, marca, modelo }) {
  const waMsg = encodeURIComponent(
    "Hola, quiero reservar: " + producto.nombre +
    " del " + marca.nombre + " " + modelo.nombre +
    " color " + unidad.color_nombre +
    (unidad.fecha_llegada
      ? " — llega el " + new Date(unidad.fecha_llegada).toLocaleDateString("es-PE", {
          day: "numeric", month: "long"
        })
      : "")
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-white rounded-2xl border border-blue-100 overflow-hidden shadow-sm"
    >
      {/* Imagen */}
      <div className="relative h-44 bg-gray-50 overflow-hidden">
        {producto.imagenes?.[0] ? (
          <Image
            src={producto.imagenes[0]}
            alt={producto.nombre}
            fill
            sizes="(max-width: 640px) 100vw, 25vw"
            className="object-contain p-4"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-200 text-4xl">
            📦
          </div>
        )}
        {/* Badge próxima */}
        <div className="absolute top-2 left-2">
          <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            🚢 En camino
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-black text-zinc-900 text-sm leading-tight mb-1">
          {producto.nombre}
        </h3>
        <p className="text-gray-400 text-xs mb-1">
          SKU: {producto.sku}
        </p>
        {producto.descripcion && (
          <p className="text-gray-500 text-xs mb-3 leading-relaxed line-clamp-2">
            {producto.descripcion}
          </p>
        )}

        {/* Fecha llegada */}
        {unidad.fecha_llegada && (
          <div className="flex items-center gap-1.5 bg-blue-50 rounded-lg px-2.5 py-1.5 mb-3">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              className="text-blue-500 flex-shrink-0">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span className="text-blue-700 text-xs font-semibold">
              Llega el {new Date(unidad.fecha_llegada).toLocaleDateString("es-PE", {
                day: "numeric", month: "long"
              })}
            </span>
          </div>
        )}

        {/* Precio referencial */}
        {producto.mostrar_precio && producto.precio_normal > 0 && (
          <p className="text-gray-500 text-xs mb-3">
            Precio ref.: <span className="font-bold text-zinc-700">
              S/ {producto.precio_normal?.toLocaleString()}
            </span>
          </p>
        )}

        {/* Botones */}
        <div className="flex flex-col gap-2">
          <Link
            href={"/catalogo/" + producto.id}
            className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Ver detalle
          </Link>
          
          <a  href={"https://wa.me/51994006303?text=" + waMsg}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-500 text-white font-bold py-2.5 rounded-xl text-xs transition"
          >
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741 1.018.982-3.656-.236-.374A9.86 9.86 0 012.1 12.042C2.1 6.545 6.545 2.1 12.042 2.1c2.624 0 5.092 1.025 6.944 2.876a9.787 9.787 0 012.876 6.945c-.003 5.497-4.448 9.941-9.94 9.941z"/>
            </svg>
            Reservar esta autoparte
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// Convierte hex a RGB para el fondo
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

export default function ModeloShowcase({ marca, modelo, productos, categorias }) {
  const [categoriaActiva, setCategoriaActiva] = useState(null);
const [unidadActiva, setUnidadActiva] = useState(0);

// 1. PRIMERO tieneUnidades
const tieneUnidades = modelo?.unidades?.length > 0;

// 2. DESPUÉS unidadSeleccionada (depende de tieneUnidades)
const unidadSeleccionada = tieneUnidades ? modelo.unidades[unidadActiva] : null;

// 3. AL FINAL estas dos (dependen de unidadSeleccionada)
const esProximaDescarga = unidadSeleccionada?.estado_unidad === "proxima-descarga";
const fechaLlegada = unidadSeleccionada?.fecha_llegada;




  const fotoAuto = unidadSeleccionada?.imagenes?.[0] || modelo.imagen;

  // Color de fondo según unidad seleccionada
  const colorHex = unidadSeleccionada?.color_hex || "#18181b";
  const rgb = hexToRgb(colorHex.startsWith("#") ? colorHex : "#18181b");

  // Fondo oscurecido para que no sea tan brillante
  const bgGradient = "rgba(" + Math.floor(rgb.r * 0.15) + "," +
    Math.floor(rgb.g * 0.15) + "," +
    Math.floor(rgb.b * 0.15) + ",1)";
  const bgAccent = "rgba(" + Math.floor(rgb.r * 0.3) + "," +
    Math.floor(rgb.g * 0.3) + "," +
    Math.floor(rgb.b * 0.3) + ",0.6)";

  // Filtrar productos por unidad seleccionada
  const productosFiltrados = useMemo(() => {
  if (!tieneUnidades || !unidadSeleccionada) return productos;

  if (esProximaDescarga) {
    // Solo productos específicamente asignados a ESTA unidad próxima
    // Los unidad_id: null son físicamente disponibles → NO aparecen aquí
    return productos.filter(
      (p) => p.unidad_id === unidadSeleccionada.id
    );
  }

  // Unidad disponible: productos de esta unidad + universales (null)
  return productos.filter(
    (p) => !p.unidad_id || p.unidad_id === unidadSeleccionada.id
  );
}, [productos, unidadSeleccionada, tieneUnidades, esProximaDescarga]);

  // Agrupar productos filtrados por categoría
  const productosPorCategoria = useMemo(() => {
    const agrupados = {};
    productosFiltrados.forEach((p) => {
      if (!agrupados[p.categoria_id]) agrupados[p.categoria_id] = [];
      agrupados[p.categoria_id].push(p);
    });
    return agrupados;
  }, [productosFiltrados]);

  const categoriasConProductos = categorias.filter(
    (cat) => productosPorCategoria[cat.id]?.length > 0
  );

  // Reset categoría activa cuando cambia la unidad
  useEffect(() => {
    if (categoriasConProductos.length > 0) {
      setCategoriaActiva(categoriasConProductos[0].id);
    } else {
      setCategoriaActiva(null);
    }
  }, [unidadActiva]);

  const productosActivos = categoriaActiva
    ? productosPorCategoria[categoriaActiva] || []
    : productosFiltrados;

  const categoriaActivaInfo = categorias.find((c) => c.id === categoriaActiva);

  return (
    <div className="bg-white min-h-screen">

      {/* Breadcrumb */}
      <div
        className="pt-20 pb-0 transition-all duration-700"
        style={{ backgroundColor: bgGradient }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Link href="/" className="hover:text-zinc-300 transition">Inicio</Link>
            <span>/</span>
            <Link href="/catalogo" className="hover:text-zinc-300 transition">Catálogo</Link>
            <span>/</span>
            <Link href={"/marcas/" + marca.id} className="hover:text-zinc-300 transition">{marca.nombre}</Link>
            <span>/</span>
            <span className="text-zinc-300">{modelo.nombre}</span>
          </div>
        </div>
      </div>

      {/* Hero con fondo dinámico */}
      <motion.div
        animate={{ backgroundColor: bgGradient }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="pb-10 relative overflow-hidden"
        style={{ backgroundColor: bgGradient }}
      >
        {/* Halo de color de fondo */}
        <motion.div
          animate={{ background: "radial-gradient(ellipse at 50% 60%, " + bgAccent + " 0%, transparent 70%)" }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 pointer-events-none"
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">

          {/* Header */}
          <div className="flex items-center gap-4 mb-6 pt-6">
            <div className="bg-white rounded-xl p-2.5 shadow-lg flex-shrink-0">
              <Image
                src={marca.logo}
                alt={marca.nombre}
                width={48}
                height={48}
                className="object-contain w-10 h-10"
              />
            </div>
            <div>
              <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-0.5">
                {marca.nombre} · Autopartes originales
              </p>
              <h1 className="text-white font-black text-3xl md:text-4xl tracking-tight">
                {modelo.nombre}
              </h1>
              <p className="text-zinc-400 text-sm mt-0.5">
                {modelo.chasis} · {modelo.anio}
              </p>
            </div>
          </div>

          {/* Selector de colores */}
          {tieneUnidades && (
            <div className="mb-6">
              <p className="text-zinc-500 text-xs uppercase tracking-widest mb-3">
                Selecciona el color
              </p>
              <div className="flex flex-wrap gap-2">
                {modelo.unidades.map((u, i) => (
                  <button
                    key={u.id}
                    onClick={() => setUnidadActiva(i)}
                    className={"flex items-center gap-2 px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all duration-300 " +
                      (i === unidadActiva
                        ? "border-white bg-white text-zinc-900 shadow-lg"
                        : "border-zinc-600 text-zinc-300 hover:border-zinc-400 bg-white/10")}
                  >
                    <div
                      className={"w-3.5 h-3.5 rounded-full border-2 " +
                        (i === unidadActiva ? "border-zinc-400" : "border-zinc-600")}
                      style={{ backgroundColor: u.color_hex }}
                    />
                    {u.color_nombre}
                    {u.nota && (
                      <span className="text-xs opacity-60 hidden sm:inline">· {u.nota}</span>
                    )}
                    {/* Contador de productos de esta unidad */}
                    <span className={"text-xs font-black px-1.5 py-0.5 rounded-full " +
                      (i === unidadActiva ? "bg-zinc-200 text-zinc-700" : "bg-white/20 text-zinc-300")}>
                      {productos.filter(p => !p.unidad_id || p.unidad_id === u.id).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Auto flotante */}
          <div className="relative flex items-center justify-center h-56 sm:h-72 md:h-80">
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-2/3 h-6 blur-xl rounded-full transition-all duration-700"
              style={{ backgroundColor: colorHex, opacity: 0.3 }} />

            <AnimatePresence mode="wait">
              <motion.div
                key={fotoAuto}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={fotoAuto}
                    alt={modelo.nombre}
                    fill
                    sizes="(max-width: 640px) 100vw, 600px"
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Chips de categorías */}
            {categoriasConProductos.map((cat, i) => {
              const total = productosPorCategoria[cat.id]?.length || 0;
              const isActive = categoriaActiva === cat.id;
              const posiciones = [
                "top-2 left-0",
                "top-2 right-0",
                "top-1/3 -left-2 sm:-left-6",
                "top-1/3 -right-2 sm:-right-6",
                "bottom-10 left-4",
                "bottom-10 right-4",
                "top-2/3 -left-2",
                "top-2/3 -right-2",
              ];
              const pos = posiciones[i % posiciones.length];

              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 + 0.3 }}
                  onClick={() => setCategoriaActiva(isActive ? null : cat.id)}
                  className={"absolute " + pos + " z-20"}
                >
                  <div className={"flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg transition-all duration-200 " +
                    (isActive
                      ? "scale-110 text-white shadow-lg"
                      : "bg-white/90 backdrop-blur-sm text-zinc-800 hover:bg-white")}
                    style={isActive ? { backgroundColor: colorHex === "#FFFFFF" || colorHex === "#F5F5F5" ? "#dc2626" : colorHex } : {}}
                  >
                    <span>{cat.icono}</span>
                    <span className="hidden sm:inline">{cat.nombre}</span>
                    <span className={"w-5 h-5 rounded-full flex items-center justify-center text-xs font-black " +
                      (isActive ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-600")}>
                      {total}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Stats */}
<div className="flex items-center justify-center gap-6 mt-4">
  <div className="text-center">
    <p className="text-white font-black text-xl">
      {esProximaDescarga ? "0" : productosFiltrados.length}
    </p>
    <p className="text-zinc-500 text-xs">Autopartes</p>
  </div>
  <div className="w-px h-8 bg-zinc-700" />
  <div className="text-center">
    <p className="text-white font-black text-xl">{categoriasConProductos.length}</p>
    <p className="text-zinc-500 text-xs">Categorías</p>
  </div>
  <div className="w-px h-8 bg-zinc-700" />
  <div className="text-center">
    <p className={"font-black text-xl " + (esProximaDescarga ? "text-blue-400" : "text-white")}>
      {esProximaDescarga ? "🚢" : productosFiltrados.filter(p =>
        p.precio_oferta && p.oferta_hasta && new Date(p.oferta_hasta) > new Date()
      ).length}
    </p>
    <p className="text-zinc-500 text-xs">
      {esProximaDescarga ? "En camino" : "En oferta"}
    </p>
  </div>
</div>
        </div>
      </motion.div>

      {/* Filtros sticky */}
     {/* Alerta próxima descarga */}
{esProximaDescarga ? (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

    {/* Banner */}
    <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-6 sm:p-8 text-center mb-8">
      <div className="text-5xl mb-4">🚢</div>
      <h2 className="text-zinc-900 font-black text-xl sm:text-2xl mb-2">
        Estas Autopartes aún no han llegado
      </h2>
      <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
        El <strong>{unidadSeleccionada.color_nombre} {modelo.nombre}</strong> está
        en camino desde Japón. Las autopartes estarán disponibles cuando llegue el contenedor.
      </p>

      {/* Fecha llegada */}
      {fechaLlegada && (
        <div className="inline-flex items-center gap-2 bg-white border border-blue-200 rounded-2xl px-5 py-3 mb-5 shadow-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-blue-500">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span className="text-zinc-900 font-black text-sm">
            Llega el {new Date(fechaLlegada).toLocaleDateString("es-PE", {
              weekday: "long", day: "numeric", month: "long", year: "numeric"
            })}
          </span>
        </div>
      )}

      {/* Tipo importación */}
      {unidadSeleccionada.tipo_importacion && (
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 mb-5 ml-2">
          <span className="text-amber-700 text-xs font-bold">
            {unidadSeleccionada.tipo_importacion === "cdk" ? "🔧 CDK" :
             unidadSeleccionada.tipo_importacion === "completo" ? "🚗 Completo" : "📦 Solo partes"}
          </span>
          {unidadSeleccionada.incluye_techo === false && (
            <span className="text-amber-600 text-xs">· Sin techo</span>
          )}
        </div>
      )}

      {/* Nota */}
      {unidadSeleccionada.nota && (
        <p className="text-gray-500 text-sm mb-5">{unidadSeleccionada.nota}</p>
      )}

      {/* Categorías — SOLO las asignadas a esta unidad */}
      {(() => {
        const productosDeEstaUnidad = productos.filter(
          (p) => p.unidad_id === unidadSeleccionada?.id
        );
        const catMap = {};
        productosDeEstaUnidad.forEach((p) => {
          if (!catMap[p.categoria_id]) catMap[p.categoria_id] = [];
          catMap[p.categoria_id].push(p);
        });
        const catsDeEstaUnidad = categorias.filter((c) => catMap[c.id]);

        if (catsDeEstaUnidad.length === 0) return (
          <div className="mt-4 mb-5 bg-white/60 rounded-2xl px-4 py-3">
            <p className="text-gray-500 text-sm text-center">
              Aún no hay autopartes registradas para este auto.<br/>
              <span className="text-xs text-gray-400">
                El equipo las agregará cuando llegue el contenedor.
              </span>
            </p>
          </div>
        );

        return (
          <div className="mt-4 mb-5">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">
              Autopartes que llegarán con este auto:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {catsDeEstaUnidad.map((cat) => (
                <span key={cat.id}
                  className="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                  {cat.icono} {cat.nombre} ({catMap[cat.id].length})
                </span>
              ))}
            </div>
          </div>
        );
      })()}

      {/* CTA Reservar */}
      
      <a href={"https://wa.me/51994006303?text=" + encodeURIComponent(
          "Hola, me interesa reservar autopartes del " +
          modelo.nombre + " " + marca.nombre +
          " color " + unidadSeleccionada.color_nombre +
          (fechaLlegada ? " que llega el " + new Date(fechaLlegada).toLocaleDateString("es-PE") : "")
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-black px-8 py-3.5 rounded-full transition text-sm shadow-lg shadow-green-100"
      >
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741 1.018.982-3.656-.236-.374A9.86 9.86 0 012.1 12.042C2.1 6.545 6.545 2.1 12.042 2.1c2.624 0 5.092 1.025 6.944 2.876a9.787 9.787 0 012.876 6.945c-.003 5.497-4.448 9.941-9.94 9.941z"/>
        </svg>
        Reservar antes de llegar
      </a>

      <p className="text-gray-400 text-xs mt-3">
        Al llegar, las autopartes se publicarán automáticamente en el catálogo
      </p>
    </div>

    {/* Link a próximas descargas */}
    <div className="text-center">
      <Link
        href="/proximas-descargas"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Ver todos los autos en próximas descargas
      </Link>
    </div>

    {/* Grid de autopartes próximas — SOLO las de esta unidad */}
    {productosFiltrados.length > 0 && (
      <div className="mt-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-black text-zinc-900">
              Autopartes que llegarán con este auto
            </h3>
            <p className="text-gray-500 text-sm mt-0.5">
              Reserva ahora — disponibles cuando llegue el contenedor
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {productosFiltrados.map((producto, i) => (
            <ProximaDescargaCard
              key={producto.id}
              producto={producto}
              index={i}
              unidad={unidadSeleccionada}
              marca={marca}
              modelo={modelo}
            />
          ))}
        </div>
      </div>
    )}

  </div>

) :  (
  /* Grid normal de productos — solo si NO es próxima descarga */
  <>
    {/* Filtros sticky */}
    <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
      {/* ... tu código existente de filtros ... */}
    </div>

    {/* Grid productos */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* ... tu código existente del grid ... */}
    </div>
  </>
)}


{/* Grid normal de productos — solo si NO es próxima descarga */}
<>
  {/* Filtros sticky */}
  <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex gap-2 overflow-x-auto py-3 no-scrollbar">
        <button
          onClick={() => setCategoriaActiva(null)}
          className={"flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all " +
            (!categoriaActiva ? "bg-zinc-900 text-white" : "bg-gray-100 text-zinc-600 hover:bg-gray-200")}
        >
          Todo ({productosFiltrados.length})
        </button>
        {categoriasConProductos.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoriaActiva(cat.id)}
            className={"flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all " +
              (categoriaActiva === cat.id
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-zinc-600 hover:bg-gray-200")}
          >
            <span>{cat.icono}</span>
            {cat.nombre}
            <span className={"w-5 h-5 rounded-full flex items-center justify-center text-xs font-black " +
              (categoriaActiva === cat.id ? "bg-white/20" : "bg-white")}>
              {productosPorCategoria[cat.id]?.length || 0}
            </span>
          </button>
        ))}
      </div>
    </div>
  </div>

  {/* Grid productos */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-black text-zinc-900">
          {categoriaActivaInfo
            ? categoriaActivaInfo.icono + " " + categoriaActivaInfo.nombre
            : "Todas las autopartes"}
          {unidadSeleccionada && (
            <span className="ml-2 text-sm font-semibold text-zinc-400">
              — {unidadSeleccionada.color_nombre}
            </span>
          )}
        </h2>
        <p className="text-zinc-500 text-sm mt-0.5">
          {productosActivos.length} productos disponibles
        </p>
      </div>
      <Link
        href={"/marcas/" + marca.id}
        className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-800 text-sm font-semibold transition"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Volver a {marca.nombre}
      </Link>
    </div>

   {productosActivos.length === 0 ? (
  <div className="py-20 text-center">
    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
        className="text-gray-400">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    </div>
    <p className="text-zinc-500 font-semibold mb-1">Sin productos disponibles</p>
  </div>
) : (
  <AnimatePresence mode="wait">
    <motion.div
      key={(categoriaActiva || "all") + "-" + unidadActiva}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
    >
      {productosActivos.map((producto, i) => (
        <ProductCard
          key={producto.id}
          producto={producto}
          index={i}
        />
      ))}
    </motion.div>
  </AnimatePresence>
)}
  </div>

  {/* CTA WhatsApp */}
  <div className="py-12 px-4 transition-all duration-700" style={{ backgroundColor: bgGradient }}>
    <div className="max-w-2xl mx-auto text-center">
      <p className="text-zinc-400 text-sm mb-2">¿No encuentras lo que buscas?</p>
      <h3 className="text-white font-black text-2xl mb-4">Consulta por WhatsApp</h3>
      
      <a href={"https://wa.me/51994006303?text=" + encodeURIComponent(
          "Hola, busco autopartes para " + modelo.nombre + " " + marca.nombre +
          (unidadSeleccionada ? " color " + unidadSeleccionada.color_nombre : "") +
          " (" + modelo.chasis + ")"
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-3.5 rounded-full transition text-sm"
      >
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741 1.018.982-3.656-.236-.374A9.86 9.86 0 012.1 12.042C2.1 6.545 6.545 2.1 12.042 2.1c2.624 0 5.092 1.025 6.944 2.876a9.787 9.787 0 012.876 6.945c-.003 5.497-4.448 9.941-9.94 9.941z"/>
        </svg>
        Consultar ahora
      </a>
    </div>
  </div>
</>

      
    </div>
  );
}