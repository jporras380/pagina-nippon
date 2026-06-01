import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const catalogoPath = join(process.cwd(), "data", "catalogo.json");

function leerCatalogo() {
  return JSON.parse(readFileSync(catalogoPath, "utf-8"));
}
function guardarCatalogo(data) {
  writeFileSync(catalogoPath, JSON.stringify(data, null, 2), "utf-8");
}

// POST — crear marca
export async function POST(request) {
  try {
    const body = await request.json();
    const data = leerCatalogo();

    if (data.marcas.find((m) => m.id === body.id)) {
      return Response.json({ ok: false, error: "Ya existe una marca con ese ID" }, { status: 400 });
    }

    const nueva = {
      id: body.id,
      nombre: body.nombre,
      logo: body.logo || "",
      imagen_hero: body.imagen_hero || "",
      descripcion: body.descripcion || "",
      activo: true,
      modelos: [],
    };

    data.marcas.push(nueva);
    guardarCatalogo(data);
    return Response.json({ ok: true, marca: nueva });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}