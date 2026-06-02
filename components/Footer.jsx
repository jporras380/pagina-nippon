"use client";
import Link from "next/link";
import { useState } from "react";
import LibroReclamaciones from "./LibroReclamaciones";
import Image from "next/image";
const WA = "51994006303";
const TEL = "0114314148";

export default function Footer() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <footer className="bg-zinc-950 border-t border-zinc-800">

        {/* Banda superior roja */}
        <div className="bg-red-600 py-4 px-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white font-bold text-sm text-center sm:text-left">
              🚢 Recibimos contenedores cada 1 a 3 meses — ¡Reserva tu autoparte ahora!
            </p>
            
            <a href={"https://wa.me/" + WA + "?text=" + encodeURIComponent("Hola, quiero reservar una autoparte")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 bg-white text-red-600 font-black text-xs px-5 py-2 rounded-full hover:bg-red-50 transition"
            >
              Consultar ahora →
            </a>
          </div>
        </div>

        {/* Cuerpo del footer */}
        <div className="max-w-6xl mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1 — Marca */}
          <div>
            <div className="bg-white rounded-xl px-3 py-2 inline-block mb-5">
              <Image
                src="/logos/logo.jpg"
                alt="NipponAutoparts"
                width={120}
                height={40}
                className="object-contain h-9 w-auto"
              />
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed mb-5">
              Importadores directos de autopartes japonesas. Calidad garantizada directo desde Japón al Perú.
            </p>
            {/* Redes sociales */}
            <div className="flex items-center gap-3">
              <a href="https://www.facebook.com/LasMejoresAutopartesDelPeru" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-zinc-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200" aria-label="Facebook">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/@NipponAutopartsVentasPeru" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-zinc-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors duration-200" aria-label="YouTube">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
                  <polygon fill="black" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@nipponautopartslima" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-zinc-800 hover:bg-zinc-600 rounded-lg flex items-center justify-center transition-colors duration-200" aria-label="TikTok">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
                </svg>
              </a>
              <a href={"https://wa.me/" + WA} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-zinc-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors duration-200" aria-label="WhatsApp">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741 1.018.982-3.656-.236-.374A9.86 9.86 0 012.1 12.042C2.1 6.545 6.545 2.1 12.042 2.1c2.624 0 5.092 1.025 6.944 2.876a9.787 9.787 0 012.876 6.945c-.003 5.497-4.448 9.941-9.94 9.941z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2 — Links rápidos */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Enlaces rápidos
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Inicio", href: "/" },
                { label: "Catálogo de autopartes", href: "/catalogo" },
                { label: "Próximas descargas", href: "/proximas-descargas" },
                { label: "Marcas", href: "/marcas" },
                { label: "Nosotros", href: "/nosotros" },
                { label: "Contacto", href: "/contacto" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-zinc-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-red-500 rounded-full group-hover:w-2 transition-all duration-200" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Contacto */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Contacto
            </h4>
            <ul className="flex flex-col gap-4">
              <li>
                <a href={"tel:" + TEL}
                  className="flex items-start gap-3 text-zinc-400 hover:text-white transition-colors group">
                  <span className="w-8 h-8 bg-zinc-800 group-hover:bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs text-zinc-600 mb-0.5">Teléfono fijo</p>
                    <p className="text-sm font-semibold">01 431 4148</p>
                  </div>
                </a>
              </li>
              <li>
                <a href={"https://wa.me/" + WA} target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-3 text-zinc-400 hover:text-white transition-colors group">
                  <span className="w-8 h-8 bg-zinc-800 group-hover:bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741 1.018.982-3.656-.236-.374A9.86 9.86 0 012.1 12.042C2.1 6.545 6.545 2.1 12.042 2.1c2.624 0 5.092 1.025 6.944 2.876a9.787 9.787 0 012.876 6.945c-.003 5.497-4.448 9.941-9.94 9.941z"/>
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs text-zinc-600 mb-0.5">WhatsApp</p>
                    <p className="text-sm font-semibold">994 006 303</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:nippon.ventas@gmail.com"
                  className="flex items-start gap-3 text-zinc-400 hover:text-white transition-colors group">
                  <span className="w-8 h-8 bg-zinc-800 group-hover:bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs text-zinc-600 mb-0.5">Correo</p>
                    <p className="text-sm font-semibold">nippon.ventas@gmail.com</p>
                  </div>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </span>
                <div>
                  <p className="text-xs text-zinc-600 mb-0.5">Horario</p>
                  <p className="text-sm text-zinc-400">Lun–Vie: 9:00 – 5:30 pm</p>
                  <p className="text-sm text-zinc-400">Sáb: 9:00 – 1:30 pm</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4 — Ubicación */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Ubicación
            </h4>
            <div className="flex items-start gap-3 mb-4">
              <span className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </span>
              <div>
                <p className="text-zinc-300 text-sm font-semibold mb-1">Av. Colonial 515</p>
                <p className="text-zinc-500 text-xs">Cercado de Lima (ex Colonial)</p>
                <p className="text-zinc-500 text-xs mt-1">A 5 cuadras de Plaza 2 de Mayo</p>
              </div>
            </div>

            {/* Mapa embed */}
            <div className="rounded-xl overflow-hidden border border-zinc-800 mb-4">
              <iframe
                src="https://maps.google.com/maps?q=Av.+Colonial+515,+Cercado+de+Lima&output=embed&z=16"
                width="100%"
                height="160"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                title="Ubicación NipponAutoparts"
              />
            </div>            
            
            </div>  
            <a  href="https://goo.gl/maps/3qS7foqsFLHW1k677"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-red-400 hover:text-red-300 text-xs font-semibold transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              Abrir en Google Maps
            </a>
          </div>
        

        {/* Barra inferior */}
        <div className="border-t border-zinc-800 px-4 py-5">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-zinc-600 text-xs text-center sm:text-left">
              © 2026 NipponAutoparts S.R.L. · RUC 20511141754 · Todos los derechos reservados
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-bold px-4 py-2 rounded-full transition-all duration-200"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              Libro de Reclamaciones
            </button>
          </div>
        </div>
      </footer>

      {/* Botón flotante WhatsApp */}
      
       <a href={"https://wa.me/" + WA + "?text=" + encodeURIComponent("Hola, quiero consultar sobre autopartes japonesas")}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 group"
        aria-label="WhatsApp"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-30" />
          <div className="relative w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-xl shadow-green-900/40 transition-all duration-200 hover:scale-110">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741 1.018.982-3.656-.236-.374A9.86 9.86 0 012.1 12.042C2.1 6.545 6.545 2.1 12.042 2.1c2.624 0 5.092 1.025 6.944 2.876a9.787 9.787 0 012.876 6.945c-.003 5.497-4.448 9.941-9.94 9.941z"/>
            </svg>
          </div>
          <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-zinc-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg border border-zinc-700">
            ¿Necesitas ayuda?
          </span>
        </div>
      </a>

      <LibroReclamaciones isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}