"use client";
import { useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "./ProductCard";

const ESTADOS = ["disponible", "últimas unidades", "pre-venta", "agotado"];
const ORDEN_OPTS = [
  { value: "reciente", label: "Más reciente" },
  { value: "precio-asc", label: "Menor precio" },
  { value: "precio-desc", label: "Mayor precio" },
  { value: "nombre", label: "A — Z" },
];

export default function CatalogoClient({ productos, marcas, categorias }) {
  const searchParams = useSearchParams();
  const [busqueda, setBusqueda] = useState("");
  const [marcaFiltro, setMarcaFiltro] = useState(searchParams.get("marca") || "");
  const [modeloFiltro, setModeloFiltro] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState(searchParams.get("categoria") || "");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [soloOfertas, setSoloOfertas] = useState(false);
  const [orden, setOrden] = useState("reciente");
  const [pagina, setPagina] = useState(1);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
 
  const POR_PAGINA = 12;

  // Modelos disponibles según marca seleccionada
  const modelosDisponibles = useMemo(() => {
    if (!marcaFiltro) return [];
    const marca = marcas.find((m) => m.id === marcaFiltro);
    return marca?.modelos || [];
  }, [marcaFiltro, marcas]);

  // Reset modelo cuando cambia la marca
  useEffect(() => {
    setModeloFiltro("");
    setPagina(1);
  }, [marcaFiltro]);

  useEffect(() => { setPagina(1); }, [busqueda, categoriaFiltro, estadoFiltro, soloOfertas, orden]);

  // Filtrar y ordenar
  const productosFiltrados = useMemo(() => {
    let result = productos.filter((p) => p.activo);

    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      result = result.filter((p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.codigo?.toLowerCase().includes(q) ||
        p.descripcion?.toLowerCase().includes(q)
      );
    }

    if (marcaFiltro) result = result.filter((p) => p.marca_id === marcaFiltro);
    if (modeloFiltro) result = result.filter((p) => p.modelo_id === modeloFiltro);
    if (categoriaFiltro) result = result.filter((p) => p.categoria_id === categoriaFiltro);
    if (estadoFiltro) result = result.filter((p) => p.estado === estadoFiltro);
    if (soloOfertas) result = result.filter((p) =>
      p.precio_oferta && p.oferta_hasta && new Date(p.oferta_hasta) > new Date()
    );

    switch (orden) {
      case "precio-asc":
        result = [...result].sort((a, b) =>
          (a.precio_oferta || a.precio_normal) - (b.precio_oferta || b.precio_normal));
        break;
      case "precio-desc":
        result = [...result].sort((a, b) =>
          (b.precio_oferta || b.precio_normal) - (a.precio_oferta || a.precio_normal));
        break;
      case "nombre":
        result = [...result].sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
    }

    return result;
  }, [productos, busqueda, marcaFiltro, modeloFiltro, categoriaFiltro, estadoFiltro, soloOfertas, orden]);

  const totalPaginas = Math.ceil(productosFiltrados.length / POR_PAGINA);
  const productosPagina = productosFiltrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  const hayFiltros = busqueda || marcaFiltro || categoriaFiltro || estadoFiltro || soloOfertas;

  const limpiarFiltros = () => {
    setBusqueda("");
    setMarcaFiltro("");
    setModeloFiltro("");
    setCategoriaFiltro("");
    setEstadoFiltro("");
    setSoloOfertas(false);
    setPagina(1);
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero del catálogo */}
      <div className="bg-white border-b border-gray-100 pt-24 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-gray-600 transition">Inicio</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">Catálogo</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-black text-zinc-900 mb-1">
                Catálogo de Autopartes
              </h1>
              <p className="text-gray-500 text-sm">
                {productosFiltrados.length} productos encontrados
                {hayFiltros && " con los filtros aplicados"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {hayFiltros && (
                <button
                  onClick={limpiarFiltros}
                  className="flex items-center gap-1.5 text-red-500 hover:text-red-600 text-sm font-semibold transition"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>

          {/* Barra de búsqueda */}
          <div className="relative mb-4">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, SKU, código..."
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-zinc-900 placeholder-gray-400 outline-none focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100 transition-all"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>

          {/* Filtros rápidos en fila */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Marca */}
            <select
              value={marcaFiltro}
              onChange={(e) => setMarcaFiltro(e.target.value)}
              className={"flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all outline-none cursor-pointer " +
                (marcaFiltro
                  ? "bg-red-50 border-red-300 text-red-700"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300")}
            >
              <option value="">Todas las marcas</option>
              {marcas.map((m) => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>

            {/* Modelo — solo si hay marca */}
            {marcaFiltro && modelosDisponibles.length > 0 && (
              <select
                value={modeloFiltro}
                onChange={(e) => setModeloFiltro(e.target.value)}
                className={"flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all outline-none cursor-pointer " +
                  (modeloFiltro
                    ? "bg-red-50 border-red-300 text-red-700"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300")}
              >
                <option value="">Todos los modelos</option>
                {modelosDisponibles.map((m) => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </select>
            )}

            {/* Categoría */}
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className={"flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all outline-none cursor-pointer " +
                (categoriaFiltro
                  ? "bg-red-50 border-red-300 text-red-700"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300")}
            >
              <option value="">Todas las categorías</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.icono} {c.nombre}</option>
              ))}
            </select>

            {/* Estado */}
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className={"flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all outline-none cursor-pointer " +
                (estadoFiltro
                  ? "bg-red-50 border-red-300 text-red-700"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300")}
            >
              <option value="">Cualquier estado</option>
              {ESTADOS.map((e) => (
                <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>
              ))}
            </select>

            {/* Toggle ofertas */}
            <button
              onClick={() => setSoloOfertas(!soloOfertas)}
              className={"flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all " +
                (soloOfertas
                  ? "bg-amber-50 border-amber-300 text-amber-700"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300")}
            >
              🔥 Solo ofertas
            </button>

            {/* Separador */}
            <div className="w-px h-6 bg-gray-200 hidden sm:block" />

            {/* Ordenar */}
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border bg-white border-gray-200 text-gray-600 hover:border-gray-300 transition-all outline-none cursor-pointer"
            >
              {ORDEN_OPTS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Tags de filtros activos */}
        {hayFiltros && (
          <div className="flex flex-wrap gap-2 mb-6">
            {busqueda && (
              <span className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
                🔍 "{busqueda}"
                <button onClick={() => setBusqueda("")} className="text-gray-400 hover:text-red-500 transition">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </span>
            )}
            {marcaFiltro && (
              <span className="flex items-center gap-1.5 bg-white border border-red-200 rounded-full px-3 py-1 text-xs font-medium text-red-700 shadow-sm">
                {marcas.find((m) => m.id === marcaFiltro)?.nombre}
                <button onClick={() => setMarcaFiltro("")} className="text-red-300 hover:text-red-600 transition">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </span>
            )}
            {modeloFiltro && (
              <span className="flex items-center gap-1.5 bg-white border border-red-200 rounded-full px-3 py-1 text-xs font-medium text-red-700 shadow-sm">
                {modelosDisponibles.find((m) => m.id === modeloFiltro)?.nombre}
                <button onClick={() => setModeloFiltro("")} className="text-red-300 hover:text-red-600 transition">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </span>
            )}
            {categoriaFiltro && (
              <span className="flex items-center gap-1.5 bg-white border border-red-200 rounded-full px-3 py-1 text-xs font-medium text-red-700 shadow-sm">
                {categorias.find((c) => c.id === categoriaFiltro)?.nombre}
                <button onClick={() => setCategoriaFiltro("")} className="text-red-300 hover:text-red-600 transition">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </span>
            )}
            {soloOfertas && (
              <span className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 text-xs font-medium text-amber-700 shadow-sm">
                🔥 Solo ofertas
                <button onClick={() => setSoloOfertas(false)} className="text-amber-400 hover:text-amber-700 transition">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </span>
            )}
          </div>
        )}

        {productosPagina.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-24 text-center"
          >
            <div className="w-20 h-20 bg-white border border-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-sm">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gray-300">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <p className="text-zinc-700 font-black text-lg mb-1">Sin resultados</p>
            <p className="text-gray-400 text-sm mb-5">
              No encontramos productos con esos filtros
            </p>
            <button
              onClick={limpiarFiltros}
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2.5 rounded-full text-sm transition"
            >
              Limpiar filtros
            </button>
          </motion.div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={pagina + "-" + marcaFiltro + "-" + categoriaFiltro}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              >
                {productosPagina.map((producto, i) => (
                  <ProductCard key={producto.id} producto={producto} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => { setPagina(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={pagina === 1}
                  className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-red-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                </button>

                {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                  .filter((n) => n === 1 || n === totalPaginas || Math.abs(n - pagina) <= 1)
                  .reduce((acc, n, idx, arr) => {
                    if (idx > 0 && n - arr[idx - 1] > 1) acc.push("...");
                    acc.push(n);
                    return acc;
                  }, [])
                  .map((n, idx) =>
                    n === "..." ? (
                      <span key={"e" + idx} className="text-gray-400 text-sm px-1">…</span>
                    ) : (
                      <button
                        key={n}
                        onClick={() => { setPagina(n); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className={"w-10 h-10 rounded-full text-sm font-bold transition " +
                          (pagina === n
                            ? "bg-red-600 text-white shadow-lg shadow-red-200"
                            : "bg-white border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-500")}
                      >
                        {n}
                      </button>
                    )
                  )}

                <button
                  onClick={() => { setPagina(p => Math.min(totalPaginas, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={pagina === totalPaginas}
                  className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-red-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </div>
            )}

            <p className="text-center text-gray-400 text-xs mt-3">
              Página {pagina} de {totalPaginas} · {productosFiltrados.length} productos
            </p>
          </>
        )}
      </div>

      {/* CTA final */}
      <div className="bg-white border-t border-gray-100 py-12 px-4 mt-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-400 text-sm mb-2">¿No encuentras lo que necesitas?</p>
          <h3 className="text-zinc-900 font-black text-2xl mb-4">
            Consulta directamente por WhatsApp
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Tenemos stock no publicado aún. Nuestro equipo te responde de inmediato.
          </p>
          
           <a href={"https://wa.me/51994006303?text=" + encodeURIComponent("Hola, busco una autoparte en el catálogo")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-3.5 rounded-full transition text-sm shadow-lg shadow-green-100"
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741 1.018.982-3.656-.236-.374A9.86 9.86 0 012.1 12.042C2.1 6.545 6.545 2.1 12.042 2.1c2.624 0 5.092 1.025 6.944 2.876a9.787 9.787 0 012.876 6.945c-.003 5.497-4.448 9.941-9.94 9.941z"/>
            </svg>
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}