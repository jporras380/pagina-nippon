import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const catalogoPath = join(process.cwd(), "data", "catalogo.json");

// ─── Odoo JSON-RPC helper ───────────────────────────────────────────────────
async function odooCall(model, method, args = [], kwargs = {}) {
  const url = process.env.ODOO_URL + "/web/dataset/call_kw";

  const credentials = Buffer.from(
    process.env.ODOO_USERNAME + ":" + process.env.ODOO_API_KEY
  ).toString("base64");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Basic " + credentials,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      params: {
        model,
        method,
        args,
        kwargs,
      },
    }),
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.data?.message || data.error.message);
  return data.result;
}

// ─── Test de conexión ────────────────────────────────────────────────────────
export async function GET() {
  try {
    if (!process.env.ODOO_URL || !process.env.ODOO_API_KEY) {
      return Response.json({
        ok: false,
        error: "Faltan variables de entorno: ODOO_URL y ODOO_API_KEY",
        configurado: false,
      });
    }

    // Prueba simple — cuenta productos en Odoo
    const count = await odooCall(
      "product.template",
      "search_count",
      [[["active", "=", true]]]
    );

    return Response.json({
      ok: true,
      configurado: true,
      mensaje: "Conexión exitosa con Odoo",
      total_productos_odoo: count,
      url: process.env.ODOO_URL,
      db: process.env.ODOO_DB,
    });
  } catch (e) {
    return Response.json({
      ok: false,
      error: e.message,
      configurado: !!(process.env.ODOO_URL && process.env.ODOO_API_KEY),
    });
  }
}

// ─── Sincronización ─────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { modo = "preview", limite = 100, offset = 0 } = body;

    if (!process.env.ODOO_URL || !process.env.ODOO_API_KEY) {
      return Response.json({
        ok: false,
        error: "Faltan variables de entorno. Configura ODOO_URL y ODOO_API_KEY en .env.local",
      });
    }

    // Campos que traemos de Odoo
    const campos = [
      "id", "name", "default_code", "barcode",
      "list_price", "standard_price", "active",
      "description_sale", "categ_id",
      "product_tag_ids", "image_1920",
      "qty_available", "virtual_available",
    ];

    // Busca productos activos
    const odooProductos = await odooCall(
      "product.template",
      "search_read",
      [[["active", "=", true]]],
      {
        fields: campos,
        limit: limite,
        offset,
        order: "name asc",
      }
    );

    if (modo === "preview") {
      // Solo muestra qué se sincronizaría
      return Response.json({
        ok: true,
        modo: "preview",
        total: odooProductos.length,
        muestra: odooProductos.slice(0, 5).map(p => ({
          id_odoo: p.id,
          nombre: p.name,
          codigo: p.default_code,
          precio: p.list_price,
          stock: p.qty_available,
          categoria_odoo: p.categ_id?.[1] || "",
        })),
        mensaje: "Vista previa — usa modo='sync' para aplicar cambios",
      });
    }

    if (modo === "sync") {
      const catalogoData = JSON.parse(readFileSync(catalogoPath, "utf-8"));
      const categoriasMap = {};
      catalogoData.categorias_productos.forEach(c => {
        categoriasMap[c.nombre.toLowerCase()] = c.id;
      });

      let creados = 0;
      let actualizados = 0;
      let omitidos = 0;
      const log = [];

      for (const op of odooProductos) {
        const idOdoo = "odoo-" + op.id;
        const existente = catalogoData.productos.find(
          p => p.id_odoo === op.id || p.id === idOdoo
        );

        // Intenta mapear categoría
        const catOdoo = (op.categ_id?.[1] || "").toLowerCase();
        const categoria_id = categoriasMap[catOdoo] || "otros";

        const productoNippon = {
          id: idOdoo,
          id_odoo: op.id,
          nombre: op.name?.toUpperCase() || "",
          codigo: op.default_code || "",
          sku: op.default_code || "",
          codigo_barras: op.barcode || "",
          precio_normal: op.list_price || 0,
          precio_oferta: null,
          oferta_hasta: null,
          mostrar_precio: true,
          descripcion: op.description_sale || "",
          detalle_condicion: "",
          categoria_id,
          marca_id: "",
          modelo_id: "",
          variante_id: "",
          chasis: "",
          estado: op.qty_available > 0 ? "disponible" : "agotado",
          activo: op.active,
          imagenes: [],
          unidad_id: null,
          cantidad_unidades: 1,
          motor_encendido: false,
          video_youtube: "",
          whatsapp_mensaje: "Hola, consulto por " + op.name,
          // Campos internos Odoo
          stock_odoo: op.qty_available,
          precio_costo_odoo: op.standard_price,
          ultima_sync: new Date().toISOString(),
        };

        if (existente) {
          // Actualiza precio y stock — mantiene fotos y datos locales
          const idx = catalogoData.productos.indexOf(existente);
          catalogoData.productos[idx] = {
            ...existente,
            precio_normal: op.list_price || existente.precio_normal,
            stock_odoo: op.qty_available,
            estado: op.qty_available > 0 ? "disponible" : "agotado",
            activo: op.active,
            ultima_sync: new Date().toISOString(),
          };
          actualizados++;
          log.push("✏️ Actualizado: " + op.name);
        } else {
          catalogoData.productos.push(productoNippon);
          creados++;
          log.push("✅ Creado: " + op.name);
        }
      }

      writeFileSync(catalogoPath, JSON.stringify(catalogoData, null, 2), "utf-8");

      return Response.json({
        ok: true,
        modo: "sync",
        creados,
        actualizados,
        omitidos,
        total: odooProductos.length,
        log: log.slice(0, 20),
        mensaje: "Sincronización completada",
      });
    }

    return Response.json({ ok: false, error: "Modo no válido: usa preview o sync" });

  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}