"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const categorias = [
  {
    id: "carroceria",
    titulo: "Carrocería",
    subtitulo: "Puertas · Capots · Guardafangos · Parachoques - Frentes Completas",
    imagen: "/productos/capots/capot-ejemplo.png",
    fallbackColor: "from-slate-700 to-slate-900",
    acento: "bg-red-500",
    href: "/catalogo?categoria=capots",  
  },
  {
    id: "motor",
    titulo: "Motores & Cajas",
    subtitulo: "Motores completos · Cajas manual y automático",
    imagen: "/productos/motores/Toyota/Probox/1nz-at4x2.png",
    fallbackColor: "from-zinc-700 to-zinc-900",
    acento: "bg-blue-500",
    href: "/catalogo?categoria=motores",
  },
  {
    id: "suspension",
    titulo: "Suspensión",
    subtitulo: "Amortiguadores · Ejes · Aros · Brazos",
    imagen: "/productos/suspensiones/suspension-ejemplo.png",
    fallbackColor: "from-stone-700 to-stone-900",
    acento: "bg-emerald-500",
    href: "/catalogo?categoria=suspensiones",
  },
  {
    id: "iluminacion",
    titulo: "Iluminación",
    subtitulo: "Faros delanteros · Faros posteriores · Espejos",
    imagen: "/productos/faros-delanteros/faro-ejemplo.png",
    fallbackColor: "from-neutral-700 to-neutral-900",
    acento: "bg-amber-500",
    href: "/catalogo?categoria=faros-delanteros",
  },
];

export default function CategoriesSection() {
  return (
    <section className="bg-white py-20 px-4">

      {/* Encabezado */}
      <div className="text-center mb-14 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-12 bg-red-500" />
          <span className="text-red-500 text-xs font-bold uppercase tracking-widest">
            Catálogo
          </span>
          <div className="h-px w-12 bg-red-500" />
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight mb-4">
          Encuentra el Repuesto
          <span className="text-red-500"> que Necesitas</span>
        </h2>
        <p className="text-zinc-500 text-base">
          Más de 13,000 autopartes japonesas originales.
          Stock renovado con contenedores directos desde Japón.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categorias.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
          >
            <Link href={cat.href} className="group block h-full">
              <div className="relative h-72 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">

                {/* Imagen de fondo */}
                <div className={"absolute inset-0 bg-gradient-to-br " + cat.fallbackColor} />
                <Image
                  src={cat.imagen}
                  alt={cat.titulo}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => { e.target.style.display = "none"; }}
                />

                {/* Overlay base oscuro */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 transition-all duration-500 group-hover:from-black/90 group-hover:via-black/50" />

                {/* Línea de acento superior — aparece en hover */}
                <div className={"absolute top-0 left-0 right-0 h-1 " + cat.acento + " transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"} />

                {/* Contenido */}
                <div className="absolute inset-0 flex flex-col justify-end p-5">

                  {/* Título siempre visible */}
                  <h3 className="text-white font-black text-xl leading-tight mb-1 transition-transform duration-300 group-hover:-translate-y-1">
                    {cat.titulo}
                  </h3>

                  {/* Subtítulo */}
                  <p className="text-zinc-300 text-xs leading-relaxed mb-4 transition-all duration-300 group-hover:text-zinc-200">
                    {cat.subtitulo}
                  </p>

                  {/* Botón — sube en hover */}
                  <div className="transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className={"inline-flex items-center gap-2 text-white text-sm font-bold py-2 px-4 rounded-full " + cat.acento}>
                      Ver repuestos
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Shimmer effect en hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />

              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stats debajo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="max-w-4xl mx-auto mt-14 grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {[
          { numero: "+13,000", label: "Productos disponibles" },
          { numero: "8", label: "Marcas japonesas" },
          { numero: "100%", label: "Originales importados" },
          { numero: "1-3", label: "Meses de renovación" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-black text-zinc-900 mb-1">{stat.numero}</p>
            <p className="text-zinc-500 text-xs uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* CTA */}
      <div className="text-center mt-10">
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-8 py-3.5 rounded-full transition-all duration-300 text-sm shadow-lg hover:-translate-y-0.5"
        >
          Ver catálogo completo
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </div>
    </section>
  );
}