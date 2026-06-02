import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const promosPath = join(process.cwd(), "data", "promos.json");

export async function GET() {
  try {
    const data = JSON.parse(readFileSync(promosPath, "utf-8"));
    return Response.json({ ok: true, data });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    writeFileSync(promosPath, JSON.stringify(body, null, 2), "utf-8");
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}