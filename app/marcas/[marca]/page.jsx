import { readFileSync } from "fs";
import { join } from "path";
import Image from "next/image";
import Link from "next/link";
import ModelCard from "../../../components/ModelCard";
import SidebarMarcas from "../../../components/SidebarMarcas";

export const dynamic = "force-dynamic";

// Lee el catálogo fresco en cada función
function getCatalogo() {
  return JSON.parse(
    readFileSync(join(process.cwd(), "data", "catalogo.json"), "utf-8")
  );
}

export function generateStaticParams() {
  const catalogoData = getCatalogo();
  return catalogoData.marcas.map((m) => ({ marca: m.id }));
}

export async function generateMetadata({ params }) {
  const catalogoData = getCatalogo();
  const { marca: marcaId } = await params;
  const marca = catalogoData.marcas.find((m) => m.id === marcaId);
  return {
    title: (marca?.nombre || "Marca") + " — NipponAutoparts",
    description: marca?.descripcion || "",
  };
}

export default async function MarcaPage({ params }) {
  const catalogoData = getCatalogo();
  const { marca: marcaId } = await params;
  const marca = catalogoData.marcas.find((m) => m.id === marcaId);
  const otrasMarcas = catalogoData.marcas.filter(
    (m) => m.id !== marcaId && m.activo);
 

  if (!marca) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-zinc-500">Marca no encontrada</p>
    </div>
  );


  

  const modelos = marca.modelos.filter((m) => m.activo);

  return (
    <div className="bg-white min-h-screen">

      {/* Hero de la marca */}
      <div className="relative h-64 md:h-80 bg-zinc-950 overflow-hidden">
        <Image
          src={marca.imagen_hero}
          alt={marca.nombre}
          fill
          sizes="100vw"
          className="object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/60 to-transparent" />
        <div className="relative z-10 h-full flex items-center px-6 md:px-12 max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="bg-white rounded-2xl p-3 shadow-xl flex-shrink-0">
              <Image
                src={marca.logo}
                alt={marca.nombre}
                width={72}
                height={72}
                className="object-contain w-16 h-16"
                
              />
            </div>
            <div>
              <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-1">
                Autopartes originales
              </p>
              <h1 className="text-white font-black text-4xl md:text-5xl tracking-tight mb-2">
                {marca.nombre}
              </h1>
              <p className="text-zinc-300 text-sm max-w-lg">{marca.descripcion}</p>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="absolute bottom-4 left-6 md:left-12 flex items-center gap-2 text-zinc-500 text-xs">
          <Link href="/" className="hover:text-white transition">Inicio</Link>
          <span>/</span>
          <Link href="/catalogo" className="hover:text-white transition">Catálogo</Link>
          <span>/</span>
          <span className="text-zinc-300">{marca.nombre}</span>
        </div>
      </div>
            {/* Mobile: scroll horizontal de marcas */}
<div className="xl:hidden overflow-x-auto border-b border-gray-100 bg-white">
  <div className="flex gap-4 px-4 py-4 w-max">
    {otrasMarcas.map((m) => (
      <Link
        key={m.id}
        href={"/marcas/" + m.id}
        className="flex flex-col items-center gap-1.5 group flex-shrink-0"
      >
        <div className="w-12 h-12 bg-gray-100 group-hover:bg-white rounded-xl p-2 border border-gray-200 transition">
          <Image
            src={m.logo}
            alt={m.nombre}
            width={40}
            height={40}
            className="object-contain w-full h-full"
          />
        </div>
        <span className="text-xs text-zinc-500 whitespace-nowrap">{m.nombre}</span>
      </Link>
    ))}
  </div>
</div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">

          {/* Sidebar marcas */}
          <SidebarMarcas marcas={otrasMarcas} />

          {/* Contenido principal */}


          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-zinc-900">
  Modelos disponibles
</h2>
<p className="text-zinc-500 text-sm mt-1">
  {modelos.length} modelos — click para ver autopartes
</p>
              </div>
              <Link
                href="/catalogo"
                className="hidden sm:flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-semibold transition"
              >
                Ver todo el catálogo
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </Link>
            </div>

            {/* Grid de modelos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {modelos.map((modelo, i) => (
                <ModelCard
                  key={modelo.id}
                  modelo={modelo}
                  marcaId={marca.id}
                  index={i}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
     </div>
  );
}