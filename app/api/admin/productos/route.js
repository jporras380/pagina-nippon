import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const catalogoPath = join(process.cwd(), "data", "catalogo.json");

function leerCatalogo() {
  return JSON.parse(readFileSync(catalogoPath, "utf-8"));
}

function guardarCatalogo(data) {
  writeFileSync(catalogoPath, JSON.stringify(data, null, 2), "utf-8");
}

// GET — listar productos
export async function GET() {
  try {
    const data = leerCatalogo();
    return Response.json({ ok: true, productos: data.productos });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}

// POST — crear producto
export async function POST(request) {
  try {
    const body = await request.json();
    const data = leerCatalogo();

    const nuevo = {
      id: body.id || "prod-" + Date.now(),
      activo: body.activo ?? true,
      marca_id: body.marca_id || "",
      modelo_id: body.modelo_id || "",
      categoria_id: body.categoria_id || "",
      nombre: body.nombre || "",
      descripcion: body.descripcion || "",
      detalle_condicion: body.detalle_condicion || "",
      codigo: body.codigo || "",
      sku: body.sku || "",
      precio_normal: Number(body.precio_normal) || 0,
      precio_oferta: body.precio_oferta ? Number(body.precio_oferta) : null,
      oferta_hasta: body.oferta_hasta || null,
      mostrar_precio: body.mostrar_precio ?? true,
      estado: body.estado || "disponible",
      imagenes: body.imagenes || [],
      unidad_id: body.unidad_id || null,
      whatsapp_mensaje: body.whatsapp_mensaje || "Hola, consulto por " + body.nombre,
    };

    data.productos.push(nuevo);
    guardarCatalogo(data);

    return Response.json({ ok: true, producto: nuevo });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}