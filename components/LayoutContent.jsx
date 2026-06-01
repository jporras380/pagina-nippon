"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutContent({ children }) {
  const pathname = usePathname();

  // Admin no usa Navbar ni Footer públicos
  const esAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!esAdmin && <Navbar />}
      {children}
      {!esAdmin && <Footer />}
    </>
  );
}