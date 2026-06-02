"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ImageUploader from "./ImageUploader";

export default function AgregarModeloModal({ marca, onClose, onGuardar }) {
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [variantes, setVariantes] = useState([
    { id: "", label: "", anio: "", chasis: "" }
  ]);
  const [form, setForm] = useState({
    id: "", nombre: "", chasis: "", anio: "", imagen: "",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const generarId = (nombre) =>
    nombre.toLowerCase().normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const inputClass = "w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-zinc-900 outline-none focus:border-red-400 transition-all";
  const labelClass = "block text-xs font-bold text-zinc-600 mb-1 uppercase tracking-wide";

  const handleVarianteAnio = (index, nuevoAnio) => {
    const n = [...variantes];
    n[index] = {
      ...n[index],
      anio: nuevoAnio,
      label: form.nombre + " (" + nuevoAnio + ")",
    };
    setVariantes(n);
    if (index === 0) set("anio", nuevoAnio);
  };

  const handleVarianteChasis = (index, nuevoChasis) => {
    const n = [...variantes];
    n[index] = { ...n[index], chasis: nuevoChasis };
    setVariantes(n);
    if (index === 0) set("chasis", nuevoChasis);
  };

  const handleVarianteLabel = (index, nuevoLabel) => {
    const n = [...variantes];
    n[index] = { ...n[index], label: nuevoLabel };
    setVariantes(n);
  };

  const handleGuardar = async () => {
    if (!form.nombre.trim()) { setError("El nombre es obligatorio"); return; }

    setGuardando(true);
    setError("");

    try {
      const modeloFinal = {
        id: form.id || generarId(form.nombre),
        nombre: form.nombre,
        chasis: form.chasis || variantes[0]?.chasis || "",
        anio: form.anio || variantes[0]?.anio || "",
        imagen: form.imagen || "",
        imagenes: form.imagen ? [form.imagen] : [],
        unidades: [],
        activo: true,
        variantes: variantes
          .filter((v) => v.anio || v.chasis)
          .map((v) => ({
            id: v.id || generarId(v.label || form.nombre + "-" + v.anio),
            label: v.label || form.nombre + " (" + v.anio + ")",
            anio: v.anio,
            chasis: v.chasis,
          })),
      };

      const res = await fetch("/api/admin/marcas/" + marca.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agregar_modelo: true, modelo: modeloFinal }),
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.5)" }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
          className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-zinc-900 font-black text-lg">+ Nuevo modelo</h2>
              <p className="text-gray-400 text-xs mt-0.5">Marca: {marca.nombre}</p>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Contenido */}
          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">

            {/* Nombre e ID */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Nombre *</label>
                <input
                  value={form.nombre}
                  onChange={(e) => {
                    set("nombre", e.target.value);
                    set("id", generarId(e.target.value));
                  }}
                  placeholder="Ej: Civic"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>ID</label>
                <input
                  value={form.id}
                  onChange={(e) => set("id", generarId(e.target.value))}
                  placeholder="Auto-generado"
                  className={inputClass + " font-mono text-xs"}
                />
              </div>
            </div>

            {/* Foto del vehículo */}
            <div>
              <label className={labelClass}>Foto del vehículo</label>
              <ImageUploader
                carpeta={"vehiculos/" + marca.id}
                onSubida={(ruta) => set("imagen", ruta)}
              />
              {form.imagen && (
                <div className="mt-2 bg-gray-50 rounded-xl h-24 overflow-hidden border border-gray-200">
                  <img src={form.imagen} alt="Vehículo"
                    className="w-full h-full object-contain p-2" />
                </div>
              )}
            </div>

            {/* Variantes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>Variantes año / chasis</label>
                <button
                  onClick={() => setVariantes([
                    ...variantes, { id: "", label: "", anio: "", chasis: "" }
                  ])}
                  className="text-red-500 text-xs font-bold hover:text-red-600 transition"
                >
                  + Agregar variante
                </button>
              </div>

              {variantes.map((v, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-200 mb-2">
                  <div className="grid grid-cols-2 gap-2">

                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Año</label>
                      <input
                        value={v.anio}
                        onChange={(e) => handleVarianteAnio(i, e.target.value)}
                        placeholder="Ej: 2004-2008"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Chasis</label>
                      <input
                        value={v.chasis}
                        onChange={(e) => handleVarianteChasis(i, e.target.value)}
                        placeholder="Ej: FD1/FD2/FD3"
                        className={inputClass}
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-xs text-gray-500 block mb-1">
                        Etiqueta (se genera automático)
                      </label>
                      <input
                        value={v.label}
                        onChange={(e) => handleVarianteLabel(i, e.target.value)}
                        placeholder="Ej: Civic FD1 (2004–2008)"
                        className={inputClass}
                      />
                      <p className="text-gray-400 text-xs mt-0.5">
                        Aparece en el selector de año del admin
                      </p>
                    </div>

                    {variantes.length > 1 && (
                      <div className="col-span-2">
                        <button
                          onClick={() => setVariantes(variantes.filter((_, j) => j !== i))}
                          className="w-full py-2 bg-red-50 text-red-500 text-xs font-bold rounded-xl hover:bg-red-100 transition"
                        >
                          Eliminar variante
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Preview chasis detectado */}
            {(form.chasis || form.anio) && (
              <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
                <p className="text-green-700 text-xs font-bold uppercase tracking-wide mb-1">
                  ✅ Datos del modelo
                </p>
                <p className="text-green-800 font-black text-sm">
                  {form.nombre}
                  {form.anio && " · " + form.anio}
                </p>
                {form.chasis && (
                  <p className="text-green-600 text-xs mt-0.5">
                    Chasis: {form.chasis}
                  </p>
                )}
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
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                disabled={guardando}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-sm transition"
              >
                {guardando ? "Guardando..." : "✅ Crear modelo"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}