"use client";
import { useState, useEffect } from "react";

export default function PriceDisplay({ producto, size = "md" }) {
  const [tieneOferta, setTieneOferta] = useState(false);
  const [tiempo, setTiempo] = useState(null);
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
    const ofertaActiva = !!(
      producto.precio_oferta &&
      producto.oferta_hasta &&
      new Date(producto.oferta_hasta) > new Date()
    );
    setTieneOferta(ofertaActiva);

    if (!ofertaActiva) return;

    const calcular = () => {
      const diff = new Date(producto.oferta_hasta) - new Date();
      if (diff <= 0) { setTieneOferta(false); setTiempo(null); return; }
      setTiempo({
        dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
        horas: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutos: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      });
    };

    calcular();
    const interval = setInterval(calcular, 60000);
    return () => clearInterval(interval);
  }, [producto.precio_oferta, producto.oferta_hasta]);

  if (!producto.mostrar_precio) {
    return (
      <span className={size === "lg" ? "text-lg font-black text-zinc-700" : "text-sm font-bold text-zinc-600"}>
        Consultar precio
      </span>
    );
  }

  // Durante SSR y antes de montar — muestra precio normal sin oferta
  if (!montado) {
    return (
      <span className={size === "lg" ? "text-2xl font-black text-zinc-900" : "text-lg font-black text-zinc-900"}>
        S/ {producto.precio_normal?.toLocaleString()}
      </span>
    );
  }

  return (
    <div>
      {tieneOferta ? (
        <div>
          <span className="inline-block bg-red-100 text-red-600 text-xs font-black px-2 py-0.5 rounded-full mb-1 uppercase tracking-wide">
            Oferta
          </span>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className={size === "lg" ? "text-2xl font-black text-red-600" : "text-lg font-black text-red-600"}>
              S/ {producto.precio_oferta?.toLocaleString()}
            </span>
            <span className="text-zinc-400 line-through text-sm">
              S/ {producto.precio_normal?.toLocaleString()}
            </span>
            <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
              -{Math.round((1 - producto.precio_oferta / producto.precio_normal) * 100)}%
            </span>
          </div>
          {tiempo && (
            <div className="flex items-center gap-1 mt-1.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-red-400">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <span className="text-red-400 text-xs font-semibold">
                {tiempo.dias > 0 && tiempo.dias + "d "}
                {tiempo.horas}h {tiempo.minutos}m restantes
              </span>
            </div>
          )}
        </div>
      ) : (
        <span className={size === "lg" ? "text-2xl font-black text-zinc-900" : "text-lg font-black text-zinc-900"}>
          S/ {producto.precio_normal?.toLocaleString()}
        </span>
      )}
    </div>
  );
}