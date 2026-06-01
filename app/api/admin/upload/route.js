import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, extname } from "path";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const archivo = formData.get("archivo");
    const carpeta = formData.get("carpeta") || "productos/OTROS";

    if (!archivo) return Response.json({ ok: false, error: "No se recibió archivo" }, { status: 400 });

    const bytes = await archivo.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validar que sea imagen
    const ext = extname(archivo.name).toLowerCase();
    const extensionesPermitidas = [".jpg", ".jpeg", ".png", ".webp"];
    if (!extensionesPermitidas.includes(ext)) {
      return Response.json({ ok: false, error: "Solo se permiten imágenes JPG, PNG o WebP" }, { status: 400 });
    }

    // Crear carpeta si no existe
    const carpetaCompleta = join(process.cwd(), "public", carpeta);
    if (!existsSync(carpetaCompleta)) {
      mkdirSync(carpetaCompleta, { recursive: true });
    }

    // Nombre único con timestamp
    const timestamp = Date.now();
    const nombreArchivo = timestamp + "-" + archivo.name.replace(/\s+/g, "-").toLowerCase();
    const rutaCompleta = join(carpetaCompleta, nombreArchivo);

    writeFileSync(rutaCompleta, buffer);

    const rutaPublica = "/" + carpeta.replace(/\\/g, "/") + "/" + nombreArchivo;

    return Response.json({ ok: true, ruta: rutaPublica, nombre: nombreArchivo });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}