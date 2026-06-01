import { cookies } from "next/headers";

const ADMIN_USER = "nippon";
const ADMIN_PASS = "nippon2026";

export async function POST(request) {
  try {
    const { user, pass } = await request.json();

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      const cookieStore = await cookies();
      cookieStore.set("admin_sesion", "autorizado", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 días
        path: "/",
      });
      return Response.json({ ok: true });
    }

    return Response.json({ ok: false }, { status: 401 });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}