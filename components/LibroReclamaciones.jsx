"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = ["Tipo", "Datos", "Reclamo", "Confirmación"];

const initialForm = {
  tipo: "",
  nombre: "",
  dni: "",
  email: "",
  telefono: "",
  direccion: "",
  tipo_bien: "producto",
  descripcion_bien: "",
  tipo_reclamo: "reclamo",
  detalle: "",
  pedido: "",
  acepta: false,
};

export default function LibroReclamaciones({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(0);
      setForm(initialForm);
      setEnviado(false);
    }, 300);
  };

  const handleEnviar = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setEnviado(true);
  };

  const canNext = () => {
    if (step === 0) return form.tipo !== "";
    if (step === 1) return form.nombre && form.dni && form.email && form.telefono;
    if (step === 2) return form.detalle.length > 20 && form.acepta;
    return true;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)" }}
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            initial={{ scale: 0.92, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-red-600 px-6 py-5 flex items-center justify-between">
              <div>
                <p className="text-red-200 text-xs uppercase tracking-widest mb-0.5">
                  NipponAutoparts S.R.L.
                </p>
                <h2 className="text-white font-black text-lg">
                  Libro de Reclamaciones
                </h2>
              </div>
              <button onClick={handleClose}
                className="text-red-200 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500 transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Stepper */}
            {!enviado && (
              <div className="flex items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex items-center flex-1 last:flex-none">
                    <div className="flex items-center gap-2">
                      <div className={
                        i < step
                          ? "w-7 h-7 rounded-full bg-green-500 flex items-center justify-center"
                          : i === step
                          ? "w-7 h-7 rounded-full bg-red-600 flex items-center justify-center"
                          : "w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center"
                      }>
                        {i < step
                          ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                          : <span className={i === step ? "text-white text-xs font-black" : "text-gray-400 text-xs font-bold"}>{i + 1}</span>
                        }
                      </div>
                      <span className={
                        i === step ? "text-xs font-bold text-zinc-800 hidden sm:block"
                        : "text-xs text-gray-400 hidden sm:block"
                      }>{s}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={
                        "flex-1 h-px mx-2 " + (i < step ? "bg-green-400" : "bg-gray-200")
                      } />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Contenido */}
            <div className="px-6 py-6 min-h-[280px]">
              <AnimatePresence mode="wait">

                {/* ENVIADO */}
                {enviado && (
                  <motion.div key="enviado"
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <h3 className="text-zinc-900 font-black text-xl mb-2">¡Reclamo registrado!</h3>
                    <p className="text-zinc-500 text-sm mb-2">Tu reclamo ha sido enviado correctamente.</p>
                    <p className="text-zinc-500 text-sm mb-6">Nos comunicaremos contigo en un plazo máximo de <strong>15 días hábiles</strong>.</p>
                    <div className="bg-gray-50 rounded-xl p-4 text-left w-full border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Número de referencia</p>
                      <p className="text-zinc-900 font-black text-lg">REC-{Date.now().toString().slice(-8)}</p>
                      <p className="text-xs text-gray-400 mt-1">Guarda este número para seguimiento</p>
                    </div>
                    <button onClick={handleClose}
                      className="mt-5 bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-2.5 rounded-full text-sm transition">
                      Cerrar
                    </button>
                  </motion.div>
                )}

                {/* STEP 0 — Tipo */}
                {!enviado && step === 0 && (
                  <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 className="text-zinc-900 font-black text-base mb-1">¿Qué deseas registrar?</h3>
                    <p className="text-zinc-500 text-xs mb-5">Conforme al Código de Protección al Consumidor (Ley 29571)</p>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { val: "queja", titulo: "Queja", desc: "Malestar o disgusto respecto a la atención recibida", color: "border-amber-400 bg-amber-50" },
                        { val: "reclamo", titulo: "Reclamo", desc: "Disconformidad con el producto o servicio recibido", color: "border-red-400 bg-red-50" },
                      ].map((op) => (
                        <button key={op.val} onClick={() => set("tipo", op.val)}
                          className={"w-full text-left border-2 rounded-xl p-4 transition-all duration-200 " +
                            (form.tipo === op.val ? op.color + " " : "border-gray-200 bg-white hover:border-gray-300")}>
                          <p className="font-bold text-zinc-900 text-sm">{op.titulo}</p>
                          <p className="text-zinc-500 text-xs mt-0.5">{op.desc}</p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* STEP 1 — Datos personales */}
                {!enviado && step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 className="text-zinc-900 font-black text-base mb-4">Tus datos personales</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="text-xs font-semibold text-zinc-600 mb-1 block">Nombre completo *</label>
                        <input value={form.nombre} onChange={(e) => set("nombre", e.target.value)}
                          placeholder="Ej: Juan Pérez López"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-red-400 transition bg-gray-50"/>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-zinc-600 mb-1 block">DNI *</label>
                        <input value={form.dni} onChange={(e) => set("dni", e.target.value)}
                          placeholder="12345678" maxLength={8}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-red-400 transition bg-gray-50"/>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-zinc-600 mb-1 block">Teléfono *</label>
                        <input value={form.telefono} onChange={(e) => set("telefono", e.target.value)}
                          placeholder="999 999 999"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-red-400 transition bg-gray-50"/>
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs font-semibold text-zinc-600 mb-1 block">Correo electrónico *</label>
                        <input value={form.email} onChange={(e) => set("email", e.target.value)}
                          type="email" placeholder="correo@ejemplo.com"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-red-400 transition bg-gray-50"/>
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs font-semibold text-zinc-600 mb-1 block">Dirección</label>
                        <input value={form.direccion} onChange={(e) => set("direccion", e.target.value)}
                          placeholder="Dirección (opcional)"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-red-400 transition bg-gray-50"/>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2 — Detalle del reclamo */}
                {!enviado && step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 className="text-zinc-900 font-black text-base mb-4">Detalle tu {form.tipo}</h3>
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="text-xs font-semibold text-zinc-600 mb-1 block">Tipo de bien</label>
                        <div className="flex gap-2">
                          {["producto", "servicio"].map((t) => (
                            <button key={t} onClick={() => set("tipo_bien", t)}
                              className={"flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition " +
                                (form.tipo_bien === t ? "border-red-500 bg-red-50 text-red-600" : "border-gray-200 text-zinc-500 hover:border-gray-300")}>
                              {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-zinc-600 mb-1 block">Bien contratado / producto</label>
                        <input value={form.descripcion_bien} onChange={(e) => set("descripcion_bien", e.target.value)}
                          placeholder="Ej: Motor 1NZ Toyota Probox"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-red-400 transition bg-gray-50"/>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-zinc-600 mb-1 block">
                          Detalle del {form.tipo} * <span className="text-gray-400 font-normal">({form.detalle.length}/500)</span>
                        </label>
                        <textarea value={form.detalle} onChange={(e) => set("detalle", e.target.value.slice(0, 500))}
                          rows={4} placeholder={"Describe tu " + form.tipo + " con el mayor detalle posible..."}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-red-400 transition bg-gray-50 resize-none"/>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-zinc-600 mb-1 block">¿Qué solución solicitas?</label>
                        <input value={form.pedido} onChange={(e) => set("pedido", e.target.value)}
                          placeholder="Ej: Cambio del producto, devolución, etc."
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-red-400 transition bg-gray-50"/>
                      </div>
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.acepta} onChange={(e) => set("acepta", e.target.checked)}
                          className="mt-0.5 accent-red-600"/>
                        <span className="text-xs text-zinc-500">
                          Declaro que la información proporcionada es verídica y acepto que sea utilizada para dar respuesta a mi {form.tipo}.
                        </span>
                      </label>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3 — Resumen */}
                {!enviado && step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 className="text-zinc-900 font-black text-base mb-4">Confirma tu {form.tipo}</h3>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col gap-2.5 text-sm">
                      {[
                        { label: "Tipo", val: form.tipo.charAt(0).toUpperCase() + form.tipo.slice(1) },
                        { label: "Nombre", val: form.nombre },
                        { label: "DNI", val: form.dni },
                        { label: "Email", val: form.email },
                        { label: "Teléfono", val: form.telefono },
                        { label: "Producto/Servicio", val: form.descripcion_bien || "—" },
                        { label: "Solución solicitada", val: form.pedido || "—" },
                      ].map((r) => (
                        <div key={r.label} className="flex gap-2">
                          <span className="text-zinc-400 w-36 flex-shrink-0">{r.label}:</span>
                          <span className="text-zinc-800 font-semibold">{r.val}</span>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 pt-2 mt-1">
                        <p className="text-zinc-400 text-xs mb-1">Detalle:</p>
                        <p className="text-zinc-800 text-xs">{form.detalle}</p>
                      </div>
                    </div>
                    <p className="text-zinc-400 text-xs mt-3">
                      Al enviar confirmas que la información es correcta. Recibirás respuesta en máximo <strong>15 días hábiles</strong>.
                    </p>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Botones navegación */}
            {!enviado && (
              <div className="flex items-center justify-between px-6 pb-6 gap-3">
                {step > 0
                  ? <button onClick={() => setStep(s => s - 1)}
                      className="text-zinc-500 hover:text-zinc-800 font-semibold text-sm transition px-4 py-2 rounded-xl hover:bg-gray-100">
                      ← Atrás
                    </button>
                  : <div />
                }
                {step < STEPS.length - 1
                  ? <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
                      className="bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-full text-sm transition">
                      Siguiente →
                    </button>
                  : <button onClick={handleEnviar} disabled={loading}
                      className="bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-full text-sm transition flex items-center gap-2">
                      {loading
                        ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M12 2a10 10 0 0110 10" strokeLinecap="round"/></svg>Enviando...</>
                        : "Enviar reclamo ✓"
                      }
                    </button>
                }
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}