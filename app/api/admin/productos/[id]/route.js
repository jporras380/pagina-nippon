import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const catalogoPath = join(process.cwd(), "data", "catalogo.json");

function leerCatalogo() {
  return JSON.parse(readFileSync(catalogoPath, "utf-8"));
}

function guardarCatalogo(data) {
  writeFileSync(catalogoPath, JSON.stringify(data, null, 2), "utf-8");
}

// PUT — actualizar producto
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = leerCatalogo();

    const idx = data.productos.findIndex((p) => p.id === id);
    if (idx === -1) return Response.json({ ok: false, error: "No encontrado" }, { status: 404 });

    data.productos[idx] = {
      ...data.productos[idx],
      ...body,
      precio_normal: Number(body.precio_normal) || 0,
      precio_oferta: body.precio_oferta ? Number(body.precio_oferta) : null,
      oferta_hasta: body.oferta_hasta || null,
      imagenes: body.imagenes || [],
    };

    guardarCatalogo(data);
    return Response.json({ ok: true, producto: data.productos[idx] });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}

// DELETE — eliminar producto
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const data = leerCatalogo();

    const idx = data.productos.findIndex((p) => p.id === id);
    if (idx === -1) return Response.json({ ok: false, error: "No encontrado" }, { status: 404 });

    data.productos.splice(idx, 1);
    guardarCatalogo(data);

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}