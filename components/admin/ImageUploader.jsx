"use client";
import { useState, useRef } from "react";

export default function ImageUploader({ carpeta = "productos/OTROS", onSubida }) {
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);

  const subirArchivo = async (archivo) => {
    if (!archivo) return;
    setSubiendo(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("archivo", archivo);
      formData.append("carpeta", carpeta);

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!data.ok) throw new Error(data.error);
      onSubida(data.ruta);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubiendo(false);
    }
  };

  const handleFiles = (files) => {
    Array.from(files).forEach((f) => subirArchivo(f));
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={"border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all " +
          (drag ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-red-300 hover:bg-gray-50")}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {subiendo ? (
          <div className="flex flex-col items-center gap-2">
            <svg className="animate-spin w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
              <path d="M12 2a10 10 0 0110 10" strokeLinecap="round"/>
            </svg>
            <p className="text-gray-500 text-sm">Subiendo imagen...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gray-400">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <p className="text-gray-600 text-sm font-semibold">
              Arrastra imágenes aquí o <span className="text-red-500">haz click</span>
            </p>
            <p className="text-gray-400 text-xs">JPG, PNG, WebP · Múltiples archivos permitidos</p>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">⚠️ {error}</p>}
    </div>
  );
}