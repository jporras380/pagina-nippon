"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const ProductoFormModal = dynamic(
  () => import("../../components/admin/ProductoFormModal"),
  { ssr: false }
);
// Agrega el import MarcaFormModal:
const MarcaFormModal = dynamic(
  () => import("../../components/admin/MarcaFormModal"),
  { ssr: false }
);
// Agrega el import AgregarModeloModal:
import AgregarModeloModal from "../../components/admin/AgregarModeloModal";
import AgregarUnidadModal from "../../components/admin/AgregarUnidadModal";
import catalogoData from "../../data/catalogo.json";

export default function AdminPage() {
  const [tab, setTab] = useState("productos");
  const [promos, setPromos] = useState(null);
  const [guardandoPromos, setGuardandoPromos] = useState(false);
  const [msgPromos, setMsgPromos] = useState("");
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [marcaFiltro, setMarcaFiltro] = useState("");
  const [modalProducto, setModalProducto] = useState(null);
  const [modalNuevo, setModalNuevo] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [modalMarca, setModalMarca] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [cargando, setCargando] = useState(true);
  const [filtroTaller, setFiltroTaller] = useState("pendiente");
  const [busquedaTaller, setBusquedaTaller] = useState("");
  const [marcaTaller, setMarcaTaller] = useState("");
  const [modeloTaller, setModeloTaller] = useState("");
// Estado:
  const [modalAgregarModelo, setModalAgregarModelo] = useState(null);
  const [modalAgregarUnidad, setModalAgregarUnidad] = useState(null);
// modalAgregarUnidad = { marca, modelo }
  const [marcas, setMarcas] = useState(catalogoData.marcas);
  const categorias = catalogoData.categorias_productos;

const [descargas, setDescargas] = useState(null);
const [guardandoDescargas, setGuardandoDescargas] = useState(false);
const [msgDescargas, setMsgDescargas] = useState("");

// integracion con odoo
const [odooStatus, setOdooStatus] = useState(null);
const [odooTestando, setOdooTestando] = useState(false);
const [odooSyncando, setOdooSyncando] = useState(false);
const [odooPreview, setOdooPreview] = useState(null);
const [odooLog, setOdooLog] = useState([]);
const [odooModo, setOdooModo] = useState("preview");
const [odooLimite, setOdooLimite] = useState(100);


  // Cargar productos
  const cargarProductos = async () => {
    setCargando(true);
    try {
      const res = await fetch("/api/admin/productos");
      const data = await res.json();
      if (data.ok) setProductos(data.productos);
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

const cargarPromos = async () => {
  try {
    const res = await fetch("/api/admin/promos");
    const data = await res.json();
    if (data.ok) setPromos(data.data);
  } catch (e) { console.error(e); }
};

const cargarMarcas = async () => {
  try {
    const res = await fetch("/api/admin/catalogo?t=" + Date.now()); // evita cache
    const data = await res.json();
    if (data.ok) {
      setMarcas(data.data.marcas);
    }
  } catch (e) {
    console.error("Error cargando marcas:", e);
  }
};

const cargarDescargas = async () => {
  try {
    const res = await fetch("/api/admin/descargas");
    const data = await res.json();
    if (data.ok) setDescargas(data.data);
  } catch (e) { console.error(e); }
};


const testOdoo = async () => {
  setOdooTestando(true);
  setOdooStatus(null);
  try {
    const res = await fetch("/api/sync-odoo");
    const data = await res.json();
    setOdooStatus(data);
  } catch (e) {
    setOdooStatus({ ok: false, error: e.message });
  } finally {
    setOdooTestando(false);
  }
};
const handleLogout = async () => {
  await fetch("/api/admin/logout", { method: "POST" });
  window.location.href = "/admin/login";
};
const syncOdoo = async (modo) => {
  setOdooSyncando(true);
  setOdooPreview(null);
  setOdooLog([]);
  try {
    const res = await fetch("/api/sync-odoo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ modo, limite: odooLimite }),
    });
    const data = await res.json();
    if (modo === "preview") {
      setOdooPreview(data);
    } else {
      setOdooLog(data.log || []);
      setOdooPreview(data);
      if (data.ok) await cargarProductos();
    }
  } catch (e) {
    setOdooPreview({ ok: false, error: e.message });
  } finally {
    setOdooSyncando(false);
  }
};

  useEffect(() => {
  cargarProductos();
  cargarMarcas();
  cargarPromos();
  cargarDescargas();
}, []);

  // Filtrar
  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const q = busqueda.toLowerCase();
      const matchBusqueda = !q ||
        p.nombre?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.codigo?.toLowerCase().includes(q);
      const matchMarca = !marcaFiltro || p.marca_id === marcaFiltro;
      return matchBusqueda && matchMarca;
    });
  }, [productos, busqueda, marcaFiltro]);



  const handleToggleUnidad = async (marcaId, modeloId, unidadId, activo) => {
  try {
    await fetch("/api/admin/marcas/" + marcaId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        actualizar_unidad: true,
        modelo_id: modeloId,
        unidad_id: unidadId,
        cambios: { activo },
      }),
    });
    await cargarMarcas();
  } catch (e) { console.error(e); }
};

