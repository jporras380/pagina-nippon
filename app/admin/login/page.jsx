"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, pass }),
    });
    const data = await res.json();

    if (data.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Usuario o contraseña incorrectos");
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl w-full max-w-sm overflow-hidden">

        {/* Header rojo */}
        <div className="bg-red-600 px-6 py-8 text-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Image
              src="/logos/logo.jpg"
              alt="NipponAutoparts"
              width={48}
              height={48}
              className="object-contain w-10 h-10"
            />
          </div>
          <h1 className="text-white font-black text-xl">Panel Admin</h1>
          <p className="text-red-200 text-sm mt-1">NipponAutoparts</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="px-6 py-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              Usuario
            </label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="nippon"
              autoComplete="username"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs font-semibold text-center">
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando || !user || !pass}
            className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-black py-3.5 rounded-2xl text-sm transition shadow-lg shadow-red-100"
          >
            {cargando ? "Verificando..." : "Entrar al panel"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-xs pb-4">
          Solo para uso interno de NipponAutoparts
        </p>
      </div>
    </div>
  );
}