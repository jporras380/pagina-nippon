/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // ← ignora errores de ESLint al hacer build
  },
};

 export default nextConfig;
 