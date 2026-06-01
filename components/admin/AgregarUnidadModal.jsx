"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ImageUploader from "./ImageUploader";

const TIPOS = [
  {
    id: "completo",
    emoji: "🚗",
    label: "Completo",
    desc: "Auto completo importado: motor, caja, carrocería, plásticos, etc.",
    incluye: ["Motor", "Caja de cambios", "Puertas", "Faros", "Capot", "Guardafangos",
              "Parachoques", "Compuerta", "Plásticos internos", "Tablero", "Asientos",
              "Espejos", "Tanque"],
    excluye: ["Chasis/bastidor (prohibido en Perú)"],
  },
  {
    id: "cdk",
    emoji: "🔧",
    label: "CDK",
    desc: "Carrocería con Kit — todo el auto EXCEPTO chasis y a veces el techo.",
    incluye: ["Puertas", "Faros", "Capot", "Guardafangos", "Parachoques",
              "Compuerta/Maletera", "Plásticos internos", "Tablero", "Asientos",
              "Espejos", "Parabrisas", "Motor (según caso)", "Caja (según caso)"],
    excluye: ["Chasis/bastidor metálico (PROHIBIDO en Perú)", "Techo (por costo/fragilidad)"],
  },
  {
    id: "solo-partes",
    emoji: "📦",
    label: "Solo partes",
    desc: "Autopartes específicas sin vehículo completo.",
    incluye: ["Solo las partes especificadas"],
    excluye: ["Todo lo demás"],
  },
];

