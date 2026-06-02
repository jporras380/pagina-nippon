import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const path = join(process.cwd(), "data", "catalogo.json");

export async function GET() {
  try {
    const data = JSON.parse(readFileSync(path, "utf-8"));
    return Response.json({ ok: true, data });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    writeFileSync(path, JSON.stringify(body, null, 2), "utf-8");
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}