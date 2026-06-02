"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const marcas = [
  {
    id: "toyota",
    nombre: "Toyota",
    logo: "/logos/Toyota.png",
    imagen: "/vehiculos/probox-2004.png",
    descripcion: "Confiabilidad y durabilidad japonesa",
    modelos: ["Probox", "BB", "Belta", "Caldina", "Carib", "Succeed"],
  },
  {
    id: "nissan",
    nombre: "Nissan",
    logo: "/logos/Nissan.png",
    imagen: "/vehiculos/nissan-ad-van-y12.png",
    descripcion: "Tecnología y rendimiento superior",
    modelos: ["AD Van", "Bluebird", "Lafesta", "Tiida", "Wingroad"],
  },
  {
    id: "subaru",
    nombre: "Subaru",
    logo: "/logos/Subaru.png",
    imagen: "/vehiculos/subaru.png",
    descripcion: "Tracción total y potencia AWD",
    modelos: ["Impreza", "Forester", "Legacy", "Outback"],
  },
  {
    id: "suzuki",
    nombre: "Suzuki",
    logo: "/logos/Suzuki.jpg",
    imagen: "/vehiculos/suzuki.png",
    descripcion: "Eficiencia y agilidad urbana",
    modelos: ["Swift", "Alto", "Ignis", "Jimny"],
  },
  {
    id: "mazda",
    nombre: "Mazda",
    logo: "/logos/Mazda.png",
    imagen: "/vehiculos/axela.png",
    descripcion: "Diseño y precisión japonesa",
    modelos: ["Axela", "Demio", "Atenza", "CX-5"],
  },
  {
    id: "mitsubishi",
    nombre: "Mitsubishi",
    logo: "/logos/Mitsubishi.png",
    imagen: "/vehiculos/mitsubishi-lancer-cs5a.png",
    descripcion: "Potencia y durabilidad garantizada",
    modelos: ["Lancer", "Pajero", "Outlander"],
  },
  {
    id: "honda",
    nombre: "Honda",
    logo: "/logos/Honda.jpg",
    imagen: "/vehiculos/honda.png",
    descripcion: "Innovación y confort garantizado",
    modelos: ["Fit", "Civic", "Stream", "Freed"],
  },
  {
    id: "audi",
    nombre: "Audi",
    logo: "/logos/Audi.png",
    imagen: "/vehiculos/audi-a4.png",
    descripcion: "Ingeniería alemana de precisión",
    modelos: ["A4", "A3", "A6", "Q5"],
  },
];

export default function BrandsSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(
    () => setActive((p) => (p + 1) % marcas.length),
    []
  );

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 3500);
    return () => clearInterval(t);
  }, [paused, next]);

  const getPosicion = (i) => {
    const diff = (i - active + marcas.length) % marcas.length;
    if (diff === 0) return "center";
    if (diff === 1 || diff === marcas.length - 1) return "side";
    return "hidden";
  };

  const getOffset = (i) => {
    const diff = (i - active + marcas.length) % marcas.length;
    if (diff === 0) return 0;
    if (diff === 1) return 1;
    if (diff === marcas.length - 1) return -1;
    return 0;
  };

  return (
    <section
      className="bg-gray-50 py-20 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Título */}
      <div className="text-center mb-14 px-4">
        <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-3">
          Especialistas en
        </p>
        <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight">
          Marcas Japonesas
        </h2>
        <div className="w-16 h-1 bg-red-500 rounded-full mx-auto mt-4" />
      </div>

      {/* Showcase de vehículos */}
      <div className="relative h-80 md:h-96 flex items-center justify-center">
        {marcas.map((marca, i) => {
          const pos = getPosicion(i);
          const offset = getOffset(i);
          if (pos === "hidden") return null;

          const isCenter = pos === "center";

          return (
            <motion.div
              key={marca.id}
              animate={{
                x: offset * 340,
                scale: isCenter ? 1 : 0.75,
                opacity: isCenter ? 1 : 0.35,
                filter: isCenter ? "blur(0px)" : "blur(2px)",
                zIndex: isCenter ? 10 : 5,
              }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute cursor-pointer"
              onClick={() => setActive(i)}
            >
              <div className="relative w-72 md:w-96">
                {/* Card del vehículo */}
                <div className="relative h-52 md:h-64 rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-xl">
                  <Image
  src={marca.imagen}
  alt={marca.nombre}
  fill
  sizes="(max-width: 768px) 90vw, 400px"
  className="object-cover object-center"
/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Logo de la marca */}
                  <div className="absolute top-4 left-4 bg-white/95 rounded-xl p-2 shadow-lg">
                    <Image
  src={marca.logo}
  alt={marca.nombre}
  width={44}
  height={44}
  sizes="44px"
  className="object-contain w-10 h-10"
  onError={(e) => { e.target.style.display = "none"; }}
/>
                  </div>

                  {/* Info en el bottom */}
                  {isCenter && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="absolute bottom-0 left-0 right-0 p-4"
                    >
                      <p className="text-white font-black text-xl">
                        {marca.nombre}
                      </p>
                      <p className="text-zinc-300 text-xs">{marca.descripcion}</p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Flechas */}
        <button
          onClick={() =>
            setActive((p) => (p - 1 + marcas.length) % marcas.length)
          }
          className="absolute left-4 md:left-8 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-red-600 border border-zinc-700 text-white flex items-center justify-center transition-all duration-200"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute right-4 md:right-8 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-red-600 border border-zinc-700 text-white flex items-center justify-center transition-all duration-200"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Info de la marca activa */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="text-center mt-8 px-4"
        >
          {/* Modelos disponibles */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {marcas[active].modelos.map((m) => (
              <span
                key={m}
                className="bg-white text-zinc-700 text-xs px-3 py-1.5 rounded-full border border-gray-200 shadow-sm"
              >
                {m}
              </span>
            ))}
          </div>

          {/* Botón ver modelos */}
          <Link
            href={"/marcas/" + marcas[active].id}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-3 rounded-full transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-red-900/30 text-sm uppercase tracking-wide"
          >
            Ver modelos {marcas[active].nombre}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {marcas.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="transition-all duration-300"
          >
            <div
              className={
                i === active
                  ? "w-8 h-2 bg-red-500 rounded-full"
                  : "w-2 h-2 bg-gray-300 hover:bg-gray-500 rounded-full"
              }
            />
          </button>
        ))}
      </div>

      {/* Grid de logos de marcas */}
      <div className="max-w-4xl mx-auto px-6 mt-16">
        <p className="text-center text-gray-400 text-xs uppercase tracking-widest mb-6">
          También trabajamos con
        </p>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
          {marcas.map((marca, i) => (
            <button
              key={marca.id}
              onClick={() => setActive(i)}
              className="group flex flex-col items-center gap-2"
            >
              <div
                className={
                  i === active
                    ? "w-14 h-14 bg-white rounded-xl p-2 shadow-lg ring-2 ring-red-500 transition-all duration-200"
                    : "w-14 h-14 bg-gray-100 hover:bg-white hover:shadow-md rounded-xl p-2 transition-all duration-200 border border-gray-200"
                }
              >
                <Image
  src={marca.logo}
  alt={marca.nombre}
  width={48}
  height={48}
  sizes="48px"
  className="object-contain w-full h-full"
  onError={(e) => { e.target.style.display = "none"; }}
/>
              </div>
              <span
                className={
                  i === active
                    ? "text-red-400 text-xs font-bold"
                    : "text-gray-400 text-xs group-hover:text-zinc-700 transition-colors"
                }
              >
                {marca.nombre}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}