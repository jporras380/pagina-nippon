"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const WA = "51994006303";

const TIPO_LABELS = {
  "completo": { label: "Completo", color: "bg-green-100 text-green-700", desc: "Motor, caja y carrocería" },
  "cdk": { label: "CDK", color: "bg-amber-100 text-amber-700", desc: "Todo excepto chasis" },
  "solo-partes": { label: "Solo partes", color: "bg-blue-100 text-blue-700", desc: "Autopartes específicas" },
};

const ESTADO_LABELS = {
  "en-camino": { label: "🚢 En camino", color: "bg-blue-500" },
  "en-puerto": { label: "🏭 En puerto", color: "bg-amber-500" },
  "disponible": { label: "✅ Disponible", color: "bg-green-500" },
};

function Countdown({ fechaLlegada }) {
  const [tiempo, setTiempo] = useState(null);

  useEffect(() => {
    const calcular = () => {
      const diff = new Date(fechaLlegada) - new Date();
      if (diff <= 0) { setTiempo(null); return; }
      setTiempo({
        dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
        horas: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutos: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        segundos: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    calcular();
    const interval = setInterval(calcular, 1000);
    return () => clearInterval(interval);
  }, [fechaLlegada]);

  if (!tiempo) return (
    <div className="text-center py-2">
      <span className="bg-green-100 text-green-700 font-black text-sm px-4 py-2 rounded-full">
        ✅ Ya llegó
      </span>
    </div>
  );

  const bloques = [
    { valor: tiempo.dias, label: "días" },
    { valor: tiempo.horas, label: "horas" },
    { valor: tiempo.minutos, label: "min" },
    { valor: tiempo.segundos, label: "seg" },
  ];

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {bloques.map((b, i) => (
        <div key={b.label} className="flex items-center gap-2 sm:gap-3">
          <div className="text-center">
            <div className="bg-zinc-900 text-white font-black text-xl sm:text-3xl w-14 sm:w-20 h-14 sm:h-20 rounded-2xl flex items-center justify-center shadow-lg tabular-nums">
              {String(b.valor).padStart(2, "0")}
            </div>
            <p className="text-gray-500 text-xs mt-1.5 uppercase tracking-wider font-medium">
              {b.label}
            </p>
          </div>
          {i < bloques.length - 1 && (
            <span className="text-zinc-300 font-black text-xl sm:text-2xl mb-4">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

function AutoCard({ auto, contenedorTitulo, index }) {
  const [modalReserva, setModalReserva] = useState(false);
  const [form, setForm] = useState({ nombre: "", nota: "" });

  const tipoInfo = TIPO_LABELS[auto.tipo_importacion] ||
    TIPO_LABELS["completo"];

  // Usa la imagen de la unidad o la del modelo
  const imagen = auto.imagenes?.[0] || auto.modelo_imagen || "";

  const waMsg = "Hola, quiero reservar el " +
    auto.marca_nombre + " " + auto.modelo_nombre +
    " Color: " + auto.color_nombre +
    " Tipo: " + tipoInfo.label +
    (auto.modelo_chasis ? " Chasis: " + auto.modelo_chasis : "") +
    " - " + contenedorTitulo +
    (form.nombre ? " | Nombre: " + form.nombre : "") +
    (form.nota ? " | Nota: " + form.nota : "");

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08 }}
        className={"bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group " +
          (auto.estado_unidad === "reservado"
            ? "border-red-200"
            : "border-gray-100 hover:-translate-y-0.5")}
      >
        {/* Imagen */}
        <div className="relative h-44 bg-gray-50 overflow-hidden">
          {imagen ? (
            <motion.div
              className="absolute inset-0"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
            >
              <Image
                src={imagen}
                alt={auto.marca_nombre + " " + auto.modelo_nombre}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-contain p-4"
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-200 text-5xl">
              🚗
            </div>
          )}

          {/* Tipo */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <span className={"text-xs font-bold px-2.5 py-1 rounded-full " + tipoInfo.color}>
              {tipoInfo.label}
            </span>
            {auto.estado_unidad === "reservado" && (
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">
                🔒 Reservado
              </span>
            )}
            {auto.incluye_techo === false && (
              <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                Sin techo
              </span>
            )}
          </div>

          {/* Color */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1.5 shadow-sm">
            <div
              className="w-3 h-3 rounded-full border border-gray-200"
              style={{ backgroundColor: auto.color_hex }}
            />
            <span className="text-xs font-semibold text-zinc-700">{auto.color_nombre}</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          {/* Logo + nombre */}
          <div className="flex items-center gap-2 mb-2">
            {auto.marca_logo && (
              <div className="w-7 h-7 bg-gray-50 rounded-lg p-1 border border-gray-100 flex-shrink-0">
                <img src={auto.marca_logo} alt={auto.marca_nombre}
                  className="w-full h-full object-contain" />
              </div>
            )}
            <h3 className="font-black text-zinc-900 text-base leading-tight">
              {auto.marca_nombre} {auto.modelo_nombre}
            </h3>
          </div>

          {auto.modelo_chasis && (
            <p className="text-gray-500 text-xs mb-1">
              Chasis: <span className="font-semibold text-zinc-700">{auto.modelo_chasis}</span>
            </p>
          )}

          {auto.nota && (
            <p className="text-gray-400 text-xs mb-3 leading-relaxed">{auto.nota}</p>
          )}

          {/* Fecha llegada */}
          {auto.fecha_llegada && (
            <div className="flex items-center gap-1.5 mb-3 bg-blue-50 rounded-xl px-3 py-2 border border-blue-100">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-blue-500">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span className="text-blue-700 text-xs font-semibold">
                Llega el {new Date(auto.fecha_llegada).toLocaleDateString("es-PE", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </span>
            </div>
          )}

          {/* Botón */}
          {/* Botones */}
{auto.estado_unidad === "reservado" ? (
  <div className="w-full bg-red-50 border border-red-200 text-red-500 font-bold py-2.5 rounded-xl text-sm text-center">
    🔒 Ya fue reservado
  </div>
) : (
  <div className="flex flex-col gap-2">
    {/* Ver qué autopartes llegan */}
    <Link
      href={"/marcas/" + auto.marca_id + "/" + auto.modelo_id +
        "?unidad=" + auto.id}
      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <line x1="11" y1="8" x2="11" y2="14"/>
        <line x1="8" y1="11" x2="14" y2="11"/>
      </svg>
      Ver qué autopartes llegan
    </Link>

    {/* Reservar */}
    <button
      onClick={() => setModalReserva(true)}
      className="w-full bg-white hover:bg-gray-50 border-2 border-red-500 text-red-600 font-black py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 8 12 12 14 14"/>
      </svg>
      Reservar antes de llegar
    </button>
  </div>
)}
        </div>
      </motion.div>

      {/* Modal reserva */}
      <AnimatePresence>
        {modalReserva && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.6)" }}
            onClick={(e) => e.target === e.currentTarget && setModalReserva(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
            >
              <div className="bg-red-600 px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-red-200 text-xs uppercase tracking-wide">Reservar</p>
                  <h3 className="text-white font-black text-base">
                    {auto.marca_nombre} {auto.modelo_nombre} · {auto.color_nombre}
                  </h3>
                </div>
                <button onClick={() => setModalReserva(false)}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <div className="px-5 py-4 flex flex-col gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">
                    Tu nombre
                  </label>
                  <input
                    value={form.nombre}
                    onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))}
                    placeholder="Ej: Juan Pérez"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">
                    Nota (opcional)
                  </label>
                  <textarea
                    value={form.nota}
                    onChange={(e) => setForm(f => ({ ...f, nota: e.target.value }))}
                    rows={2}
                    placeholder="¿Necesitas algo específico de este auto?"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 transition resize-none"
                  />
                </div>
                
                <a href={"https://wa.me/" + WA + "?text=" + encodeURIComponent(waMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setModalReserva(false)}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-black py-3 rounded-2xl text-sm transition shadow-lg shadow-green-100"
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741 1.018.982-3.656-.236-.374A9.86 9.86 0 012.1 12.042C2.1 6.545 6.545 2.1 12.042 2.1c2.624 0 5.092 1.025 6.944 2.876a9.787 9.787 0 012.876 6.945c-.003 5.497-4.448 9.941-9.94 9.941z"/>
                  </svg>
                  Reservar por WhatsApp
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function ProximasDescargasClient({ contenedores }) {
  const [tabActivo, setTabActivo] = useState(0);

  if (!contenedores || contenedores.length === 0) {
    return (
      <div className="bg-white min-h-screen pt-28 px-4">
        <div className="max-w-4xl mx-auto py-20 text-center">
          <div className="text-6xl mb-4">🚢</div>
          <h1 className="text-3xl font-black text-zinc-900 mb-3">Próximas Descargas</h1>
          <p className="text-gray-500 mb-8">
            En este momento no hay contenedores programados.<br/>
            Consulta por WhatsApp para saber cuándo llega el próximo lote.
          </p>
          
          <a href={"https://wa.me/" + WA + "?text=" + encodeURIComponent("Hola, ¿cuándo llega el próximo contenedor?")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-3.5 rounded-full transition text-sm shadow-lg"
          >
            Consultar próxima llegada →
          </a>
        </div>
      </div>
    );
  }

  const contenedor = contenedores[tabActivo];
  const estadoInfo = ESTADO_LABELS[contenedor.estado] || ESTADO_LABELS["en-camino"];
  const disponibles = contenedor.autos?.filter(a => !a.reservado).length || 0;
  const reservados = contenedor.autos?.filter(a => a.reservado).length || 0;

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero */}
      <div className="bg-zinc-950 pt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
            <Link href="/" className="hover:text-zinc-300 transition">Inicio</Link>
            <span>/</span>
            <span className="text-zinc-300">Próximas Descargas</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={"inline-flex items-center gap-1.5 text-white text-xs font-bold px-3 py-1.5 rounded-full " + estadoInfo.color}>
                  {estadoInfo.label}
                </span>
                {contenedor.numero_contenedor && (
                  <span className="text-zinc-500 text-xs font-mono">
                    {contenedor.numero_contenedor}
                  </span>
                )}
              </div>
              <h1 className="text-white font-black text-2xl sm:text-4xl tracking-tight mb-2">
                {contenedor.titulo}
              </h1>
              <p className="text-zinc-400 text-sm max-w-lg">
                {contenedor.descripcion}
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-3 flex-shrink-0">
              <div className="bg-white/10 rounded-2xl px-4 py-3 text-center">
                <p className="text-white font-black text-2xl">{contenedor.autos?.length || 0}</p>
                <p className="text-zinc-400 text-xs">Autos</p>
              </div>
              <div className="bg-green-500/20 rounded-2xl px-4 py-3 text-center">
                <p className="text-green-400 font-black text-2xl">{disponibles}</p>
                <p className="text-green-500 text-xs">Disponibles</p>
              </div>
              <div className="bg-red-500/20 rounded-2xl px-4 py-3 text-center">
                <p className="text-red-400 font-black text-2xl">{reservados}</p>
                <p className="text-red-500 text-xs">Reservados</p>
              </div>
            </div>
          </div>

          {/* Contador */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6">
            <p className="text-zinc-400 text-xs uppercase tracking-widest text-center mb-4">
              ⏳ Tiempo estimado de llegada
            </p>
            <Countdown fechaLlegada={contenedor.fecha_llegada} />
            <p className="text-zinc-500 text-xs text-center mt-4">
              Fecha estimada: {new Date(contenedor.fecha_llegada).toLocaleDateString("es-PE", {
                weekday: "long", year: "numeric", month: "long", day: "numeric"
              })}
            </p>
          </div>
        </div>

        {/* Tabs si hay múltiples contenedores */}
        {contenedores.length > 1 && (
          <div className="border-t border-zinc-800">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto py-2">
              {contenedores.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setTabActivo(i)}
                  className={"flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition " +
                    (i === tabActivo
                      ? "bg-white/10 text-white"
                      : "text-zinc-500 hover:text-zinc-300")}
                >
                  {c.titulo}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lista de autos */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-zinc-900">
              AutoPartes De Autos en este contenedor
            </h2>
            <p className="text-gray-500 text-sm mt-0.5">
              Reserva ahora — llegarán el{" "}
              {new Date(contenedor.fecha_llegada).toLocaleDateString("es-PE", {
                day: "numeric", month: "long"
              })}
            </p>
          </div>
          
          <a href={"https://wa.me/" + WA + "?text=" + encodeURIComponent(
              "Hola, quiero saber más sobre el " + contenedor.titulo
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-5 py-2.5 rounded-full text-sm transition"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741 1.018.982-3.656-.236-.374A9.86 9.86 0 012.1 12.042C2.1 6.545 6.545 2.1 12.042 2.1c2.624 0 5.092 1.025 6.944 2.876a9.787 9.787 0 012.876 6.945c-.003 5.497-4.448 9.941-9.94 9.941z"/>
            </svg>
            Consultar lote completo
          </a>
        </div>

        {/* Grid de autos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {contenedor.autos?.map((auto, i) => (
            <AutoCard
              key={auto.id}
              auto={auto}
              contenedorTitulo={contenedor.titulo}
              index={i}
            />
          ))}
        </div>

        {/* CTA final */}
        <div className="mt-12 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 text-center shadow-sm">
          <div className="text-4xl mb-3">🚢</div>
          <h3 className="text-zinc-900 font-black text-xl mb-2">
            ¿No encuentras lo que buscas?
          </h3>
          <p className="text-gray-500 text-sm mb-5 max-w-md mx-auto">
            Podemos reservar autopartes específicas del siguiente contenedor.
            Consulta disponibilidad y precios directamente con nuestro equipo.
          </p>
          
          <a  href={"https://wa.me/" + WA + "?text=" + encodeURIComponent(
              "Hola, quiero consultar sobre las próximas descargas de autopartes japonesas"
            )}
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