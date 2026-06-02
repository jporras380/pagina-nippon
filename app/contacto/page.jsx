"use client";
import { useState } from "react";
import Link from "next/link";
import { a } from "framer-motion/client";

export default function ContactoPage() {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });
  const [enviado, setEnviado] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleEnviar = () => {
    if (!form.nombre || !form.mensaje) return;
    const msg = encodeURIComponent(
      "Hola NipponAutoparts, mi nombre es " + form.nombre +
      (form.telefono ? " — Tel: " + form.telefono : "") +
      "\n\nAsunto: " + (form.asunto || "Consulta general") +
      "\n\n" + form.mensaje
    );
    window.open("https://wa.me/51994006303?text=" + msg, "_blank");
    setEnviado(true);
    setTimeout(() => setEnviado(false), 5000);
  };

  const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-zinc-900 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400";

  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <div className="bg-gray-50 border-b border-gray-100 pt-24 pb-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-gray-600 transition">Inicio</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">Contacto</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 mb-2">
            Contáctanos
          </h1>
          <p className="text-gray-500 text-base">
            Estamos listos para ayudarte a encontrar la autoparte que necesitas
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Formulario */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-red-500 rounded-full" />
              <h2 className="text-xl font-black text-zinc-900">
                Envíanos un mensaje
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Tu nombre *
                  </label>
                  <input
                    value={form.nombre}
                    onChange={(e) => set("nombre", e.target.value)}
                    placeholder="Juan Pérez"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Teléfono
                  </label>
                  <input
                    value={form.telefono}
                    onChange={(e) => set("telefono", e.target.value)}
                    placeholder="999 999 999"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Asunto
                </label>
                <select
                  value={form.asunto}
                  onChange={(e) => set("asunto", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Seleccionar asunto</option>
                  <option>Consulta de precio</option>
                  <option>Disponibilidad de autoparte</option>
                  <option>Próximas descargas</option>
                  <option>Garantía o reclamo</option>
                  <option>Envío a provincias</option>
                  <option>Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Mensaje *
                </label>
                <textarea
                  value={form.mensaje}
                  onChange={(e) => set("mensaje", e.target.value)}
                  rows={4}
                  placeholder="Cuéntanos qué autoparte necesitas, para qué modelo y año..."
                  className={inputClass + " resize-none"}
                />
              </div>

              {/* Botón enviar */}
              <button
                onClick={handleEnviar}
                disabled={!form.nombre || !form.mensaje}
                className={"w-full flex items-center justify-center gap-2 font-black py-4 rounded-2xl text-sm transition " +
                  (enviado
                    ? "bg-green-500 text-white"
                    : "bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-lg shadow-green-100")}
              >
                {enviado ? (
                  <>✅ Mensaje enviado — revisa WhatsApp</>
                ) : (
                  <>
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741 1.018.982-3.656-.236-.374A9.86 9.86 0 012.1 12.042C2.1 6.545 6.545 2.1 12.042 2.1c2.624 0 5.092 1.025 6.944 2.876a9.787 9.787 0 012.876 6.945c-.003 5.497-4.448 9.941-9.94 9.941z"/>
                    </svg>
                    Enviar por WhatsApp
                  </>
                )}
              </button>

              <p className="text-gray-400 text-xs text-center">
                Al enviar, se abrirá WhatsApp con tu mensaje precargado
              </p>
            </div>
          </div>

          {/* Info de contacto */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-red-500 rounded-full" />
              <h2 className="text-xl font-black text-zinc-900">
                Información de contacto
              </h2>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              {[
                {
                  icono: "💬",
                  titulo: "WhatsApp",
                  detalle: "+51 994 006 303",
                  sub: "Respuesta inmediata · Lun–Sáb",
                  link: "https://wa.me/51994006303",
                  cta: "Escribir ahora",
                  color: "bg-green-600 hover:bg-green-500",
                },
                {
                  icono: "📞",
                  titulo: "Teléfono fijo",
                  detalle: "01 431 4148",
                  sub: "Lun–Vie: 9:00–5:30pm · Sáb: 9:00–1:30pm",
                  link: "tel:0114314148",
                  cta: "Llamar",
                  color: "bg-blue-600 hover:bg-blue-500",
                },
                {
                  icono: "✉️",
                  titulo: "Correo electrónico",
                  detalle: "nippon.ventas@gmail.com",
                  sub: "Para consultas formales y cotizaciones",
                  link: "mailto:nippon.ventas@gmail.com",
                  cta: "Enviar email",
                  color: "bg-zinc-800 hover:bg-zinc-700",
                },
                {
                  icono: "📍",
                  titulo: "Visítanos",
                  detalle: "Av. Colonial 515",
                  sub: "Cercado de Lima",
                  link: "https://maps.google.com/?q=Av.+Colonial+515,+Cercado+de+Lima",
                  cta: "Cómo llegar",
                  color: "bg-red-600 hover:bg-red-500",
                },
              ].map((item) => (
                <div key={item.titulo}
                  className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="w-12 h-12 bg-white rounded-2xl border border-gray-200 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                    {item.icono}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 font-medium">{item.titulo}</p>
                    <p className="font-black text-zinc-900 text-sm">{item.detalle}</p>
                    <p className="text-gray-400 text-xs">{item.sub}</p>
                  </div>
                  
                  <a  href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={"flex-shrink-0 text-white font-bold text-xs px-3 py-2 rounded-xl transition " + item.color}
                  >
                    {item.cta}
                  </a>
                </div>
              ))}
            </div>

            {/* Horario */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-4">
              <p className="font-bold text-zinc-900 text-sm mb-3 flex items-center gap-2">
                🕘 Horario de atención
              </p>
              <div className="flex flex-col gap-1.5">
                {[
                  { dia: "Lunes — Viernes", hora: "9:00 am — 5:30 pm", activo: true },
                  { dia: "Sábado", hora: "9:00 am — 1:30 pm", activo: true },
                  { dia: "Domingo", hora: "Cerrado", activo: false },
                ].map((h) => (
                  <div key={h.dia}
                    className="flex items-center justify-between bg-white rounded-xl px-3 py-2 border border-gray-100">
                    <span className="text-zinc-700 text-xs font-semibold">{h.dia}</span>
                    <span className={"text-xs font-bold " +
                      (h.activo ? "text-green-600" : "text-red-400")}>
                      {h.hora}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mapa pequeño */}
            <div className="rounded-2xl overflow-hidden border border-gray-200 h-48">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.5!2d-77.0553!3d-12.0464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sAv.+Colonial+515%2C+Cercado+de+Lima!5e0!3m2!1ses!2spe!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Ubicación NipponAutoparts"
              />
            </div>
          </div>
        </div>

        {/* Redes sociales */}
        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm mb-4">Síguenos en redes sociales</p>
          <div className="flex justify-center gap-3 flex-wrap">
         <div className="flex justify-center gap-3 flex-wrap">
  
   <a href="https://facebook.com/LasMejoresAutopartesDelPeru"
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col items-center gap-1 text-white font-bold px-5 py-3 rounded-2xl transition bg-blue-600 hover:bg-blue-500"
  >
    <span className="text-sm font-black">Facebook</span>
    <span className="text-xs opacity-75">@LasMejoresAutopartesDelPeru</span>
  </a>
  
   <a href="https://youtube.com/@NipponAutopartsVentasPeru"
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col items-center gap-1 text-white font-bold px-5 py-3 rounded-2xl transition bg-red-600 hover:bg-red-500"
  >
    <span className="text-sm font-black">YouTube</span>
    <span className="text-xs opacity-75">@NipponAutopartsVentasPeru</span>
  </a>
  
   <a href="https://tiktok.com/@nipponautopartslima"
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col items-center gap-1 text-white font-bold px-5 py-3 rounded-2xl transition bg-zinc-900 hover:bg-zinc-700"
  >
    <span className="text-sm font-black">TikTok</span>
    <span className="text-xs opacity-75">@nipponautopartslima</span>
  </a>
</div>


          </div>
        </div>
      </div>
    </div>
  );
}