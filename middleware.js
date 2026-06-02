import { NextResponse } from "next/server";

const ADMIN_USER = process.env.ADMIN_USER || "nippon";
const ADMIN_PASS = process.env.ADMIN_PASS || "nippon2026";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // ← IMPORTANTE: deja pasar el login y el API de login sin verificar
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/admin/login") ||
    pathname.startsWith("/api/admin/logout")
  ) {
    return NextResponse.next();
  }

  // Solo protege /admin
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Revisa la cookie de sesión
  const sesion = request.cookies.get("admin_sesion")?.value;
  if (sesion === "autorizado") {
    return NextResponse.next();
  }

  // No está autenticado → redirige al login
  const loginUrl = new URL("/admin/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};