const handleEliminarUnidad = async (marcaId, modeloId, unidadId) => {
  if (!window.confirm("¿Eliminar esta unidad? Los productos vinculados quedarán sin color asignado.")) return;
  try {
    await fetch("/api/admin/marcas/" + marcaId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eliminar_unidad: true,
        modelo_id: modeloId,
        unidad_id: unidadId,
      }),
    });
    await cargarMarcas();
    await cargarProductos(); // actualiza productos desvinculados
  } catch (e) { console.error(e); }
};

  // Stats
  const stats = {
    total: productos.length,
    activos: productos.filter((p) => p.activo).length,
    enOferta: productos.filter((p) =>
      p.precio_oferta && p.oferta_hasta && new Date(p.oferta_hasta) > new Date()
    ).length,
    marcas: [...new Set(productos.map((p) => p.marca_id).filter(Boolean))].length,
  };

  const handleEliminar = async (id) => {
    try {
      const res = await fetch("/api/admin/productos/" + id, { method: "DELETE" });
      const data = await res.json();
      if (data.ok) {
        setProductos((prev) => prev.filter((p) => p.id !== id));
        setConfirmDelete(null);
      }
    } catch (e) { console.error(e); }
  };

  const handleToggleActivo = async (producto) => {
    try {
      const res = await fetch("/api/admin/productos/" + producto.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...producto, activo: !producto.activo }),
      });
      const data = await res.json();
      if (data.ok) setProductos((prev) =>
        prev.map((p) => p.id === producto.id ? data.producto : p)
      );
    } catch (e) { console.error(e); }
  };

  const handleGuardar = (productoGuardado) => {
    setProductos((prev) => {
      const idx = prev.findIndex((p) => p.id === productoGuardado.id);
      if (idx >= 0) {
        const nuevo = [...prev];
        nuevo[idx] = productoGuardado;
        return nuevo;
      }
      return [...prev, productoGuardado];
    });
    setModalProducto(null);
    setModalNuevo(false);
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncMsg("");
    try {
      const res = await fetch("/api/sync-odoo", { method: "POST" });
      const data = await res.json();
      setSyncMsg(data.ok ? "✅ " + data.mensaje : "❌ " + data.error);
      if (data.ok) cargarProductos();
    } catch {
      setSyncMsg("❌ Error de conexión");
    } finally {
      setSyncing(false);
    }
  };

  const tieneOfertaActiva = (p) =>
    p.precio_oferta && p.oferta_hasta && new Date(p.oferta_hasta) > new Date();

  const ESTADO_COLOR = {
    "disponible": "bg-green-100 text-green-700",
    "últimas unidades": "bg-amber-100 text-amber-700",
    "pre-venta": "bg-blue-100 text-blue-700",
    "agotado": "bg-red-100 text-red-600",
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center font-black text-white text-sm shadow">
              NA
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest">NipponAutoparts</p>
              <h1 className="text-zinc-900 font-black text-sm">Panel de Administración</h1>
            </div>

           

          </div>
          <div className="flex items-center gap-3">
            {syncMsg && <span className="text-xs text-gray-500">{syncMsg}</span>}
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
            >
              {syncing ? "Sincronizando..." : "⟳ Sync Odoo"}
            </button>
            <Link href="/" className="text-gray-400 hover:text-gray-700 text-xs font-semibold transition">
              ← Ver sitio
            </Link>
<button
  onClick={handleLogout}
  className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-3 py-2 rounded-xl transition border border-red-200"
>
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
  Salir
</button>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total productos", value: stats.total, icon: "📦", color: "bg-blue-50 border-blue-100" },
            { label: "Activos", value: stats.activos, icon: "✅", color: "bg-green-50 border-green-100" },
            { label: "En oferta", value: stats.enOferta, icon: "🔥", color: "bg-red-50 border-red-100" },
            { label: "Marcas", value: stats.marcas, icon: "🚗", color: "bg-purple-50 border-purple-100" },
          ].map((s) => (
            <div key={s.label} className={"bg-white rounded-2xl p-4 border " + s.color}>
              <div className="flex items-center gap-2 mb-1">
                <span>{s.icon}</span>
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              </div>
              <p className="text-2xl font-black text-zinc-900">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Sidebar + contenido */}
        <div className="flex gap-6">

          {/* Sidebar */}
          <aside className="w-48 flex-shrink-0 hidden sm:block">
            <div className="bg-white rounded-2xl border border-gray-100 p-3 flex flex-col gap-1">
              {[
                { id: "productos", label: "Productos", emoji: "📦" },
                { id: "promociones", label: "Promociones", emoji: "🔥" },
                { id: "marcas", label: "Marcas", emoji: "🚗" },
                { id: "importar", label: "Importar Excel", emoji: "📊" },
                { id: "taller", label: "Taller", emoji: "🔧" },
                { id: "descargas", label: "Descargas", emoji: "🚢" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={"flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition " +
                    (tab === item.id
                      ? "bg-red-600 text-white"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800")}
                >
                  <span>{item.emoji}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Contenido */}
          <main className="flex-1 min-w-0">

            {/* Tab Productos */}
            {tab === "productos" && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-gray-100">
                  <div className="relative flex-1 min-w-48">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                      type="text"
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      placeholder="Buscar producto, SKU, código..."
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-400 transition"
                    />
                  </div>
                  <select
                    value={marcaFiltro}
                    onChange={(e) => setMarcaFiltro(e.target.value)}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-400 transition"
                  >
                    <option value="">Todas las marcas</option>
                    {marcas.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                  </select>
                  <span className="text-gray-400 text-xs">{productosFiltrados.length} productos</span>
                  <button
                    onClick={() => setModalNuevo(true)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition ml-auto"
                  >
                    + Nuevo producto
                  </button>
                </div>

                {/* Tabla */}
                {cargando ? (
                  <div className="py-20 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : productosFiltrados.length === 0 ? (
                  <div className="py-20 text-center">
                    <p className="text-gray-500 font-semibold">Sin productos</p>
                    <p className="text-gray-400 text-sm mt-1">Crea el primero con el botón de arriba</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="text-left px-5 py-3 text-xs text-gray-500 font-bold uppercase tracking-wide">Producto</th>
                          <th className="text-left px-4 py-3 text-xs text-gray-500 font-bold uppercase tracking-wide hidden md:table-cell">Marca / Modelo</th>
                          <th className="text-left px-4 py-3 text-xs text-gray-500 font-bold uppercase tracking-wide">Precio</th>
                          <th className="text-left px-4 py-3 text-xs text-gray-500 font-bold uppercase tracking-wide hidden sm:table-cell">Estado</th>
                          <th className="text-center px-4 py-3 text-xs text-gray-500 font-bold uppercase tracking-wide">Activo</th>
                          <th className="text-right px-5 py-3 text-xs text-gray-500 font-bold uppercase tracking-wide">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productosFiltrados.map((p) => (
                          <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                            <td className="px-5 py-3.5">
                              <p className="font-bold text-zinc-900 text-sm leading-tight">{p.nombre}</p>
                              <p className="text-gray-400 text-xs mt-0.5">{p.sku} · Cód: {p.codigo}</p>
                            </td>
                            <td className="px-4 py-3.5 hidden md:table-cell">
                              <p className="text-gray-700 text-xs font-semibold capitalize">{p.marca_id}</p>
                              <p className="text-gray-400 text-xs">{p.modelo_id}</p>
                            </td>
                            <td className="px-4 py-3.5">
                              {tieneOfertaActiva(p) ? (
                                <div>
                                  <span className="text-red-600 font-black text-sm">S/ {p.precio_oferta?.toLocaleString()}</span>
                                  <span className="text-gray-400 line-through text-xs ml-1">S/ {p.precio_normal?.toLocaleString()}</span>
                                  <span className="block text-xs text-red-400">🔥 Oferta</span>
                                </div>
                              ) : p.mostrar_precio ? (
                                <span className="font-bold text-zinc-900">S/ {p.precio_normal?.toLocaleString()}</span>
                              ) : (
                                <span className="text-gray-400 text-xs">Consultar</span>
                              )}
                            </td>
                            <td className="px-4 py-3.5 hidden sm:table-cell">
                              <span className={"text-xs font-semibold px-2.5 py-1 rounded-full " + (ESTADO_COLOR[p.estado] || "bg-gray-100 text-gray-500")}>
                                {p.estado}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <div
                                onClick={() => handleToggleActivo(p)}
                                className={"w-10 h-5 rounded-full transition-colors duration-200 flex items-center cursor-pointer mx-auto " +
                                  (p.activo ? "bg-green-500" : "bg-gray-300")}
                              >
                                <div className={"w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 mx-0.5 " +
                                  (p.activo ? "translate-x-5" : "translate-x-0")} />
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => setModalProducto(p)}
                                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-lg transition"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(p)}
                                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold rounded-lg transition"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Tab Marcas */}
            {tab === "marcas" && (
  <div className="bg-white rounded-2xl border border-gray-100 p-6">
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-lg font-black text-zinc-900">Marcas y Modelos</h2>
      <button
        onClick={() => setModalMarca(true)}
        className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition"
      >
        + Nueva marca
      </button>
    </div>

    <div className="flex flex-col gap-4">
      {marcas.map((m) => (
        <div key={m.id} className="border border-gray-100 rounded-2xl overflow-hidden">

          {/* Header marca */}
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-3">
              <img src={m.logo} alt={m.nombre}
                className="w-9 h-9 object-contain bg-white rounded-xl p-1.5 border border-gray-200" />
              <div>
                <h3 className="font-black text-zinc-900">{m.nombre}</h3>
                <p className="text-gray-400 text-xs">{m.modelos?.length || 0} modelos</p>
              </div>
            </div>
            <button
              onClick={() => setModalAgregarModelo(m)}
              className="bg-white hover:bg-gray-100 border border-gray-200 text-gray-600 font-bold text-xs px-3 py-2 rounded-xl transition"
            >
              + Nuevo modelo
            </button>
          </div>

          {/* Modelos */}
          <div className="divide-y divide-gray-50">
            {m.modelos?.map((mod) => (
              <div key={mod.id} className="px-4 py-3">
                <div className="flex items-start gap-3">

                  {/* Foto modelo */}
                  {mod.imagen && (
                    <img src={mod.imagen} alt={mod.nombre}
                      className="w-16 h-12 object-contain bg-gray-50 rounded-xl border border-gray-100 flex-shrink-0" />
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-zinc-900 text-sm">{mod.nombre}</p>
                        <p className="text-gray-500 text-xs mt-0.5">
                          Chasis: <span className="font-semibold text-zinc-700">{mod.chasis}</span>
                          {mod.anio && <span className="ml-2">· {mod.anio}</span>}
                        </p>
                      </div>
                      <button
                        onClick={() => setModalAgregarUnidad({ marca: m, modelo: mod })}
                        className="flex-shrink-0 bg-green-50 hover:bg-green-100 text-green-700 font-bold text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                      >
                        <span>🚗</span> + Unidad
                      </button>
                    </div>

                    
                    {/* Unidades/colores */}
{mod.unidades?.length > 0 && (
  <div className="flex flex-wrap gap-1.5 mt-2">
    {mod.unidades.map((u) => (
      <div
        key={u.id}
        className={"flex items-center gap-1.5 rounded-lg px-2 py-1 border " +
          (u.activo === false
            ? "bg-gray-100 border-gray-200 opacity-50"
            : "bg-white border-gray-200")}
      >
        {/* Color dot */}
        <div
          className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0"
          style={{ backgroundColor: u.color_hex }}
        />

        {/* Nombre + tipo */}
        <span className="text-xs text-gray-600 font-medium">{u.color_nombre}</span>
        {u.tipo_importacion && (
          <span className={"text-xs font-bold px-1.5 py-0.5 rounded " +
            (u.tipo_importacion === "cdk"
              ? "bg-amber-100 text-amber-700"
              : "bg-green-100 text-green-700")}>
            {u.tipo_importacion === "cdk" ? "CDK" : "COMP."}
          </span>
        )}

        {/* Estado */}
        {u.estado_unidad && u.estado_unidad !== "disponible" && (
          <span className="text-xs bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded">
            {u.estado_unidad === "proxima-descarga" ? "PRÓX." : u.estado_unidad.toUpperCase()}
          </span>
        )}

        {/* Toggle activo */}
        <div
          onClick={() => handleToggleUnidad(m.id, mod.id, u.id, u.activo === false)}
          title={u.activo === false ? "Activar unidad" : "Desactivar unidad"}
          className={"w-8 h-4 rounded-full flex items-center cursor-pointer transition-colors " +
            (u.activo === false ? "bg-gray-300" : "bg-green-500")}
        >
          <div className={"w-3 h-3 bg-white rounded-full shadow transition-transform mx-0.5 " +
            (u.activo === false ? "translate-x-0" : "translate-x-4")} />
        </div>

        {/* Eliminar */}
        <button
          onClick={() => handleEliminarUnidad(m.id, mod.id, u.id)}
          title="Eliminar unidad"
          className="text-red-400 hover:text-red-600 transition ml-0.5"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    ))}
  </div>
)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

{modalMarca && (
  <MarcaFormModal
    onClose={() => setModalMarca(null)}
    onGuardar={(nuevaMarca) => {
      setModalMarca(null);
      window.location.reload(); // Recarga para ver la nueva marca
    }}
  />
)}

{modalAgregarModelo && (
  <AgregarModeloModal
    marca={modalAgregarModelo}
    onClose={() => setModalAgregarModelo(null)}
    onGuardar={() => {
      setModalAgregarModelo(null);
      window.location.reload();
    }}
  />
)}

{modalAgregarUnidad && (
  <AgregarUnidadModal
    marca={modalAgregarUnidad.marca}
    modelo={modalAgregarUnidad.modelo}
    onClose={() => setModalAgregarUnidad(null)}
    onGuardar={async () => {
      setModalAgregarUnidad(null);
      await new Promise(r => setTimeout(r, 300)); // espera que el archivo se escriba
      await cargarMarcas();
    }}
  />
)}
                 {/* Tab Importar */}
             {tab === "descargas" && (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
    <div className="px-5 py-4 border-b border-gray-100">
      <h2 className="font-black text-zinc-900 text-lg">🚢 Próximas Descargas</h2>
      <p className="text-gray-400 text-xs mt-0.5">
        Los autos se agregan desde <strong>Marcas → modelo → + Unidad → Estado: Próxima descarga</strong>
      </p>
    </div>

    {!descargas ? (
      <div className="py-16 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    ) : (
      <div className="p-5 flex flex-col gap-4">

        {/* Info */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-blue-700 text-xs font-bold mb-2">
            ✅ Autos en próximas descargas registrados:
          </p>
          {(() => {
            const unidades = [];
            catalogoData.marcas?.forEach(m =>
              m.modelos?.forEach(mod =>
                mod.unidades?.forEach(u => {
                  if (u.estado_unidad === "proxima-descarga")
                    unidades.push({ ...u, marca: m.nombre, modelo: mod.nombre });
                })
              )
            );
            return unidades.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {unidades.map(u => (
                  <div key={u.id} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-blue-100">
                    <div className="w-3 h-3 rounded-full border border-gray-200"
                      style={{ backgroundColor: u.color_hex }} />
                    <span className="text-zinc-700 text-xs font-semibold">
                      {u.marca} {u.modelo} · {u.color_nombre}
                    </span>
                    {u.contenedor && (
                      <span className="text-gray-400 text-xs ml-auto font-mono">{u.contenedor}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-blue-600 text-xs">
                No hay unidades con estado "Próxima descarga" aún.
                Ve a <strong>Marcas → modelo → + Unidad</strong> para agregar.
              </p>
            );
          })()}
        </div>

        {/* Contenedores */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            Contenedores ({descargas.contenedores?.length || 0})
          </p>
          <button
            onClick={() => {
              const nuevo = {
                id: "cont-" + Date.now(),
                activo: true,
                titulo: "Nuevo Contenedor",
                descripcion: "",
                fecha_llegada: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
                numero_contenedor: "",
                estado: "en-camino",
              };
              setDescargas(d => ({ ...d, contenedores: [...(d.contenedores || []), nuevo] }));
            }}
            className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-3 py-2 rounded-xl transition"
          >
            + Nuevo contenedor
          </button>
        </div>

        {descargas.contenedores?.map((cont, ci) => (
          <div key={cont.id} className="border border-gray-100 rounded-2xl p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Título</label>
                <input
                  value={cont.titulo}
                  onChange={(e) => {
                    const c = [...descargas.contenedores];
                    c[ci] = { ...c[ci], titulo: e.target.value };
                    setDescargas(d => ({ ...d, contenedores: c }));
                  }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-red-400 transition"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">N° Contenedor</label>
                <input
                  value={cont.numero_contenedor}
                  onChange={(e) => {
                    const c = [...descargas.contenedores];
                    c[ci] = { ...c[ci], numero_contenedor: e.target.value };
                    setDescargas(d => ({ ...d, contenedores: c }));
                  }}
                  placeholder="TCKU3456789"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono outline-none focus:border-red-400 transition"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Fecha llegada</label>
                <input
                  type="datetime-local"
                  value={cont.fecha_llegada?.slice(0, 16) || ""}
                  onChange={(e) => {
                    const c = [...descargas.contenedores];
                    c[ci] = { ...c[ci], fecha_llegada: e.target.value };
                    setDescargas(d => ({ ...d, contenedores: c }));
                  }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-red-400 transition"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Estado</label>
                <div className="flex gap-2">
                  <select
                    value={cont.estado}
                    onChange={(e) => {
                      const c = [...descargas.contenedores];
                      c[ci] = { ...c[ci], estado: e.target.value };
                      setDescargas(d => ({ ...d, contenedores: c }));
                    }}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
                  >
                    <option value="en-camino">🚢 En camino</option>
                    <option value="en-puerto">🏭 En puerto</option>
                    <option value="disponible">✅ Disponible</option>
                  </select>
                  <div
                    onClick={() => {
                      const c = [...descargas.contenedores];
                      c[ci] = { ...c[ci], activo: !c[ci].activo };
                      setDescargas(d => ({ ...d, contenedores: c }));
                    }}
                    className={"w-11 h-10 rounded-xl flex items-center justify-center cursor-pointer transition border " +
                      (cont.activo ? "bg-green-50 border-green-200" : "bg-gray-100 border-gray-200")}
                  >
                    <div className={"w-5 h-5 rounded-full " + (cont.activo ? "bg-green-500" : "bg-gray-400")} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-xs">
                💡 Asigna el N° de contenedor a las unidades en Marcas para que aparezcan aquí agrupadas
              </p>
              <button
                onClick={() => {
                  if (!window.confirm("¿Eliminar este contenedor?")) return;
                  setDescargas(d => ({
                    ...d,
                    contenedores: d.contenedores.filter((_, j) => j !== ci)
                  }));
                }}
                className="text-red-400 hover:text-red-600 text-xs font-bold transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}

        {/* Guardar */}
        <div className="sticky bottom-0 bg-white pt-3 border-t border-gray-100">
          <button
            onClick={async () => {
              setGuardandoDescargas(true);
              try {
                const res = await fetch("/api/admin/descargas", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(descargas),
                });
                const data = await res.json();
                if (data.ok) {
                  setMsgDescargas("✅ Guardado");
                  setTimeout(() => setMsgDescargas(""), 3000);
                }
              } catch { setMsgDescargas("❌ Error"); }
              finally { setGuardandoDescargas(false); }
            }}
            disabled={guardandoDescargas}
            className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-black py-3.5 rounded-2xl text-sm transition"
          >
            {guardandoDescargas ? "Guardando..." : "💾 Guardar contenedores"}
          </button>
        </div>
      </div>
    )}
  </div>
)}

            {/* Tab Importar */}
            

{tab === "importar" && (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
    <div className="px-5 py-4 border-b border-gray-100">
      <h2 className="font-black text-zinc-900 text-lg">⟳ Integración Odoo</h2>
      <p className="text-gray-400 text-xs mt-0.5">
        Sincroniza productos desde tu Odoo en la nube
      </p>
    </div>

    <div className="p-5 flex flex-col gap-5">

      {/* Estado configuración */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
          📋 Configuración requerida
        </p>
        <div className="flex flex-col gap-2">
          {[
            { key: "ODOO_URL", ejemplo: "https://tunombre.odoo.com", desc: "URL de tu Odoo" },
            { key: "ODOO_DB", ejemplo: "tunombre", desc: "Nombre de la base de datos" },
            { key: "ODOO_USERNAME", ejemplo: "admin@empresa.com", desc: "Email del usuario" },
            { key: "ODOO_API_KEY", ejemplo: "tu_clave_generada", desc: "Clave API de Odoo" },
          ].map((v) => (
            <div key={v.key} className="flex items-start gap-3 bg-white rounded-xl px-3 py-2 border border-gray-100">
              <code className="text-xs font-mono font-bold text-red-600 flex-shrink-0 mt-0.5">
                {v.key}
              </code>
              <div className="flex-1 min-w-0">
                <p className="text-zinc-700 text-xs">{v.desc}</p>
                <p className="text-gray-400 text-xs font-mono truncate">Ej: {v.ejemplo}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-3">
          <p className="text-blue-700 text-xs font-bold mb-1">
            ¿Cómo generar la API Key en Odoo?
          </p>
          <ol className="text-blue-600 text-xs space-y-0.5 list-decimal list-inside">
            <li>Entra a tu Odoo → Ajustes</li>
            <li>Ve a Usuarios y Compañías → Usuarios</li>
            <li>Selecciona tu usuario</li>
            <li>Tab "Seguridad de la cuenta" → Claves API</li>
            <li>Click en "Nueva clave" → copia el valor</li>
            <li>Pégala en <code className="bg-blue-100 px-1 rounded">.env.local</code></li>
          </ol>
        </div>
      </div>

      {/* Test de conexión */}
      <div className="border border-gray-100 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            1. Probar conexión
          </p>
          <button
            onClick={testOdoo}
            disabled={odooTestando}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-700 disabled:opacity-50 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
          >
            {odooTestando ? (
              <>
                <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
                  <path d="M12 2a10 10 0 0110 10" strokeLinecap="round"/>
                </svg>
                Probando...
              </>
            ) : "⚡ Probar conexión"}
          </button>
        </div>

        {odooStatus && (
          <div className={"rounded-xl p-3 " +
            (odooStatus.ok ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200")}>
            {odooStatus.ok ? (
              <div>
                <p className="text-green-700 font-bold text-sm mb-1">✅ {odooStatus.mensaje}</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="bg-white rounded-lg px-3 py-2">
                    <p className="text-gray-500 text-xs">Productos en Odoo</p>
                    <p className="text-zinc-900 font-black text-lg">{odooStatus.total_productos_odoo?.toLocaleString()}</p>
                  </div>
                  <div className="bg-white rounded-lg px-3 py-2">
                    <p className="text-gray-500 text-xs">URL</p>
                    <p className="text-zinc-700 text-xs font-mono truncate">{odooStatus.url}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-red-700 font-bold text-sm mb-1">❌ Error de conexión</p>
                <p className="text-red-600 text-xs">{odooStatus.error}</p>
                {!odooStatus.configurado && (
                  <p className="text-red-500 text-xs mt-1 font-semibold">
                    → Agrega las variables en .env.local y reinicia el servidor
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="border border-gray-100 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            2. Vista previa
          </p>
          <div className="flex items-center gap-2">
            <select
              value={odooLimite}
              onChange={(e) => setOdooLimite(Number(e.target.value))}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none"
            >
              <option value={10}>10 productos</option>
              <option value={50}>50 productos</option>
              <option value={100}>100 productos</option>
              <option value={500}>500 productos</option>
              <option value={1000}>1,000 productos</option>
              <option value={5000}>5,000 productos</option>
            </select>
            <button
              onClick={() => syncOdoo("preview")}
              disabled={odooSyncando}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
            >
              {odooSyncando ? "Cargando..." : "👁 Ver preview"}
            </button>
          </div>
        </div>

        {odooPreview?.modo === "preview" && odooPreview.ok && (
          <div>
            <p className="text-gray-600 text-xs mb-2">
              Se importarían <strong>{odooPreview.total}</strong> productos. Muestra de los primeros 5:
            </p>
            <div className="flex flex-col gap-1.5">
              {odooPreview.muestra?.map((p, i) => (
                <div key={i} className="bg-gray-50 rounded-lg px-3 py-2 flex items-center gap-3">
                  <span className="text-gray-400 text-xs font-mono w-6">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-zinc-800 text-xs font-semibold truncate">{p.nombre}</p>
                    <p className="text-gray-400 text-xs">{p.codigo} · {p.categoria_odoo}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-zinc-800 text-xs font-bold">S/ {p.precio?.toLocaleString()}</p>
                    <p className="text-gray-400 text-xs">Stock: {p.stock}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sincronizar */}
      <div className="border-2 border-red-100 rounded-2xl p-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
          3. Sincronizar
        </p>
        <p className="text-gray-400 text-xs mb-3">
          Los productos nuevos se crearán. Los existentes actualizarán precio y stock.
          Las fotos y datos locales no se borran.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">
          <p className="text-amber-700 text-xs font-bold">
            ⚠️ Importante antes de sincronizar:
          </p>
          <ul className="text-amber-600 text-xs mt-1 space-y-0.5 list-disc list-inside">
            <li>Haz una copia de <code className="bg-amber-100 px-1 rounded">data/catalogo.json</code></li>
            <li>Primero prueba con 10-50 productos</li>
            <li>Revisa que las categorías de Odoo coincidan con las locales</li>
          </ul>
        </div>

        <button
          onClick={() => {
            if (!window.confirm(
              "¿Sincronizar " + odooLimite + " productos desde Odoo?\n\n" +
              "Los nuevos se crearán y los existentes actualizarán precio/stock.\n" +
              "Las fotos y datos locales se conservan."
            )) return;
            syncOdoo("sync");
          }}
          disabled={odooSyncando || !odooStatus?.ok}
          className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-3.5 rounded-2xl text-sm transition flex items-center justify-center gap-2"
        >
          {odooSyncando ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
                <path d="M12 2a10 10 0 0110 10" strokeLinecap="round"/>
              </svg>
              Sincronizando {odooLimite} productos...
            </>
          ) : (
            "⟳ Sincronizar " + odooLimite + " productos desde Odoo"
          )}
        </button>

        {/* Log de sincronización */}
        {odooPreview?.modo === "sync" && (
          <div className="mt-3">
            {odooPreview.ok ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                <p className="text-green-700 font-bold text-sm mb-2">
                  ✅ {odooPreview.mensaje}
                </p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-white rounded-lg px-2 py-1.5 text-center">
                    <p className="text-green-600 font-black text-lg">{odooPreview.creados}</p>
                    <p className="text-gray-500 text-xs">Creados</p>
                  </div>
                  <div className="bg-white rounded-lg px-2 py-1.5 text-center">
                    <p className="text-blue-600 font-black text-lg">{odooPreview.actualizados}</p>
                    <p className="text-gray-500 text-xs">Actualizados</p>
                  </div>
                  <div className="bg-white rounded-lg px-2 py-1.5 text-center">
                    <p className="text-gray-600 font-black text-lg">{odooPreview.total}</p>
                    <p className="text-gray-500 text-xs">Total</p>
                  </div>
                </div>
                {odooLog.length > 0 && (
                  <div className="max-h-32 overflow-y-auto">
                    {odooLog.map((l, i) => (
                      <p key={i} className="text-green-600 text-xs">{l}</p>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-600 text-xs font-bold">❌ {odooPreview.error}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mapa de categorías */}
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
          📋 Mapa de categorías Odoo → Nippon
        </p>
        <p className="text-gray-400 text-xs mb-3">
          Si el nombre de la categoría en Odoo coincide (ignora mayúsculas) con una categoría local, se asigna automáticamente. Si no coincide, queda como "otros".
        </p>
        <div className="flex flex-wrap gap-1.5">
          {catalogoData.categorias_productos?.map((c) => (
            <span key={c.id}
              className="bg-white border border-gray-200 text-gray-600 text-xs px-2.5 py-1 rounded-lg">
              {c.icono} {c.nombre}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
)}





            {/* Tab Promociones */}
            {tab === "promociones" && (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

    {/* Header */}
    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
      <div>
        <h2 className="font-black text-zinc-900 text-lg">🔥 Modal de Promociones</h2>
        <p className="text-gray-400 text-xs mt-0.5">
          Aparece automáticamente al entrar al sitio web
        </p>
      </div>
      {msgPromos && (
        <span className="text-green-600 text-xs font-bold">{msgPromos}</span>
      )}
    </div>

    {!promos ? (
      <div className="py-16 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    ) : (
      <div className="p-5 flex flex-col gap-5">

        {/* Config global */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
            Configuración general
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

            {/* Toggle activo */}
            <div
              onClick={() => setPromos(p => ({ ...p, activo: !p.activo }))}
              className={"flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all " +
                (promos.activo ? "border-green-300 bg-green-50" : "border-gray-200 bg-white")}
            >
              <div className={"w-10 h-5 rounded-full flex items-center transition-colors " +
                (promos.activo ? "bg-green-500" : "bg-gray-300")}>
                <div className={"w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 " +
                  (promos.activo ? "translate-x-5" : "translate-x-0")} />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-800">
                  {promos.activo ? "Modal activo" : "Modal desactivado"}
                </p>
                <p className="text-xs text-gray-400">
                  {promos.activo ? "Aparece al entrar" : "No aparece"}
                </p>
              </div>
            </div>

            {/* Delay */}
            <div className="p-3 bg-white rounded-xl border border-gray-200">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">
                Demora (segundos)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={promos.delay_segundos}
                onChange={(e) => setPromos(p => ({ ...p, delay_segundos: Number(e.target.value) }))}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-red-400 transition"
              />
            </div>

            {/* Título */}
            <div className="p-3 bg-white rounded-xl border border-gray-200">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">
                Título del modal
              </label>
              <input
                value={promos.titulo_seccion}
                onChange={(e) => setPromos(p => ({ ...p, titulo_seccion: e.target.value }))}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-red-400 transition"
              />
            </div>
          </div>
        </div>

        {/* Lista de productos promo */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Productos en el modal ({promos.productos?.length || 0})
            </p>
            <button
              onClick={() => {
                const nuevo = {
                  id: Date.now(),
                  activo: true,
                  badge: "NUEVO",
                  badge_color: "rojo",
                  nombre: "",
                  descripcion: "",
                  precio: "",
                  precio_antes: null,
                  estado: "Disponible",
                  imagen: "",
                  whatsapp_mensaje: "",
                };
                setPromos(p => ({ ...p, productos: [...(p.productos || []), nuevo] }));
              }}
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-3 py-2 rounded-xl transition"
            >
              + Agregar promoción
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {promos.productos?.map((prod, i) => (
              <div key={prod.id}
                className={"rounded-2xl border-2 overflow-hidden transition-all " +
                  (prod.activo ? "border-gray-100" : "border-gray-100 opacity-60")}>

                {/* Header del producto promo */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    {/* Toggle activo */}
                    <div
                      onClick={() => {
                        const prods = [...promos.productos];
                        prods[i] = { ...prods[i], activo: !prods[i].activo };
                        setPromos(p => ({ ...p, productos: prods }));
                      }}
                      className={"w-9 h-5 rounded-full flex items-center cursor-pointer transition-colors " +
                        (prod.activo ? "bg-green-500" : "bg-gray-300")}
                    >
                      <div className={"w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 " +
                        (prod.activo ? "translate-x-4" : "translate-x-0")} />
                    </div>
                    <p className="font-bold text-zinc-800 text-sm">
                      {prod.nombre || "Sin nombre"}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (!window.confirm("¿Eliminar esta promoción?")) return;
                      setPromos(p => ({
                        ...p,
                        productos: p.productos.filter((_, j) => j !== i)
                      }));
                    }}
                    className="text-red-400 hover:text-red-600 transition"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>

                {/* Campos */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">
                      Nombre del producto
                    </label>
                    <input
                      value={prod.nombre}
                      onChange={(e) => {
                        const prods = [...promos.productos];
                        prods[i] = { ...prods[i], nombre: e.target.value };
                        setPromos(p => ({ ...p, productos: prods }));
                      }}
                      placeholder="Ej: Motor 1NZ Toyota Probox"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-red-400 transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">
                      Precio
                    </label>
                    <input
                      value={prod.precio}
                      onChange={(e) => {
                        const prods = [...promos.productos];
                        prods[i] = { ...prods[i], precio: e.target.value };
                        setPromos(p => ({ ...p, productos: prods }));
                      }}
                      placeholder="Ej: S/ 2,800"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-red-400 transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">
                      Precio antes (opcional)
                    </label>
                    <input
                      value={prod.precio_antes || ""}
                      onChange={(e) => {
                        const prods = [...promos.productos];
                        prods[i] = { ...prods[i], precio_antes: e.target.value || null };
                        setPromos(p => ({ ...p, productos: prods }));
                      }}
                      placeholder="Ej: S/ 3,200"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-red-400 transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">
                      Badge
                    </label>
                    <div className="flex gap-2">
                      <input
                        value={prod.badge}
                        onChange={(e) => {
                          const prods = [...promos.productos];
                          prods[i] = { ...prods[i], badge: e.target.value };
                          setPromos(p => ({ ...p, productos: prods }));
                        }}
                        placeholder="Ej: OFERTA"
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-red-400 transition"
                      />
                      <select
                        value={prod.badge_color}
                        onChange={(e) => {
                          const prods = [...promos.productos];
                          prods[i] = { ...prods[i], badge_color: e.target.value };
                          setPromos(p => ({ ...p, productos: prods }));
                        }}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-2 py-2 text-xs outline-none focus:border-red-400 transition"
                      >
                        <option value="rojo">🔴 Rojo</option>
                        <option value="verde">🟢 Verde</option>
                        <option value="azul">🔵 Azul</option>
                        <option value="naranja">🟠 Naranja</option>
                        <option value="negro">⚫ Negro</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">
                      Estado
                    </label>
                    <select
                      value={prod.estado}
                      onChange={(e) => {
                        const prods = [...promos.productos];
                        prods[i] = { ...prods[i], estado: e.target.value };
                        setPromos(p => ({ ...p, productos: prods }));
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-red-400 transition"
                    >
                      <option value="Disponible">Disponible</option>
                      <option value="Últimas unidades">Últimas unidades</option>
                      <option value="Pre-venta">Pre-venta</option>
                      <option value="Agotado">Agotado</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">
                      Descripción
                    </label>
                    <textarea
                      value={prod.descripcion}
                      onChange={(e) => {
                        const prods = [...promos.productos];
                        prods[i] = { ...prods[i], descripcion: e.target.value };
                        setPromos(p => ({ ...p, productos: prods }));
                      }}
                      rows={2}
                      placeholder="Descripción breve del producto"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-red-400 transition resize-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">
                      Imagen (ruta)
                    </label>
                    <input
                      value={prod.imagen}
                      onChange={(e) => {
                        const prods = [...promos.productos];
                        prods[i] = { ...prods[i], imagen: e.target.value };
                        setPromos(p => ({ ...p, productos: prods }));
                      }}
                      placeholder="/productos/motores/Toyota/Probox/1nz/01-1415.png"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-red-400 transition font-mono text-xs"
                    />
                    {prod.imagen && (
                      <div className="mt-2 h-20 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                        <img src={prod.imagen} alt="preview"
                          className="w-full h-full object-contain p-1"
                          onError={(e) => { e.target.style.opacity = "0.3"; }} />
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">
                      Mensaje WhatsApp
                    </label>
                    <input
                      value={prod.whatsapp_mensaje}
                      onChange={(e) => {
                        const prods = [...promos.productos];
                        prods[i] = { ...prods[i], whatsapp_mensaje: e.target.value };
                        setPromos(p => ({ ...p, productos: prods }));
                      }}
                      placeholder="Hola, consulto por..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-red-400 transition"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botón guardar */}
        <div className="sticky bottom-0 bg-white pt-3 border-t border-gray-100">
          <button
            onClick={async () => {
              setGuardandoPromos(true);
              setMsgPromos("");
              try {
                const res = await fetch("/api/admin/promos", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(promos),
                });
                const data = await res.json();
                if (data.ok) {
                  setMsgPromos("✅ Guardado correctamente");
                  setTimeout(() => setMsgPromos(""), 3000);
                }
              } catch (e) {
                setMsgPromos("❌ Error al guardar");
              } finally {
                setGuardandoPromos(false);
              }
            }}
            disabled={guardandoPromos}
            className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-black py-3.5 rounded-2xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-red-100"
          >
            {guardandoPromos ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
                  <path d="M12 2a10 10 0 0110 10" strokeLinecap="round"/>
                </svg>
                Guardando...
              </>
            ) : "💾 Guardar cambios en el modal"}
          </button>
        </div>
      </div>
    )}
  </div>
)}


            {tab === "taller" && (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

    {/* Header con stats */}
    <div className="px-4 sm:px-5 py-4 border-b border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="font-black text-zinc-900 text-lg">🔧 Control de Taller</h2>
          <p className="text-gray-400 text-xs mt-0.5">Verificación de motores importados</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-center flex-1 sm:flex-none">
            <p className="text-red-600 font-black text-xl">
              {productos.filter(p => p.categoria_id === "motores" && !p.motor_encendido && p.activo).length}
            </p>
            <p className="text-red-500 text-xs">Por verificar</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-center flex-1 sm:flex-none">
            <p className="text-green-600 font-black text-xl">
              {productos.filter(p => p.categoria_id === "motores" && p.motor_encendido).length}
            </p>
            <p className="text-green-500 text-xs">Verificados</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-center flex-1 sm:flex-none">
            <p className="text-blue-600 font-black text-xl">
              {productos.filter(p => p.categoria_id === "motores").length}
            </p>
            <p className="text-blue-500 text-xs">Total</p>
          </div>
        </div>
      </div>

      {/* Buscador */}
      <div className="relative mb-3">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          value={busquedaTaller}
          onChange={(e) => setBusquedaTaller(e.target.value)}
          placeholder="Buscar motor por nombre, SKU, marca, modelo..."
          className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-400 transition"
        />
        {busquedaTaller && (
          <button
            onClick={() => setBusquedaTaller("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "pendiente", label: "⚠️ Por verificar", count: productos.filter(p => p.categoria_id === "motores" && !p.motor_encendido && p.activo).length },
          { id: "verificado", label: "✅ Verificados", count: productos.filter(p => p.categoria_id === "motores" && p.motor_encendido).length },
          { id: "todos", label: "📦 Todos", count: productos.filter(p => p.categoria_id === "motores").length },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFiltroTaller(f.id)}
            className={"flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all " +
              (filtroTaller === f.id
                ? f.id === "pendiente" ? "border-red-400 bg-red-50 text-red-700"
                  : f.id === "verificado" ? "border-green-400 bg-green-50 text-green-700"
                  : "border-zinc-400 bg-zinc-100 text-zinc-700"
                : "border-gray-200 text-gray-400 hover:border-gray-300")}
          >
            {f.label}
            <span className={"px-1.5 py-0.5 rounded-full text-xs font-black " +
              (filtroTaller === f.id ? "bg-white/60" : "bg-gray-100")}>
              {f.count}
            </span>
          </button>
        ))}

        {/* Filtro por marca */}
        <select
          value={marcaTaller}
          onChange={(e) => setMarcaTaller(e.target.value)}
          className={"px-3 py-1.5 rounded-full text-xs font-medium border-2 outline-none transition cursor-pointer " +
            (marcaTaller ? "border-red-300 bg-red-50 text-red-700" : "border-gray-200 text-gray-500")}
        >
          <option value="">Todas las marcas</option>
          {marcas.map((m) => (
            <option key={m.id} value={m.id}>{m.nombre}</option>
          ))}
        </select>

        {/* Filtro por modelo */}
        {marcaTaller && (
          <select
            value={modeloTaller}
            onChange={(e) => setModeloTaller(e.target.value)}
            className={"px-3 py-1.5 rounded-full text-xs font-medium border-2 outline-none transition cursor-pointer " +
              (modeloTaller ? "border-red-300 bg-red-50 text-red-700" : "border-gray-200 text-gray-500")}
          >
            <option value="">Todos los modelos</option>
            {marcas.find(m => m.id === marcaTaller)?.modelos?.map((mod) => (
              <option key={mod.id} value={mod.id}>{mod.nombre}</option>
            ))}
          </select>
        )}

        {/* Limpiar filtros */}
        {(busquedaTaller || marcaTaller || modeloTaller) && (
          <button
            onClick={() => { setBusquedaTaller(""); setMarcaTaller(""); setModeloTaller(""); }}
            className="px-3 py-1.5 rounded-full text-xs font-bold border-2 border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 transition"
          >
            ✕ Limpiar
          </button>
        )}
      </div>
    </div>

    {/* Lista de motores */}
    <div className="divide-y divide-gray-50">
      {(() => {
        const motoresFiltrados = productos.filter(p => {
          if (p.categoria_id !== "motores") return false;
          if (filtroTaller === "pendiente") { if (p.motor_encendido || !p.activo) return false; }
          if (filtroTaller === "verificado") { if (!p.motor_encendido) return false; }
          if (marcaTaller && p.marca_id !== marcaTaller) return false;
          if (modeloTaller && p.modelo_id !== modeloTaller) return false;
          if (busquedaTaller) {
            const q = busquedaTaller.toLowerCase();
            return (
              p.nombre?.toLowerCase().includes(q) ||
              p.sku?.toLowerCase().includes(q) ||
              p.codigo?.toLowerCase().includes(q) ||
              p.marca_id?.toLowerCase().includes(q) ||
              p.modelo_id?.toLowerCase().includes(q) ||
              p.numero_motor?.toLowerCase().includes(q)
            );
          }
          return true;
        });

        if (motoresFiltrados.length === 0) return (
          <div className="py-16 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⚙️</span>
            </div>
            <p className="text-gray-500 font-semibold text-sm">Sin motores encontrados</p>
            <p className="text-gray-400 text-xs mt-1">Prueba cambiando los filtros</p>
          </div>
        );

        return motoresFiltrados.map(p => (
          <div key={p.id} className="px-4 sm:px-5 py-4 hover:bg-gray-50 transition">
            <div className="flex items-start gap-3">

              {/* Foto */}
              <div className="w-14 h-12 sm:w-16 sm:h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                {p.imagenes?.[0] ? (
                  <img src={p.imagenes[0]} alt={p.nombre}
                    className="w-full h-full object-contain p-1" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">⚙️</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-black text-zinc-900 text-sm leading-tight truncate">
                      {p.nombre}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {p.sku}
                      {p.numero_motor && <span className="ml-2 text-blue-500">N°: {p.numero_motor}</span>}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                        {p.marca_id}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                        {p.modelo_id}
                      </span>
                      {p.tipo_caja && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                          {p.tipo_caja}
                        </span>
                      )}
                      {p.traccion && (
                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                          {p.traccion}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Botón verificar */}
                  <button
                    onClick={() => {
                      setModalProducto(p);
                      setTab("productos");
                    }}
                    className={"flex-shrink-0 text-xs font-black px-3 py-2 rounded-xl transition flex items-center gap-1.5 " +
                      (p.motor_encendido
                        ? "bg-gray-100 hover:bg-gray-200 text-gray-600"
                        : "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-200")}
                  >
                    {p.motor_encendido ? "✏️ Editar" : "⚡ Verificar"}
                  </button>
                </div>

                {/* Estado verificación */}
                <div className="mt-2">
                  {p.motor_encendido ? (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        ✅ Verificado
                        {p.fecha_encendido && " · " + new Date(p.fecha_encendido).toLocaleDateString("es-PE")}
                      </span>
                      {p.compresion && (
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                          📊 {p.compresion}
                        </span>
                      )}
                      {p.tecnico_taller && (
                        <span className="text-gray-400 text-xs">
                          👤 {p.tecnico_taller}
                        </span>
                      )}
                      {p.video_youtube && (
                        <a href={p.video_youtube} target="_blank" rel="noopener noreferrer"
                          className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 hover:bg-red-200 transition">
                          ▶ Video
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        ⚠️ Pendiente de verificar
                      </span>
                      {p.fecha_encendido === "" && (
                        <span className="text-gray-400 text-xs">Sin fecha asignada</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ));
      })()}
    </div>
  </div>
)}
            

          </main>
        </div>
      </div>

      {/* Modal editar/crear */}
      {(modalProducto || modalNuevo) && (
        <ProductoFormModal
          producto={modalNuevo ? null : modalProducto}
          marcas={marcas}
          categorias={categorias}
          onClose={() => { setModalProducto(null); setModalNuevo(false); }}
          onGuardar={handleGuardar}
        />
      )}

      {/* Modal confirmar eliminar */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setConfirmDelete(null)}
        >
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-red-500">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
              </svg>
            </div>
            <h3 className="text-zinc-900 font-black text-lg text-center mb-1">¿Eliminar producto?</h3>
            <p className="text-gray-500 text-sm text-center mb-5">{confirmDelete.nombre}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleEliminar(confirmDelete.id)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold transition"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}