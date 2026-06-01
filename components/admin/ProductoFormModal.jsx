"use client";
import ImageUploader from "./ImageUploader";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
const ESTADOS = ["disponible", "últimas unidades", "pre-venta", "agotado"];

const DURACIONES_OFERTA = [
  { label: "Sin oferta", dias: 0 },
  { label: "1 semana", dias: 7 },
  { label: "2 semanas", dias: 14 },
  { label: "1 mes", dias: 30 },
  { label: "3 meses", dias: 90 },
  { label: "Fecha personalizada", dias: -1 },
];

export default function ProductoFormModal({ producto, marcas, categorias, onClose, onGuardar }) {
  const esNuevo = !producto;
  
  const [form, setForm] = useState({
  id: producto?.id || "",
  activo: producto?.activo ?? true,
  nombre: producto?.nombre || "",
  marca_id: producto?.marca_id || "",
  modelo_id: producto?.modelo_id || "",
  categoria_id: producto?.categoria_id || "",
  descripcion: producto?.descripcion || "",
  detalle_condicion: producto?.detalle_condicion || "",
  codigo: producto?.codigo || "",
  sku: producto?.sku || "",
  precio_normal: producto?.precio_normal || "",
  precio_oferta: producto?.precio_oferta || "",
  oferta_hasta: producto?.oferta_hasta || "",
  mostrar_precio: producto?.mostrar_precio ?? true,
  estado: producto?.estado || "disponible",
  imagenes: producto?.imagenes?.join("\n") || "",
  whatsapp_mensaje: producto?.whatsapp_mensaje || "",
  // Variante y chasis
  variante_id: producto?.variante_id || "",
  chasis: producto?.chasis || "",
  // Motor
  numero_motor: producto?.numero_motor || "",
  serie_motor: producto?.serie_motor || "",
  codigo_computadora: producto?.codigo_computadora || "",
  tipo_caja: producto?.tipo_caja || "",
  traccion: producto?.traccion || "",
  cilindrada: producto?.cilindrada || "",
  combustible: producto?.combustible || "gasolinero",   // ← default
  posicion_motor: producto?.posicion_motor || "transversal", // ← default
  // Parte
  codigo_parte: producto?.codigo_parte || "",
  cantidad_unidades: producto?.cantidad_unidades || 1,
  // Internos
  dua: producto?.dua || "",
  proveedor: producto?.proveedor || "",
  num_contenedor: producto?.num_contenedor || "",
  codigo_barras: producto?.codigo_barras || "",
  unidad_id: producto?.unidad_id || null,
  motor_encendido: producto?.motor_encendido ?? false,
video_youtube: producto?.video_youtube || "",
compresion: producto?.compresion || "",
fecha_encendido: producto?.fecha_encendido || "",
tecnico_taller: producto?.tecnico_taller || "",
});
 
  const [categoriasLocales, setCategoriasLocales] = useState(categorias);
  const [editandoCat, setEditandoCat] = useState(null); // { id, nombre, icono }
  const [errorEditCat, setErrorEditCat] = useState("");
  const [duracionOferta, setDuracionOferta] = useState(0);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("basico");
  const [nuevaCat, setNuevaCat] = useState(false);
  const [nuevaCatNombre, setNuevaCatNombre] = useState("");
  const [nuevaCatIcono, setNuevaCatIcono] = useState("🔧");
  const [busquedaCat, setBusquedaCat] = useState("");
  const [errorCat, setErrorCat] = useState("");     
  // Modelos según marca
  const modelos = marcas.find((m) => m.id === form.marca_id)?.modelos || [];

  const modeloSeleccionado = useMemo(
  () => modelos.find((m) => m.id === form.modelo_id),
  [modelos, form.modelo_id]
);
  useEffect(() => {
  const onKey = (e) => {
    if (e.key === "Escape") confirmarCierre();
  };
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}, [form]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const aplicarDuracion = (dias) => {
    setDuracionOferta(dias);
    if (dias === 0) { set("oferta_hasta", ""); set("precio_oferta", ""); return; }
    if (dias === -1) return;
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);
    fecha.setHours(23, 59, 59, 0);
    set("oferta_hasta", fecha.toISOString().slice(0, 16));
  };

  const handleGuardar = async () => {
    if (!form.nombre.trim()) { setError("El nombre es obligatorio"); return; }
    if (!form.precio_normal) { setError("El precio normal es obligatorio"); return; }

    setGuardando(true);
    setError("");

    try {
      const payload = {
        ...form,
        imagenes: form.imagenes.split("\n").map((s) => s.trim()).filter(Boolean),
        whatsapp_mensaje: form.whatsapp_mensaje ||
          "Hola, consulto por " + form.nombre + (form.sku ? " (SKU: " + form.sku + ")" : ""),
      };

      const url = esNuevo
        ? "/api/admin/productos"
        : "/api/admin/productos/" + form.id;
      const method = esNuevo ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      onGuardar(data.producto);
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  };
  


// Auto-genera el nombre según categoría y campos
const generarNombre = () => {
  const marca = marcas.find((m) => m.id === form.marca_id)?.nombre || "";
  const modelo = modelos.find((m) => m.id === form.modelo_id)?.nombre || "";
  const chasis = form.chasis || "";
  const anio = form.anio || modeloSeleccionado?.anio || "";
  const categoriaNombre = categoriasLocales.find(
    (c) => c.id === form.categoria_id
  )?.nombre || form.categoria_id;
  // MOTOR
  if (form.categoria_id === "motores") {
    const partes = ["MOTOR"];
    if (form.numero_motor) partes.push(form.numero_motor.toUpperCase());
    if (form.tipo_caja) {
      const abrev = { "manual": "M/T", "automatico": "A/T", "cvt": "CVT" };
      partes.push("CON CAJA " + form.tipo_caja.toUpperCase() + "(" + (abrev[form.tipo_caja] || form.tipo_caja) + ")");
    }
    if (form.traccion) partes.push(form.traccion.toUpperCase());
    if (form.cilindrada) partes.push(form.cilindrada + "CC");
    if (form.combustible) partes.push(form.combustible.toUpperCase());
    if (marca) partes.push(marca.toUpperCase());
    if (modelo) partes.push(modelo.toUpperCase());
    if (chasis) partes.push(chasis);
    if (form.serie_motor) partes.push("SERIE: " + form.serie_motor.toUpperCase());
    partes.push("SEMINUEVO");
    return partes.join(" ").toUpperCase(); 
  }

  // CAJAS
  if (form.categoria_id === "cajas") {
    const partes = ["CAJA"];
    if (form.tipo_caja) {
      const abrev = { "manual": "MECÁNICA (M/T)", "automatico": "AUTOMÁTICA (A/T)", "cvt": "CVT" };
      partes.push(abrev[form.tipo_caja] || form.tipo_caja.toUpperCase());
    }
    if (form.traccion) partes.push(form.traccion.toUpperCase());
    if (marca) partes.push("DEL " + marca.toUpperCase());
    if (modelo) partes.push(modelo.toUpperCase());
    if (chasis) partes.push(chasis);
    if (anio) partes.push(anio);
    partes.push("SEMINUEVO");
    return partes.join(" ");
  }

  // BOBINAS / ELECTRÓNICA
  if (["bobinas", "electronica", "inyectores", "sensores", "alternadores"].includes(form.categoria_id)) {
    const nombreCat = {
      "bobinas": "BOBINA DE ENCENDIDO",
      "inyectores": "INYECTOR",
      "sensores": "SENSOR",
      "alternadores": "ALTERNADOR",
      "electronica": "COMPONENTE ELECTRÓNICO",
    };
    const partes = [nombreCat[form.categoria_id] || form.categoria_id.toUpperCase()];
    partes.push("DEL");
    if (marca) partes.push(marca.toUpperCase());
    if (modelo) partes.push(modelo.toUpperCase());
    if (form.codigo_parte) partes.push("CÓDIGO " + form.codigo_parte.toUpperCase());
    if (form.cantidad_unidades > 1) partes.push("(SET DE " + form.cantidad_unidades + ")");
    return partes.join(" ");
  }

  // CARROCERÍA (capot, puertas, guardafangos, etc.)
  const catNombres = {
    "capots": "CAPOT",
    "puertas": "PUERTA",
    "guardafangos": "GUARDAFANGO",
    "parachoques-delanteros": "PARACHOQUE DELANTERO",
    "parachoques-posteriores": "PARACHOQUE POSTERIOR",
    "faros-delanteros": "FARO DELANTERO",
    "faros-posteriores": "FARO POSTERIOR",
    "maleteras": "MALETERA",
    "compuertas": "COMPUERTA",
    "espejos-de-puertas": "ESPEJO DE PUERTA",
    "frentes-cortadas": "FRENTE CORTADA",
    "aros-de-llantas": "ARO DE LLANTA",
    "suspensiones": "AMORTIGUADOR",
    "ejes-posteriores": "EJE POSTERIOR",
    "tanques": "TANQUE",
    "tapas-de-aros": "TAPA DE ARO",
    "plasticos-de-guardafango": "PLÁSTICO DE GUARDAFANGO",
    "bombas-de-gasolina": "BOMBA DE GASOLINA",
    "bomba-de-freno": "BOMBA DE FRENO",
  };
  const partes = [catNombres[form.categoria_id] || categoriaNombre];
  partes.push("DEL");
  if (marca) partes.push(marca.toUpperCase());
  if (modelo) partes.push(modelo.toUpperCase());
  if (anio) partes.push(anio);
  if (chasis) partes.push("CHASIS " + chasis);
  if (form.codigo_parte) partes.push("CÓD: " + form.codigo_parte.toUpperCase());
  partes.push("SEMINUEVO");
  return partes.join(" ").toUpperCase(); // ← agrega .toUpperCase() aquí también
};
const hayDatos = form.nombre || form.marca_id || form.precio_normal ||
  form.motor_encendido || form.video_youtube || form.compresion;

const confirmarCierre = () => {
  if (hayDatos) {
    if (!window.confirm("¿Salir sin guardar? Se perderán los cambios.")) return;
  }
  onClose();
};



const generarIdCat = (nombre) =>
  nombre.toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const crearCategoria = async () => {
  if (!nuevaCatNombre.trim()) { setErrorCat("El nombre es obligatorio"); return; }

  const nuevoId = generarIdCat(nuevaCatNombre);

  const existe = categoriasLocales.find(
    (c) => c.id === nuevoId ||
    c.nombre.toLowerCase() === nuevaCatNombre.toLowerCase()
  );
  if (existe) {
    setErrorCat("Ya existe: " + existe.nombre);
    return;
  }

  try {
    const res = await fetch("/api/admin/catalogo");
    const data = await res.json();
    if (!data.ok) throw new Error("Error al leer catálogo");

    const nuevaCategoria = {
      id: nuevoId,
      nombre: nuevaCatNombre.trim().toUpperCase(),
      icono: nuevaCatIcono,
    };

    data.data.categorias_productos.push(nuevaCategoria);

    const saveRes = await fetch("/api/admin/catalogo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data.data),
    });
    const saveData = await saveRes.json();
    if (!saveData.ok) throw new Error("Error al guardar");

    // Actualiza estado local SIN recargar
    setCategoriasLocales((prev) => [...prev, nuevaCategoria]);
    set("categoria_id", nuevoId);
    setNuevaCat(false);
    setNuevaCatNombre("");
    setNuevaCatIcono("🔧");
    setErrorCat("");

  } catch (e) {
    setErrorCat(e.message);
  }
};


const editarCategoria = async () => {
  if (!editandoCat.nombre.trim()) { setErrorEditCat("El nombre es obligatorio"); return; }

  try {
    const res = await fetch("/api/admin/catalogo");
    const data = await res.json();
    if (!data.ok) throw new Error("Error al leer catálogo");

    // Actualiza la categoría en el JSON
    data.data.categorias_productos = data.data.categorias_productos.map((c) =>
      c.id === editandoCat.id
        ? { ...c, nombre: editandoCat.nombre.toUpperCase(), icono: editandoCat.icono }
        : c
    );

    const saveRes = await fetch("/api/admin/catalogo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data.data),
    });
    const saveData = await saveRes.json();
    if (!saveData.ok) throw new Error("Error al guardar");

    // Actualiza estado local sin recargar
    setCategoriasLocales((prev) =>
      prev.map((c) =>
        c.id === editandoCat.id
          ? { ...c, nombre: editandoCat.nombre.toUpperCase(), icono: editandoCat.icono }
          : c
      )
    );
    setEditandoCat(null);
    setErrorEditCat("");
  } catch (e) {
    setErrorEditCat(e.message);
  }
};
  const inputClass = "w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-zinc-900 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all";
  const labelClass = "block text-xs font-bold text-zinc-600 mb-1 uppercase tracking-wide";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.5)" }}
        onClick={(e) => e.target === e.currentTarget && confirmarCierre()}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-zinc-900 font-black text-lg">
                {esNuevo ? "➕ Nuevo Producto" : "✏️ Editar Producto"}
              </h2>
              {!esNuevo && <p className="text-gray-400 text-xs mt-0.5">{form.id}</p>}
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => set("activo", !form.activo)}
                  className={"w-11 h-6 rounded-full transition-colors duration-200 flex items-center " +
                    (form.activo ? "bg-green-500" : "bg-gray-300")}
                >
                  <div className={"w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 mx-0.5 " +
                    (form.activo ? "translate-x-5" : "translate-x-0")} />
                </div>
                <span className="text-xs font-semibold text-gray-600">
                  {form.activo ? "Activo" : "Inactivo"}
                </span>
              </label>
              <button onClick={confirmarCierre} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 px-6">
            {[
              { id: "basico", label: "📦 Básico" },
              { id: "precio", label: "💰 Precio y Oferta" },
              { id: "imagenes", label: "🖼️ Imágenes" },
              { id: "avanzado", label: "⚙️ Avanzado" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={"px-4 py-3 text-sm font-semibold border-b-2 transition-colors " +
                  (tab === t.id
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-400 hover:text-gray-600")}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Contenido scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-5">

            {/* Tab: Básico */}
            {tab === "basico" && (
              <div className="flex flex-col gap-4">
                <div>
  <label className={labelClass}>Nombre del producto *</label>
  <div className="flex gap-2">
    <input
  value={form.nombre}
  onChange={(e) => set("nombre", e.target.value.toUpperCase())}
  placeholder="Se Genera Automaticamente o Escrielo"
  className={inputClass + " flex-1"}
/>
    <button
      type="button"
      onClick={() => set("nombre", generarNombre())}
      title="Generar nombre automáticamente"
      className="flex-shrink-0 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold px-3 py-2.5 rounded-xl text-xs transition whitespace-nowrap"
    >
      ✨ Auto
    </button>
  </div>
  <p className="text-gray-400 text-xs mt-1">
    Llena marca, modelo, año y categoría → haz click en "✨ Auto" para generar
  </p>
</div>

                {/* Marca */}
<div className="grid grid-cols-2 gap-3">
  <div>
    <label className={labelClass}>Marca</label>
    <select
      value={form.marca_id}
      onChange={(e) => {
        set("marca_id", e.target.value);
        set("modelo_id", "");
        set("variante_id", "");
        set("chasis", "");
      }}
      className={inputClass}
    >
      <option value="">Seleccionar marca</option>
      {marcas.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
    </select>
  </div>

  {/* Modelo */}
  <div>
    <label className={labelClass}>Modelo</label>
    <select
      value={form.modelo_id}
      onChange={(e) => {
        set("modelo_id", e.target.value);
        set("variante_id", "");
        set("chasis", "");
      }}
      className={inputClass}
      disabled={!form.marca_id}
    >
      <option value="">Seleccionar modelo</option>
      {modelos.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
    </select>
  </div>
</div>

{/* Variante año/chasis — aparece solo si el modelo tiene variantes */}
{modeloSeleccionado?.variantes?.length > 0 && (
  <div>
    <label className={labelClass}>Año / Versión</label>
    <select
      value={form.variante_id}
      onChange={(e) => {
        const variante = modeloSeleccionado.variantes.find((v) => v.id === e.target.value);
        set("variante_id", e.target.value);
        set("chasis", variante?.chasis || "");
      }}
      className={inputClass}
    >
      <option value="">Seleccionar año</option>
      {modeloSeleccionado.variantes.map((v) => (
        <option key={v.id} value={v.id}>{v.label}</option>
      ))}
    </select>
  </div>
)}

{/* Chasis — se llena automático o se puede editar */}
{(form.variante_id || form.chasis) && (
  <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 flex items-center gap-3">
    <span className="text-green-600 text-lg">✅</span>
    <div>
      <p className="text-green-700 text-xs font-bold uppercase tracking-wide">Chasis detectado</p>
      <p className="text-green-800 font-black text-sm">{form.chasis}</p>
    </div>
    <input
      value={form.chasis}
      onChange={(e) => set("chasis", e.target.value)}
      className="ml-auto bg-white border border-green-200 rounded-lg px-3 py-1.5 text-sm text-green-800 outline-none focus:border-green-400 font-mono"
      placeholder="Editar si es diferente"
    />
  </div>
)}

{/* Selector de unidad — aparece si el modelo tiene unidades */}
{modeloSeleccionado?.unidades?.length > 0 && (
  <div>
    <label className={labelClass}>
      ¿A qué unidad pertenece esta autoparte?
    </label>
    <p className="text-gray-400 text-xs mb-2">
      Esto determina qué autopartes aparecen cuando el cliente selecciona un color
    </p>
    <div className="flex flex-col gap-2">
      {/* Opción: todos los colores */}
      <button
        onClick={() => set("unidad_id", null)}
        className={"flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all " +
          (!form.unidad_id
            ? "border-red-500 bg-red-50"
            : "border-gray-200 hover:border-gray-300 bg-white")}
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 border border-gray-300 flex-shrink-0" />
        <div>
          <p className={"text-sm font-bold " + (!form.unidad_id ? "text-red-700" : "text-zinc-700")}>
            Todos los colores
          </p>
          <p className="text-xs text-gray-400">
            Aparece sin importar qué color seleccione el cliente
          </p>
        </div>
        {!form.unidad_id && (
          <svg className="ml-auto text-red-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
      </button>

      {/* Una opción por cada unidad/color */}
      {modeloSeleccionado.unidades.map((u) => (
        <button
          key={u.id}
          onClick={() => set("unidad_id", u.id)}
          className={"flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all " +
            (form.unidad_id === u.id
              ? "border-red-500 bg-red-50"
              : "border-gray-200 hover:border-gray-300 bg-white")}
        >
          <div
            className="w-6 h-6 rounded-full border-2 border-white shadow flex-shrink-0"
            style={{ backgroundColor: u.color_hex }}
          />
          <div className="flex-1">
            <p className={"text-sm font-bold " + (form.unidad_id === u.id ? "text-red-700" : "text-zinc-700")}>
              {u.color_nombre}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              {u.tipo_importacion && (
                <span className={"text-xs font-semibold px-1.5 py-0.5 rounded " +
                  (u.tipo_importacion === "cdk"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-green-100 text-green-700")}>
                  {u.tipo_importacion === "cdk" ? "CDK" : "COMPLETO"}
                </span>
              )}
              {u.nota && <span className="text-xs text-gray-400">{u.nota}</span>}
            </div>
          </div>
          {form.unidad_id === u.id && (
            <svg className="text-red-500 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </button>
      ))}
    </div>

    {/* Resumen de lo seleccionado */}
    {form.unidad_id && (
      <div className="mt-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-blue-500">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p className="text-blue-600 text-xs">
          Esta autoparte <strong>solo aparecerá</strong> cuando el cliente seleccione el color{" "}
          <strong>{modeloSeleccionado.unidades.find(u => u.id === form.unidad_id)?.color_nombre}</strong>
        </p>
      </div>
    )}
  </div>
)}

                {/* Categoría */}
<div>
  <label className={labelClass}>Categoría</label>

  {!nuevaCat ? (
    <div className="flex flex-col gap-2">
      {/* Buscador de categoría */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          value={busquedaCat}
          onChange={(e) => setBusquedaCat(e.target.value)}
          placeholder="Buscar categoría..."
          className={inputClass + " pl-9"}
        />
      </div>

      {/* Lista de categorías filtradas */}
      <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-xl bg-gray-50">
  {categoriasLocales
    .filter((c) =>
      !busquedaCat ||
      c.nombre.toLowerCase().includes(busquedaCat.toLowerCase()) ||
      c.id.includes(busquedaCat.toLowerCase())
    )
    .map((c) => (
      <div
        key={c.id}
        className={"flex items-center group transition " +
          (form.categoria_id === c.id
            ? "bg-white border-l-2 border-red-500"
            : "hover:bg-white")}
      >
        {/* Botón seleccionar */}
        <button
          type="button"
          onClick={() => { set("categoria_id", c.id); setBusquedaCat(""); }}
          className="flex items-center gap-2 px-3 py-2 text-sm text-left flex-1 min-w-0"
        >
          <span>{c.icono}</span>
          <span className={"flex-1 truncate " +
            (form.categoria_id === c.id ? "font-bold text-red-600" : "text-zinc-700")}>
            {c.nombre}
          </span>
          {form.categoria_id === c.id && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              className="text-red-500 flex-shrink-0">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </button>

        {/* Botón editar — aparece al hover */}
        <button
          type="button"
          onClick={() => setEditandoCat({ id: c.id, nombre: c.nombre, icono: c.icono })}
          className="opacity-0 group-hover:opacity-100 flex-shrink-0 px-2 py-2 text-gray-400 hover:text-blue-500 transition"
          title="Editar categoría"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
      </div>
    ))}

  {categoriasLocales.filter((c) =>
    !busquedaCat ||
    c.nombre.toLowerCase().includes(busquedaCat.toLowerCase())
  ).length === 0 && (
    <div className="px-3 py-4 text-center">
      <p className="text-gray-400 text-xs">No se encontró "{busquedaCat}"</p>
    </div>
  )}
</div>

      {/* Categoría seleccionada */}
      {form.categoria_id && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          <span>{categoriasLocales.find(c => c.id === form.categoria_id)?.icono}</span>
          <span className="text-red-700 font-bold text-sm flex-1">
            {categoriasLocales.find(c => c.id === form.categoria_id)?.nombre}
          </span>
          <button
            onClick={() => set("categoria_id", "")}
            className="text-red-400 hover:text-red-600 transition"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      )}

      {/* Botón crear nueva */}
      <button
        type="button"
        onClick={() => setNuevaCat(true)}
        className="flex items-center gap-2 text-red-500 hover:text-red-600 text-xs font-bold transition self-start"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Crear nueva categoría
      </button>
    </div>

  ) : (
    /* Formulario nueva categoría */
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col gap-3">
      <p className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
        ➕ Nueva categoría
      </p>

      <div className="flex gap-2">
        {/* Selector de ícono */}
        <select
          value={nuevaCatIcono}
          onChange={(e) => setNuevaCatIcono(e.target.value)}
          className="w-16 bg-white border border-gray-200 rounded-xl px-2 py-2.5 text-lg outline-none focus:border-red-400 transition text-center"
        >
          {["🔧","⚙️","🚗","💡","🛡️","🔩","📦","🪞","⛽","🔴","⭕","🔋","💉","📡","⚡","🪝","🧲","🔌"].map(e => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>

        <input
  value={nuevaCatNombre}
  onChange={(e) => {
    setNuevaCatNombre(e.target.value.toUpperCase());
    setErrorCat("");
  }}
  placeholder="EJ: PLÁSTICOS DE COMPUERTA"
  className={inputClass + " flex-1"}
  onKeyDown={(e) => e.key === "Enter" && crearCategoria()}
  autoFocus
/>
      </div>

      {/* Preview ID */}
      {nuevaCatNombre && (
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs">ID:</span>
          <code className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-lg text-zinc-600 font-mono">
            {generarIdCat(nuevaCatNombre)}
          </code>
          {/* Verifica duplicado en tiempo real */}
          {categoriasLocales.find(c =>
            c.id === generarIdCat(nuevaCatNombre) ||
            c.nombre.toLowerCase() === nuevaCatNombre.toLowerCase()
          ) ? (
            <span className="text-red-500 text-xs font-bold">⚠️ Ya existe</span>
          ) : (
            <span className="text-green-500 text-xs font-bold">✅ Disponible</span>
          )}
        </div>
      )}

      {errorCat && (
        <p className="text-red-500 text-xs font-semibold">⚠️ {errorCat}</p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { setNuevaCat(false); setNuevaCatNombre(""); setErrorCat(""); }}
          className="flex-1 py-2 border border-gray-200 rounded-xl text-gray-500 text-sm font-semibold hover:bg-white transition"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={crearCategoria}
          disabled={!nuevaCatNombre.trim() || !!categoriasLocales.find(c =>
            c.id === generarIdCat(nuevaCatNombre) ||
            c.nombre.toLowerCase() === nuevaCatNombre.toLowerCase()
          )}
          className="flex-1 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition"
        >
          ✅ Crear categoría
        </button>
      </div>
    </div>
  )}

{/* Modal editar categoría */}
<AnimatePresence>
  {editandoCat && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={(e) => e.target === e.currentTarget && setEditandoCat(null)}
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-black text-zinc-900 text-sm">✏️ Editar categoría</h3>
          <button
            onClick={() => setEditandoCat(null)}
            className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-3">
          <div className="flex gap-2">
            <select
              value={editandoCat.icono}
              onChange={(e) => setEditandoCat(p => ({ ...p, icono: e.target.value }))}
              className="w-16 bg-gray-50 border border-gray-200 rounded-xl px-2 py-2.5 text-lg outline-none focus:border-red-400 transition text-center"
            >
              {["🔧","⚙️","🚗","💡","🛡️","🔩","📦","🪞","⛽","🔴","⭕","🔋","💉","📡","⚡","🪝","🧲","🔌","🚪","🪟","💨"].map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
            <input
              value={editandoCat.nombre}
              onChange={(e) => {
                setEditandoCat(p => ({ ...p, nombre: e.target.value.toUpperCase() }));
                setErrorEditCat("");
              }}
              className={inputClass + " flex-1"}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && editarCategoria()}
            />
          </div>

          <div className="bg-gray-50 rounded-xl px-3 py-2 flex items-center gap-2">
            <span className="text-gray-400 text-xs">ID:</span>
            <code className="text-xs text-zinc-600 font-mono">{editandoCat.id}</code>
            <span className="text-gray-400 text-xs ml-auto">No cambia</span>
          </div>

          {errorEditCat && (
            <p className="text-red-500 text-xs font-semibold">⚠️ {errorEditCat}</p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setEditandoCat(null); setErrorEditCat(""); }}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-500 text-sm font-semibold hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={editarCategoria}
              disabled={!editandoCat.nombre.trim()}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold rounded-xl text-sm transition"
            >
              💾 Guardar
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


</div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Código</label>
                    <input value={form.codigo} onChange={(e) => set("codigo", e.target.value)}
                      placeholder="Ej: 1415" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>SKU</label>
                    <input value={form.sku} onChange={(e) => set("sku", e.target.value)}
                      placeholder="Ej: MOT-TOY-PRX-1NZ" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Estado</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ESTADOS.map((e) => (
                      <button
                        key={e}
                        onClick={() => set("estado", e)}
                        className={"px-3 py-2 rounded-xl text-xs font-semibold border-2 transition-all text-center " +
                          (form.estado === e
                            ? "border-red-500 bg-red-50 text-red-700"
                            : "border-gray-200 text-gray-500 hover:border-gray-300")}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
{/* Cantidad de unidades */}
<div className="grid grid-cols-2 gap-3">
  <div>
    <label className={labelClass}>Cantidad de unidades</label>
    <input
      type="number"
      min="1"
      value={form.cantidad_unidades}
      onChange={(e) => set("cantidad_unidades", Number(e.target.value))}
      className={inputClass}
    />
    <p className="text-gray-400 text-xs mt-1">
      Ej: 4 bobinas = 1 set de 4
    </p>
  </div>
  <div>
    <label className={labelClass}>Código de parte / Referencia OEM</label>
    <input
      value={form.codigo_parte}
      onChange={(e) => set("codigo_parte", e.target.value)}
      placeholder="Ej: 45268-12856"
      className={inputClass}
    />
    <p className="text-gray-400 text-xs mt-1">
      Código OEM del fabricante
    </p>
  </div>
</div>
                <div>
                  <label className={labelClass}>Descripción corta</label>
                  <textarea value={form.descripcion} onChange={(e) => set("descripcion", e.target.value)}
                    rows={2} placeholder="Descripción breve del producto..."
                    className={inputClass + " resize-none"} />
                </div>

                <div>
                  <label className={labelClass}>Condición del producto</label>
                  <textarea value={form.detalle_condicion} onChange={(e) => set("detalle_condicion", e.target.value)}
                    rows={3} placeholder="Ej: Seminuevo en excelente estado. Sin golpes ni fisuras. Compresión verificada en taller."
                    className={inputClass + " resize-none"} />
                  <p className="text-gray-400 text-xs mt-1">
                    Esto aparece como "Condición del producto" en el detalle. Lo ve el cliente.
                  </p>
                </div>
              </div>
            )}

            {/* Tab: Precio y Oferta */}
            {tab === "precio" && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div
                    onClick={() => set("mostrar_precio", !form.mostrar_precio)}
                    className={"w-11 h-6 rounded-full transition-colors duration-200 flex items-center cursor-pointer " +
                      (form.mostrar_precio ? "bg-green-500" : "bg-gray-300")}
                  >
                    <div className={"w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 mx-0.5 " +
                      (form.mostrar_precio ? "translate-x-5" : "translate-x-0")} />
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900 text-sm">Mostrar precio</p>
                    <p className="text-gray-400 text-xs">
                      {form.mostrar_precio ? "El precio es visible para el cliente" : 'Aparece "Consultar precio"'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Precio normal (S/) *</label>
                    <input
                      type="number" min="0" step="0.01"
                      value={form.precio_normal}
                      onChange={(e) => set("precio_normal", e.target.value)}
                      placeholder="0.00"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Precio de oferta (S/)</label>
                    <input
                      type="number" min="0" step="0.01"
                      value={form.precio_oferta}
                      onChange={(e) => set("precio_oferta", e.target.value)}
                      placeholder="Dejar vacío si no hay oferta"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Preview precio */}
                {form.precio_normal > 0 && (
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-xs text-gray-500 mb-2 font-semibold">Vista previa del precio:</p>
                    {form.precio_oferta && Number(form.precio_oferta) > 0 ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-red-600">S/ {Number(form.precio_oferta).toLocaleString()}</span>
                        <span className="text-gray-400 line-through text-sm">S/ {Number(form.precio_normal).toLocaleString()}</span>
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                          -{Math.round((1 - form.precio_oferta / form.precio_normal) * 100)}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-black text-zinc-900">S/ {Number(form.precio_normal).toLocaleString()}</span>
                    )}
                  </div>
                )}

                {/* Duración de la oferta */}
                {form.precio_oferta && (
                  <div>
                    <label className={labelClass}>Duración de la oferta</label>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {DURACIONES_OFERTA.map((d) => (
                        <button
                          key={d.dias}
                          onClick={() => aplicarDuracion(d.dias)}
                          className={"px-3 py-2 rounded-xl text-xs font-semibold border-2 transition-all " +
                            (duracionOferta === d.dias
                              ? "border-red-500 bg-red-50 text-red-700"
                              : "border-gray-200 text-gray-500 hover:border-gray-300")}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className={labelClass}>Fecha fin de oferta</label>
                      <input
                        type="datetime-local"
                        value={form.oferta_hasta ? form.oferta_hasta.slice(0, 16) : ""}
                        onChange={(e) => { set("oferta_hasta", e.target.value); setDuracionOferta(-1); }}
                        className={inputClass}
                        min={new Date().toISOString().slice(0, 16)}
                      />
                      {form.oferta_hasta && (
                        <p className="text-gray-400 text-xs mt-1">
                          La oferta termina el {new Date(form.oferta_hasta).toLocaleDateString("es-PE", {
                            weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Imágenes */}
            {tab === "imagenes" && (
  <div className="flex flex-col gap-4">

    {/* Uploader directo */}
    <div>
      <label className={labelClass}>Subir imágenes directamente</label>
      <ImageUploader
  carpeta={
    "productos/" +
    (form.categoria_id || "OTROS") + "/" +
    (form.marca_id
      ? form.marca_id.charAt(0).toUpperCase() + form.marca_id.slice(1)
      : "General") + "/" +
    (form.modelo_id
      ? form.modelo_id.charAt(0).toUpperCase() + form.modelo_id.slice(1)
      : "")
  }
  onSubida={(ruta) => {
    const actuales = form.imagenes ? form.imagenes.split("\n").filter((s) => s.trim()) : [];
    set("imagenes", [...actuales, ruta].join("\n"));
  }}
/>
    </div>

    <div className="flex items-center gap-2">
      <div className="flex-1 h-px bg-gray-100" />
      <span className="text-gray-400 text-xs">o escribe la ruta manualmente</span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>

    <div>
      <label className={labelClass}>Rutas de imágenes (una por línea)</label>
      <textarea
        value={form.imagenes}
        onChange={(e) => set("imagenes", e.target.value)}
        rows={4}
        placeholder="/productos/motores/Toyota/Probox/1nz/automatico/4x2/01-1415.png"
        className={inputClass + " resize-none font-mono text-xs"}
      />
      <p className="text-gray-400 text-xs mt-1">
        {form.imagenes.split("\n").filter((s) => s.trim()).length} imagen(es)
      </p>
    </div>

    {/* Preview */}
    {form.imagenes.split("\n").filter((s) => s.trim()).length > 0 && (
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Vista previa</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {form.imagenes.split("\n").filter((s) => s.trim()).map((src, i) => (
            <div key={i} className="relative group">
              <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                <img
                  src={src.trim()}
                  alt={"Preview " + (i + 1)}
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    e.target.parentElement.classList.add("bg-red-50");
                    e.target.style.display = "none";
                  }}
                />
              </div>
              {/* Botón eliminar */}
              <button
                onClick={() => {
                  const lineas = form.imagenes.split("\n").filter((s) => s.trim());
                  lineas.splice(i, 1);
                  set("imagenes", lineas.join("\n"));
                }}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs hidden group-hover:flex items-center justify-center"
              >
                ×
              </button>
              <p className="text-gray-400 text-xs mt-1 truncate">{src.trim().split("/").pop()}</p>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)}
{/* tab Avanzado Campos específicos de motor */}
{form.categoria_id === "motores" || form.categoria_id === "cajas" ? (
  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
    <p className="text-amber-700 text-xs font-bold uppercase tracking-wide mb-3">
      ⚙️ Datos técnicos
    </p>
    <div className="grid grid-cols-2 gap-3">

      {/* Tipo de caja */}
      <div>
        <label className={labelClass}>Tipo de caja</label>
        <select value={form.tipo_caja} onChange={(e) => set("tipo_caja", e.target.value)} className={inputClass}>
          <option value="">Seleccionar</option>
          <option value="manual">Manual (M/T)</option>
          <option value="automatico">Automático (A/T)</option>
          <option value="cvt">CVT</option>
        </select>
      </div>

      {/* Tracción */}
      <div>
        <label className={labelClass}>Tracción</label>
        <select value={form.traccion} onChange={(e) => set("traccion", e.target.value)} className={inputClass}>
          <option value="">Seleccionar</option>
          <option value="4x2">4x2</option>
          <option value="4x4">4x4</option>
        </select>
      </div>

      {/* Solo para motores */}
      {form.categoria_id === "motores" && (
        <>
          <div>
            <label className={labelClass}>N° de motor (único)</label>
            <input
              value={form.numero_motor}
              onChange={(e) => set("numero_motor", e.target.value)}
              placeholder="Ej: 1NZ-FE"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Serie del motor</label>
            <input
              value={form.serie_motor}
              onChange={(e) => set("serie_motor", e.target.value)}
              placeholder="Ej: 546125"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Cilindrada (cc)</label>
            <input
              type="number"
              value={form.cilindrada}
              onChange={(e) => set("cilindrada", e.target.value)}
              placeholder="Ej: 1500"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Combustible</label>
            <select value={form.combustible} onChange={(e) => set("combustible", e.target.value)} className={inputClass}>
              <option value="">Seleccionar</option>
              <option value="gasolinero">Gasolinero</option>
              <option value="petrolero">Petrolero</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Posición</label>
            <select value={form.posicion_motor} onChange={(e) => set("posicion_motor", e.target.value)} className={inputClass}>
              <option value="">Seleccionar</option>
              <option value="lineal">Lineal</option>
              <option value="transversal">Transversal</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Código ECU / Computadora</label>
            <input
              value={form.codigo_computadora}
              onChange={(e) => set("codigo_computadora", e.target.value)}
              placeholder="Ej: 89661-52B60"
              className={inputClass}
            />
          </div>
        </>
      )}


      {form.categoria_id === "motores" && (
  <div className="border border-gray-200 rounded-2xl overflow-hidden mb-4">
    {/* Header */}
    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <span className="text-lg">🔧</span>
        <div>
          <p className="font-black text-zinc-900 text-sm">Verificación de taller</p>
          <p className="text-gray-400 text-xs">Control de encendido y compresión</p>
        </div>
      </div>
      {/* Toggle encendido */}
      <div
        onClick={() => set("motor_encendido", !form.motor_encendido)}
        className={"flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all border-2 " +
          (form.motor_encendido
            ? "bg-green-50 border-green-300"
            : "bg-red-50 border-red-200")}
      >
        <div className={"w-10 h-5 rounded-full flex items-center transition-colors " +
          (form.motor_encendido ? "bg-green-500" : "bg-red-400")}>
          <div className={"w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 " +
            (form.motor_encendido ? "translate-x-5" : "translate-x-0")} />
        </div>
        <span className={"text-xs font-black " +
          (form.motor_encendido ? "text-green-700" : "text-red-600")}>
          {form.motor_encendido ? "✅ Motor encendido" : "⚠️ Sin verificar"}
        </span>
      </div>
    </div>

    {/* Campos */}
    <div className="p-4 flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Compresión medida</label>
          <input
            value={form.compresion}
            onChange={(e) => set("compresion", e.target.value)}
            placeholder="Ej: 12.5 kg/cm² uniforme"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Fecha de encendido</label>
          <input
            type="date"
            value={form.fecha_encendido}
            onChange={(e) => set("fecha_encendido", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Técnico responsable</label>
        <input
          value={form.tecnico_taller}
          onChange={(e) => set("tecnico_taller", e.target.value)}
          placeholder="Nombre del técnico"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Video YouTube del encendido</label>
        <input
          value={form.video_youtube}
          onChange={(e) => set("video_youtube", e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className={inputClass}
        />
        {/* Preview miniatura */}
        {form.video_youtube && (() => {
          const match = form.video_youtube.match(/(?:v=|youtu\.be\/)([^&\s]+)/);
          const videoId = match?.[1];
          return videoId ? (
            <div className="mt-2 bg-black rounded-xl overflow-hidden aspect-video max-w-xs">
              <iframe
                src={"https://www.youtube.com/embed/" + videoId}
                className="w-full h-full"
                allowFullScreen
                title="Preview motor"
              />
            </div>
          ) : (
            <p className="text-red-400 text-xs mt-1">⚠️ URL de YouTube no válida</p>
          );
        })()}
      </div>
    </div>
  </div>
)}
    </div>
  </div>
) : null}

{/* Campos internos — NO se muestran en la web al cliente */}
<div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-4">
  <p className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-3">
    🔒 Datos internos (no visibles al cliente)
  </p>
  <div className="grid grid-cols-2 gap-3">
    <div>
      <label className={labelClass}>DUA / Documento aduanero</label>
      <input
        value={form.dua}
        onChange={(e) => set("dua", e.target.value)}
        placeholder="N° DUA"
        className={inputClass}
      />
    </div>
    <div>
      <label className={labelClass}>Proveedor</label>
      <input
        value={form.proveedor || ""}
        onChange={(e) => set("proveedor", e.target.value)}
        placeholder="Nombre del proveedor"
        className={inputClass}
      />
    </div>
    <div>
      <label className={labelClass}>N° Contenedor</label>
      <input
        value={form.num_contenedor || ""}
        onChange={(e) => set("num_contenedor", e.target.value)}
        placeholder="Ej: TCKU3456789"
        className={inputClass}
      />
    </div>
    <div>
      <label className={labelClass}>Código de barras</label>
      <input
        value={form.codigo_barras || ""}
        onChange={(e) => set("codigo_barras", e.target.value)}
        placeholder="EAN / SKU interno"
        className={inputClass}
      />
    </div>
  </div>
  <p className="text-gray-400 text-xs mt-2">
    💡 Estos campos se sincronizarán con Odoo cuando se integre
  </p>
</div>
            {/* Tab: Avanzado */}
            {tab === "avanzado" && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className={labelClass}>ID del producto</label>
                  <input
                    value={form.id}
                    onChange={(e) => set("id", e.target.value)}
                    placeholder="Se genera automáticamente si está vacío"
                    className={inputClass}
                    disabled={!esNuevo}
                  />
                  {!esNuevo && <p className="text-gray-400 text-xs mt-1">El ID no se puede cambiar después de creado</p>}
                </div>

                

                <div>
                  <label className={labelClass}>Mensaje de WhatsApp personalizado</label>
                  <textarea
                    value={form.whatsapp_mensaje}
                    onChange={(e) => set("whatsapp_mensaje", e.target.value)}
                    rows={3}
                    placeholder={"Hola, consulto por " + (form.nombre || "el producto")}
                    className={inputClass + " resize-none"}
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    Si está vacío se genera automáticamente con el nombre y SKU
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
            {error && (
              <p className="text-red-500 text-xs font-semibold flex items-center gap-1">
                <span>⚠️</span> {error}
              </p>
            )}
            {!error && <div />}
            <div className="flex gap-2">
              <button
                onClick={confirmarCierre}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm font-semibold transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                disabled={guardando}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-sm transition flex items-center gap-2"
              >
                {guardando ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
                      <path d="M12 2a10 10 0 0110 10" strokeLinecap="round"/>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>{esNuevo ? "✅ Crear producto" : "💾 Guardar cambios"}</>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}