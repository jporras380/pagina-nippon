import { Suspense } from "react";
import catalogoData from "../../data/catalogo.json";
import CatalogoClient from "../../components/CatalogoClient";

export const metadata = {
  title: "Catálogo de Autopartes — NipponAutoparts",
  description: "Más de 13,000 autopartes japonesas originales.",
};

export default function CatalogoPage() {
  // Recolecta IDs de unidades con estado proxima-descarga
  const unidadesProximas = new Set();
  catalogoData.marcas?.forEach((m) => {
    m.modelos?.forEach((mod) => {
      mod.unidades?.forEach((u) => {
        if (u.estado_unidad === "proxima-descarga") {
          unidadesProximas.add(u.id);
        }
      });
    });
  });

  // Filtra productos:
  // - Si unidad_id es null → aparece (pertenece a todos los colores disponibles)
  // - Si unidad_id apunta a una unidad proxima-descarga → NO aparece
  const productosFiltrados = catalogoData.productos.filter((p) => {
    if (!p.activo) return false;
    if (p.unidad_id && unidadesProximas.has(p.unidad_id)) return false;
    return true;
  });

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CatalogoClient
        productos={productosFiltrados}
        marcas={catalogoData.marcas}
        categorias={catalogoData.categorias_productos}
      />
    </Suspense>
  );
}