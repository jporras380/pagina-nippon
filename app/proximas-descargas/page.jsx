import { readFileSync } from "fs";
import { join } from "path";
import ProximasDescargasClient from "../../components/ProximasDescargasClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Próximas Descargas — NipponAutoparts",
  description: "Autos y autopartes japonesas en camino. Reserva antes de que lleguen.",
};

export default function ProximasDescargasPage() {
  // Lee SIEMPRE el archivo actualizado — nunca usa caché
  const catalogoData = JSON.parse(
    readFileSync(join(process.cwd(), "data", "catalogo.json"), "utf-8")
  );
  const descargasData = JSON.parse(
    readFileSync(join(process.cwd(), "data", "descargas.json"), "utf-8")
  );

  const unidadesEnCamino = [];
  catalogoData.marcas?.forEach((marca) => {
    marca.modelos?.forEach((modelo) => {
      modelo.unidades?.forEach((unidad) => {
        if (unidad.estado_unidad === "proxima-descarga") {
          unidadesEnCamino.push({
            ...unidad,
            marca_nombre: marca.nombre,
            marca_logo: marca.logo,
            marca_id: marca.id,
            modelo_nombre: modelo.nombre,
            modelo_id: modelo.id,
            modelo_chasis: modelo.chasis,
            modelo_imagen: modelo.imagen,
          });
        }
      });
    });
  });

  const contenedores = descargasData.contenedores
    ?.filter((c) => c.activo)
    .map((cont) => ({
      ...cont,
      autos: unidadesEnCamino.filter(
        (u) => u.contenedor === cont.numero_contenedor
      ),
    })) || [];

  const sinContenedor = unidadesEnCamino.filter((u) => !u.contenedor);
  if (sinContenedor.length > 0) {
    contenedores.push({
      id: "sin-contenedor",
      titulo: "Próximas llegadas",
      descripcion: "Autos reservados para el próximo lote",
      fecha_llegada: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      numero_contenedor: "",
      estado: "en-camino",
      autos: sinContenedor,
    });
  }

  const catalogoProductos = catalogoData.productos || [];

  return (
    <ProximasDescargasClient
      contenedores={contenedores}
      productos={catalogoProductos}
    />
  );
}