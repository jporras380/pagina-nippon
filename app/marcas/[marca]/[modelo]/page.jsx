import catalogoData from "../../../../data/catalogo.json";
import ModeloShowcase from "../../../../components/ModeloShowcase";

export async function generateStaticParams() {
  const params = [];
  catalogoData.marcas.forEach((marca) => {
    marca.modelos.forEach((modelo) => {
      params.push({ marca: marca.id, modelo: modelo.id });
    });
  });
  return params;
}

export async function generateMetadata({ params }) {
  const { marca: marcaId, modelo: modeloId } = await params;
  const marca = catalogoData.marcas.find((m) => m.id === marcaId);
  const modelo = marca?.modelos.find((m) => m.id === modeloId);
  return {
    title: (modelo?.nombre || "Modelo") + " " + (marca?.nombre || "") + " — NipponAutoparts",
    description: "Autopartes originales para " + modelo?.nombre + " " + marca?.nombre,
  };
}

export default async function ModeloPage({ params }) {
  const { marca: marcaId, modelo: modeloId } = await params;
  const marca = catalogoData.marcas.find((m) => m.id === marcaId);
  const modelo = marca?.modelos.find((m) => m.id === modeloId);

  const productos = catalogoData.productos.filter(
    (p) => p.activo && p.marca_id === marcaId && p.modelo_id === modeloId
  );

  if (!marca || !modelo) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-zinc-500">Modelo no encontrado</p>
      </div>
    );
  }

  return (
    <ModeloShowcase
      marca={marca}
      modelo={modelo}
      productos={productos}
      categorias={catalogoData.categorias_productos}
    />
  );
}