"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const slides = [
  {
    id: 1,
    image: "/slider/slider01.png",
    tag: "Importadores Directos",
    title: "Autopartes\nJaponesas",
    subtitle: "Calidad · Garantía · Rendimiento",
    cta: "Ver Catálogo",
    ctaHref: "/catalogo",
    fallbackBg: "from-zinc-900 to-zinc-800",
  },
  {
    id: 2,
    image: "/slider/slider02.png",
    tag: "Toyota · Nissan · Subaru · Suzuki",
    title: "Las Mejores\nMarcas",
    subtitle: "Especialistas en vehículos japoneses",
    cta: "Ver Marcas",
    ctaHref: "/catalogo",
    fallbackBg: "from-red-950 to-zinc-900",
  },
  {
    id: 3,
    image: "/slider/slider03.png",
    tag: "Próximas Descargas",
    title: "Stock Renovado\nCada Mes",
    subtitle: "Contenedores directos desde Japón",
    cta: "Ver Próximas Descargas",
    ctaHref: "/proximas-descargas",
    fallbackBg: "from-zinc-900 to-red-950",
  },
  {
    id: 4,
    image: "/slider/slider04.png",
    tag: "Motores · Puertas · Faros · Frentes",
    title: "Todo lo que\nNecesitas",
    subtitle: "Amplio catálogo de autopartes originales",
    cta: "Consultar por WhatsApp",
    ctaHref: "https://wa.me/51994006303",
    ctaExternal: true,
    fallbackBg: "from-zinc-900 to-zinc-800",
  },
];

const WA_NUMBER = "51994006303";

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [paused, next]);

  const slide = slides[current];

  return (
    <section
      className="relative w-full h-[85vh] min-h-[500px] max-h-[900px] overflow-hidden bg-zinc-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background image con AnimatePresence */}
      <AnimatePresence mode="wait">
        {/* Background image con fallback */}
<motion.div
  key={slide.id + "-bg"}
  className="absolute inset-0"
  initial={{ opacity: 0, scale: 1.04 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.8, ease: "easeInOut" }}
>
  {/* Fondo de color como fallback */}
  <div className={"absolute inset-0 bg-gradient-to-br " + slide.fallbackBg} />
  
  {/* Imagen encima si existe */}
 <Image
  src={slide.image}
  alt={slide.tag}
  fill
  sizes="100vw"
  className="object-cover object-center"
  priority
  onError={(e) => { e.target.style.display = "none"; }}
/>
  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
</motion.div>
      </AnimatePresence>

      {/* Contenido del slide */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + "-text"}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-2xl"
            >
              {/* Tag */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest"
              >
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                {slide.tag}
              </motion.div>

              {/* Título */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-3xl sm:text-5xl md:text-7xl font-black text-white leading-none tracking-tight mb-4"
                style={{ whiteSpace: "pre-line" }}
              >
                {slide.title}
              </motion.h1>

              {/* Línea roja decorativa */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "80px" }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="h-1 bg-red-500 rounded-full mb-5"
              />

              {/* Subtítulo */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-zinc-300 text-sm sm:text-lg md:text-xl mb-6 font-light"
              >
                {slide.subtitle}
              </motion.p>

              {/* Botones CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                
                <a  href={slide.ctaHref}
                  target={slide.ctaExternal ? "_blank" : undefined}
                  rel={slide.ctaExternal ? "noopener noreferrer" : undefined}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-full transition-all duration-300 shadow-lg text-sm uppercase tracking-wide text-center"
                >
                  {slide.cta}
                </a>
                
                <a href={"https://wa.me/" + WA_NUMBER}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 text-sm uppercase tracking-wide backdrop-blur-sm text-center"
                >
                  WhatsApp
                </a>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controles: flechas */}
      <button
        onClick={prev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
        aria-label="Anterior"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={next}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
        aria-label="Siguiente"
      >
        <ChevronRight />
      </button>

      {/* Dots indicadores */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={"Slide " + (i + 1)}
            className="transition-all duration-300"
          >
            <div
              className={
                i === current
                  ? "w-8 h-2 bg-red-500 rounded-full"
                  : "w-2 h-2 bg-white/40 hover:bg-white/70 rounded-full"
              }
            />
          </button>
        ))}
      </div>

      {/* Contador slide */}
      <div className="absolute bottom-6 right-4 z-20 text-zinc-400 text-xs sm:text-sm font-mono hidden sm:block">
        <span className="text-white font-bold">{String(current + 1).padStart(2, "0")}</span>
        <span className="mx-1">/</span>
        <span>{String(slides.length).padStart(2, "0")}</span>
      </div>
    </section>
  );
}