import catalogoData from "../../../data/catalogo.json";
import ProductDetailClient from "../../../components/ProductDetailClient.jsx";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return catalogoData.productos.map((p) => ({ producto: p.id }));
}

export async function generateMetadata({ params }) {
  const { producto: productoId } = await params;
  const producto = catalogoData.productos.find((p) => p.id === productoId);
  return {
    title: (producto?.nombre || "Producto") + " — NipponAutoparts",
    description: producto?.descripcion || "",
  };
}

export default async function ProductoPage({ params }) {
  const { producto: productoId } = await params;
  const producto = catalogoData.productos.find((p) => p.id === productoId);

  if (!producto) notFound();

  const marca = catalogoData.marcas.find((m) => m.id === producto.marca_id);
  const modelo = marca?.modelos.find((m) => m.id === producto.modelo_id);
  const categoria = catalogoData.categorias_productos.find((c) => c.id === producto.categoria_id);

  // Productos relacionados: misma categoría o mismo modelo, excluyendo el actual
  const relacionados = catalogoData.productos
    .filter((p) =>
      p.activo &&
      p.id !== producto.id &&
      (p.categoria_id === producto.categoria_id || p.modelo_id === producto.modelo_id)
    )
    .slice(0, 8);

  return (
    <ProductDetailClient
      producto={producto}
      marca={marca}
      modelo={modelo}
      categoria={categoria}
      relacionados={relacionados}
      todasMarcas={catalogoData.marcas}
      todasCategorias={catalogoData.categorias_productos}
    />
  );
}