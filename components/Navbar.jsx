"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/proximas-descargas", label: "Próximas Descargas" },
  { href: "/envios", label: "Envíos y Pagos" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

const WA_NUMBER = "51994006303";
const WA_MSG = "Hola, quiero consultar sobre autopartes japonesas";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navBg = scrolled || isOpen
    ? "bg-zinc-950 shadow-lg border-b border-zinc-800"
    : "bg-zinc-950/80 backdrop-blur-md";

  return (
    <nav className={"fixed top-0 left-0 right-0 z-50 transition-all duration-300 " + navBg}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="bg-white rounded-xl px-2 py-1.5 shadow-md">
              <Image
                src="/logos/logo.jpg"
                alt="NipponAutoparts"
                width={120}
                height={38}
                className="object-contain h-8 w-auto"
                priority
              />
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="relative px-4 py-2 text-sm text-zinc-300 hover:text-white font-medium transition-colors duration-200 group"
              >
                {label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-red-500 group-hover:w-4/5 transition-all duration-300 rounded-full" />
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          
          <a  href={"https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(WA_MSG)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 shadow-lg"
          >
            <Phone size={15} />
            <span>994 006 303</span>
          </a>

          {/* Mobile: WA pequeño + hamburguesa */}
          <div className="flex md:hidden items-center gap-2">
            
            <a  href={"https://wa.me/" + WA_NUMBER}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white p-2 rounded-lg shadow-lg"
            >
              <Phone size={18} />
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg transition shadow-lg"
              aria-label="Menú"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
       <div
        className={
          isOpen
            ? "md:hidden bg-zinc-950 border-t border-zinc-800 overflow-hidden transition-all duration-300"
            : "md:hidden max-h-0 overflow-hidden transition-all duration-300"
        }
      >
        <div className="flex flex-col px-4 py-4 gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className="text-zinc-200 hover:text-white hover:bg-zinc-800 px-4 py-3 rounded-lg font-medium transition-all text-sm"
            >
              {label}
            </Link>
          ))}
          
            <a href={"https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(WA_MSG)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold py-3 rounded-xl transition text-sm"
          >
            <Phone size={16} />
            Contactar por WhatsApp
          </a>
        </div>
      </div>          
    </nav>
  );
}