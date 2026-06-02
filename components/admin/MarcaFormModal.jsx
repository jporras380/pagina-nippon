"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ImageUploader from "./ImageUploader";

export default function MarcaFormModal({ onClose, onGuardar }) {
  const [tab, setTab] = useState("marca");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [formMarca, setFormMarca] = useState({
    id: "",
    nombre: "",
    logo: "",
    imagen_hero: "",
    descripcion: "",
  });

  const [formModelo, setFormModelo] = useState({
    id: "",
    nombre: "",
    chasis: "",
    anio: "",
    imagen: "",
    variantes: [],
  });

  const [variantes, setVariantes] = useState([
    { id: "", label: "", anio: "", chasis: "" }
  ]);

  const setM = (k, v) => setFormMarca((f) => ({ ...f, [k]: v }));
  const setMod = (k, v) => setFormModelo((f) => ({ ...f, [k]: v }));

  const generarId = (nombre) =>
    nombre.toLowerCase().normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const handleGuardar = async () => {
    if (!formMarca.nombre.trim()) { setError("El nombre de la marca es obligatorio"); return; }
    if (!formMarca.id.trim()) { setError("El ID de la marca es obligatorio"); return; }

    setGuardando(true);
    setError("");

    try {
      // Preparar modelos con variantes
      const modeloFinal = formModelo.nombre ? {
        ...formModelo,
        id: formModelo.id || generarId(formModelo.nombre),
        imagenes: formModelo.imagen ? [formModelo.imagen] : [],
        unidades: [],
        activo: true,
        variantes: variantes.filter((v) => v.label && v.chasis),
      } : null;

      const payload = {
        ...formMarca,
        modelos: modeloFinal ? [modeloFinal] : [],
      };

      const res = await fetch("/api/admin/marcas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      onGuardar(data.marca);
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
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
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-zinc-900 font-black text-lg">🚗 Nueva Marca</h2>
            <button onClick={onClose} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 px-6">
            {[
              { id: "marca", label: "🏷️ Datos de la marca" },
              { id: "modelo", label: "🚙 Primer modelo (opcional)" },
            ].map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={"px-4 py-3 text-sm font-semibold border-b-2 transition-colors " +
                  (tab === t.id ? "border-red-500 text-red-600" : "border-transparent text-gray-400 hover:text-gray-600")}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Contenido */}
          <div className="flex-1 overflow-y-auto px-6 py-5">

            {tab === "marca" && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Nombre *</label>
                    <input
                      value={formMarca.nombre}
                      onChange={(e) => {
                        setM("nombre", e.target.value);
                        setM("id", generarId(e.target.value));
                      }}
                      placeholder="Ej: Toyota"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>ID único *</label>
                    <input
                      value={formMarca.id}
                      onChange={(e) => setM("id", generarId(e.target.value))}
                      placeholder="Se genera automático"
                      className={inputClass + " font-mono text-xs"}
                    />
                    <p className="text-gray-400 text-xs mt-0.5">Se usa en la URL: /marcas/{formMarca.id || "..."}</p>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Descripción</label>
                  <textarea
                    value={formMarca.descripcion}
                    onChange={(e) => setM("descripcion", e.target.value)}
                    rows={2}
                    placeholder="Breve descripción de la marca"
                    className={inputClass + " resize-none"}
                  />
                </div>

                <div>
                  <label className={labelClass}>Logo de la marca</label>
                  <ImageUploader
                    carpeta="logos"
                    onSubida={(ruta) => setM("logo", ruta)}
                  />
                  {formMarca.logo && (
                    <div className="mt-2 flex items-center gap-2 bg-gray-50 rounded-xl p-2 border border-gray-200">
                      <img src={formMarca.logo} alt="Logo" className="w-10 h-10 object-contain bg-white rounded-lg p-1 border border-gray-200" />
                      <p className="text-gray-500 text-xs font-mono">{formMarca.logo}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Imagen hero (fondo de la página de la marca)</label>
                  <ImageUploader
                    carpeta="vehiculos"
                    onSubida={(ruta) => setM("imagen_hero", ruta)}
                  />
                  {formMarca.imagen_hero && (
                    <div className="mt-2 bg-gray-50 rounded-xl overflow-hidden border border-gray-200 h-24">
                      <img src={formMarca.imagen_hero} alt="Hero" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === "modelo" && (
              <div className="flex flex-col gap-4">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3">
                  <p className="text-blue-600 text-xs">
                    💡 Puedes agregar el primer modelo ahora o hacerlo después desde la tabla de marcas.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Nombre del modelo</label>
                    <input
                      value={formModelo.nombre}
                      onChange={(e) => {
                        setMod("nombre", e.target.value);
                        setMod("id", generarId(e.target.value));
                      }}
                      placeholder="Ej: Probox"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>ID del modelo</label>
                    <input
                      value={formModelo.id}
                      onChange={(e) => setMod("id", generarId(e.target.value))}
                      placeholder="Auto-generado"
                      className={inputClass + " font-mono text-xs"}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Imagen del vehículo</label>
                  <ImageUploader
                    carpeta="vehiculos"
                    onSubida={(ruta) => setMod("imagen", ruta)}
                  />
                  {formModelo.imagen && (
                    <div className="mt-2 bg-gray-50 rounded-xl overflow-hidden border border-gray-200 h-24">
                      <img src={formModelo.imagen} alt="Vehículo" className="w-full h-full object-contain p-2" />
                    </div>
                  )}
                </div>

                {/* Variantes */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={labelClass}>Variantes por año / chasis</label>
                    <button
                      onClick={() => setVariantes([...variantes, { id: "", label: "", anio: "", chasis: "" }])}
                      className="text-red-500 hover:text-red-600 text-xs font-bold transition"
                    >
                      + Agregar variante
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {variantes.map((v, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">Etiqueta</label>
                            <input
                              value={v.label}
                              onChange={(e) => {
                                const n = [...variantes];
                                n[i] = { ...n[i], label: e.target.value, id: generarId(e.target.value) };
                                setVariantes(n);
                              }}
                              placeholder="Ej: Probox NCP51 (2002–2014)"
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">Chasis</label>
                            <input
                              value={v.chasis}
                              onChange={(e) => {
                                const n = [...variantes];
                                n[i] = { ...n[i], chasis: e.target.value };
                                setVariantes(n);
                              }}
                              placeholder="Ej: NCP51/NCP55/NCP58"
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">Año</label>
                            <input
                              value={v.anio}
                              onChange={(e) => {
                                const n = [...variantes];
                                n[i] = { ...n[i], anio: e.target.value };
                                setVariantes(n);
                              }}
                              placeholder="Ej: 2002-2014"
                              className={inputClass}
                            />
                          </div>
                          <div className="flex items-end">
                            {variantes.length > 1 && (
                              <button
                                onClick={() => setVariantes(variantes.filter((_, j) => j !== i))}
                                className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold rounded-xl transition"
                              >
                                Eliminar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            {error
              ? <p className="text-red-500 text-xs font-semibold">⚠️ {error}</p>
              : <div />
            }
            <div className="flex gap-2">
              <button onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm font-semibold transition">
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                disabled={guardando}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-sm transition flex items-center gap-2"
              >
                {guardando ? "Guardando..." : "✅ Crear marca"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}