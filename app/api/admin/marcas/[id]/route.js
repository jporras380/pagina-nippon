import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const catalogoPath = join(process.cwd(), "data", "catalogo.json");
function leerCatalogo() { return JSON.parse(readFileSync(catalogoPath, "utf-8")); }
function guardarCatalogo(data) { writeFileSync(catalogoPath, JSON.stringify(data, null, 2), "utf-8"); }

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = leerCatalogo();

    const idx = data.marcas.findIndex((m) => m.id === id);
    if (idx === -1) return Response.json({ ok: false, error: "Marca no encontrada" }, { status: 404 });

    // Agregar modelo
    if (body.agregar_modelo) {
      if (data.marcas[idx].modelos.find((m) => m.id === body.modelo.id)) {
        return Response.json({ ok: false, error: "Ya existe un modelo con ese ID" }, { status: 400 });
      }
      data.marcas[idx].modelos.push(body.modelo);

    // Agregar unidad
    } else if (body.agregar_unidad) {
      const modeloIdx = data.marcas[idx].modelos.findIndex((m) => m.id === body.modelo_id);
      if (modeloIdx === -1) return Response.json({ ok: false, error: "Modelo no encontrado" }, { status: 404 });
      if (!data.marcas[idx].modelos[modeloIdx].unidades) {
        data.marcas[idx].modelos[modeloIdx].unidades = [];
      }
      data.marcas[idx].modelos[modeloIdx].unidades.push(body.unidad);

    // Actualizar unidad (toggle activo / editar)
    } else if (body.actualizar_unidad) {
      const modeloIdx = data.marcas[idx].modelos.findIndex((m) => m.id === body.modelo_id);
      if (modeloIdx === -1) return Response.json({ ok: false, error: "Modelo no encontrado" }, { status: 404 });
      const unidadIdx = data.marcas[idx].modelos[modeloIdx].unidades?.findIndex((u) => u.id === body.unidad_id);
      if (unidadIdx === -1 || unidadIdx === undefined) return Response.json({ ok: false, error: "Unidad no encontrada" }, { status: 404 });
      data.marcas[idx].modelos[modeloIdx].unidades[unidadIdx] = {
        ...data.marcas[idx].modelos[modeloIdx].unidades[unidadIdx],
        ...body.cambios,
      };

    // Eliminar unidad
    } else if (body.eliminar_unidad) {
      const modeloIdx = data.marcas[idx].modelos.findIndex((m) => m.id === body.modelo_id);
      if (modeloIdx === -1) return Response.json({ ok: false, error: "Modelo no encontrado" }, { status: 404 });
      data.marcas[idx].modelos[modeloIdx].unidades =
        data.marcas[idx].modelos[modeloIdx].unidades?.filter((u) => u.id !== body.unidad_id) || [];

      // Desvincular productos que tenían esa unidad
      data.productos = data.productos.map((p) =>
        p.unidad_id === body.unidad_id ? { ...p, unidad_id: null } : p
      );

    // Actualizar datos de la marca
    } else {
      data.marcas[idx] = {
        ...data.marcas[idx],
        nombre: body.nombre || data.marcas[idx].nombre,
        logo: body.logo ?? data.marcas[idx].logo,
        imagen_hero: body.imagen_hero ?? data.marcas[idx].imagen_hero,
        descripcion: body.descripcion ?? data.marcas[idx].descripcion,
      };
    }

    guardarCatalogo(data);
    return Response.json({ ok: true, marca: data.marcas[idx] });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}