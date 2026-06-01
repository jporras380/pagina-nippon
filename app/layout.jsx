import "./globals.css";
import LayoutContent from "../components/LayoutContent";
import Script from "next/script";

export const metadata = {
  title: {
    default: "NipponAutoparts — Autopartes Japonesas en Lima",
    template: "%s — NipponAutoparts",
  },
  description: "Importadores directos de autopartes japonesas. Motores, cajas, carrocería y más. Stock permanente en Lima, Perú.",
  keywords: ["autopartes japonesas", "motores japoneses", "lima peru", "toyota", "nissan", "probox"],
  authors: [{ name: "NipponAutoparts S.R.L." }],
  creator: "NipponAutoparts",
  icons: {
    icon: "/logos/icon.jpg",
    apple: "/logos/icon.jpg",
  },
  openGraph: {
    title: "NipponAutoparts — Autopartes Japonesas en Lima",
    description: "Importadores directos de autopartes japonesas originales.",
    url: "https://nipponautoparts.com.pe",
    siteName: "NipponAutoparts",
    images: [{ url: "/logos/icon.jpg", width: 400, height: 400 }],
    locale: "es_PE",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-white text-zinc-900 min-h-screen font-sans">
        <LayoutContent>
          {children}
        </LayoutContent>
        <Script
          id="kommo-crm"
          src="/kommo.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}