export default function AgregarUnidadModal({ marca, modelo, onClose, onGuardar }) {
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    color_nombre: "",
    color_hex: "#FFFFFF",
    nota: "",
    tipo_importacion: "completo",
    incluye_techo: true,
    imagenes: [],
    estado_unidad: "disponible",
    contenedor: "",
    fecha_llegada: "",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const inputClass = "w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-zinc-900 outline-none focus:border-red-400 transition-all";
  const labelClass = "block text-xs font-bold text-zinc-600 mb-1 uppercase tracking-wide";

  const tipoActivo = TIPOS.find((t) => t.id === form.tipo_importacion);

  const handleGuardar = async () => {
    if (!form.color_nombre.trim()) { setError("El color es obligatorio"); return; }
    setGuardando(true);
    setError("");
    try {
      const nuevaUnidad = {
        id: modelo.id + "-" + form.color_nombre.toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "") + "-" + Date.now(),
        color_nombre: form.color_nombre,
        color_hex: form.color_hex,
        nota: form.nota,
        tipo_importacion: form.tipo_importacion,
        incluye_techo: form.tipo_importacion === "cdk" ? form.incluye_techo : true,
        imagenes: form.imagenes,
        estado_unidad: form.estado_unidad,
        contenedor: form.contenedor,
        fecha_llegada: form.fecha_llegada,
        fecha_registro: new Date().toISOString(),
      };

      const res = await fetch("/api/admin/marcas/" + marca.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agregar_unidad: true,
          modelo_id: modelo.id,
          unidad: nuevaUnidad,
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      onGuardar();
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.6)" }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
          className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-zinc-900 font-black text-lg">🚗 Nueva unidad importada</h2>
              <p className="text-gray-400 text-xs mt-0.5">
                {marca.nombre} · <span className="font-semibold text-zinc-600">{modelo.nombre}</span>
                {modelo.chasis && <span> · Chasis {modelo.chasis}</span>}
              </p>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

            {/* Tipo de importación */}
            <div>
              <label className={labelClass}>¿Qué se importó?</label>
              <div className="grid grid-cols-3 gap-2">
                {TIPOS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => set("tipo_importacion", t.id)}
                    className={"flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all text-center " +
                      (form.tipo_importacion === t.id
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300 bg-white")}
                  >
                    <span className="text-2xl">{t.emoji}</span>
                    <span className={"text-xs font-black " +
                      (form.tipo_importacion === t.id ? "text-red-700" : "text-zinc-700")}>
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Detalle del tipo seleccionado */}
              {tipoActivo && (
                <div className="mt-3 bg-gray-50 rounded-2xl p-3 border border-gray-100">
                  <p className="text-gray-600 text-xs mb-2">{tipoActivo.desc}</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                    {tipoActivo.incluye.slice(0, 6).map((item) => (
                      <p key={item} className="text-green-600 text-xs">✅ {item}</p>
                    ))}
                    {tipoActivo.excluye.map((item) => (
                      <p key={item} className="text-red-500 text-xs col-span-2">❌ {item}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Techo — solo en CDK */}
            {form.tipo_importacion === "cdk" && (
              <div
                onClick={() => set("incluye_techo", !form.incluye_techo)}
                className={"flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all " +
                  (form.incluye_techo ? "border-green-300 bg-green-50" : "border-gray-200 bg-gray-50")}
              >
                <div className={"w-11 h-6 rounded-full flex items-center transition-colors " +
                  (form.incluye_techo ? "bg-green-500" : "bg-gray-300")}>
                  <div className={"w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 " +
                    (form.incluye_techo ? "translate-x-5" : "translate-x-0")} />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-800">
                    {form.incluye_techo ? "✅ Incluye techo" : "❌ Sin techo"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {form.incluye_techo
                      ? "El techo llega con este lote"
                      : "No se importó el techo (costo/fragilidad)"}
                  </p>
                </div>
              </div>
            )}

            {/* Color */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Color del auto *</label>
                <input
                  value={form.color_nombre}
                  onChange={(e) => set("color_nombre", e.target.value)}
                  placeholder="Ej: Blanco, Negro, Plata"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Selecciona el tono</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={form.color_hex}
                    onChange={(e) => set("color_hex", e.target.value)}
                    className="w-12 h-10 rounded-xl border border-gray-200 cursor-pointer p-1 flex-shrink-0"
                  />
                  <input
                    value={form.color_hex}
                    onChange={(e) => set("color_hex", e.target.value)}
                    className={inputClass}
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
            </div>

            {/* Estado */}
            <div>
              <label className={labelClass}>Estado de la unidad</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "disponible", label: "Disponible", color: "green" },
                  { id: "proxima-descarga", label: "Próxima descarga", color: "blue" },
                  { id: "reservado", label: "Reservado", color: "amber" },
                ].map((e) => (
                  <button
                    key={e.id}
                    onClick={() => set("estado_unidad", e.id)}
                    className={"px-3 py-2 rounded-xl border-2 text-xs font-semibold transition-all " +
                      (form.estado_unidad === e.id
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-200 text-gray-500 hover:border-gray-300")}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Nota */}
            <div>
              <label className={labelClass}>Nota del auto</label>
              <input
                value={form.nota}
                onChange={(e) => set("nota", e.target.value)}
                placeholder="Ej: Motor 1NZ, A/T, 4x2 — bajo km"
                className={inputClass}
              />
            </div>

            {/* Datos del lote */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>N° Contenedor</label>
                <input
                  value={form.contenedor}
                  onChange={(e) => set("contenedor", e.target.value)}
                  placeholder="Ej: TCKU3456789"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Fecha llegada / estimada</label>
                <input
                  type="date"
                  value={form.fecha_llegada}
                  onChange={(e) => set("fecha_llegada", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Fotos del auto */}
            <div>
              <label className={labelClass}>
                Fotos del auto ({form.imagenes.length} subidas)
              </label>
              <ImageUploader
                carpeta={"vehiculos/" + marca.id + "/" + modelo.id}
                onSubida={(ruta) => set("imagenes", [...form.imagenes, ruta])}
              />
              {form.imagenes.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {form.imagenes.map((img, i) => (
                    <div key={i} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                        <img src={img} alt={"Foto " + (i+1)} className="w-full h-full object-contain p-1" />
                      </div>
                      <button
                        onClick={() => set("imagenes", form.imagenes.filter((_,j) => j !== i))}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs hidden group-hover:flex items-center justify-center"
                      >×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            {error
              ? <p className="text-red-500 text-xs font-semibold">⚠️ {error}</p>
              : <div />
            }
            <div className="flex gap-2">
              <button onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold transition">
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                disabled={guardando}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-sm transition"
              >
                {guardando ? "Guardando..." : "✅ Registrar unidad"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}