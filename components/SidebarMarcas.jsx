"use client";
import Image from "next/image";
import Link from "next/link";

export default function SidebarMarcas({ marcas }) {
  return (
    <aside className="hidden xl:block w-52 flex-shrink-0">
      <div className="sticky top-24">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 px-2">
          Otras marcas
        </p>
        <div className="flex flex-col gap-1">
          {marcas.map((m) => (
            <Link
              key={m.id}
              href={"/marcas/" + m.id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition group"
            >
              <div className="w-9 h-9 bg-gray-100 group-hover:bg-white rounded-lg p-1.5 border border-gray-200 flex-shrink-0 transition">
                <Image
                  src={m.logo}
                  alt={m.nombre}
                  width={32}
                  height={32}
                  className="object-contain w-full h-full"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
              <span className="text-sm text-zinc-600 group-hover:text-zinc-900 font-medium transition">
                {m.nombre}
              </span>
            </Link>
          ))}
        </div>
      </div>  
     </aside>
    
  );
}