import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // AVIF e WebP são servidos automaticamente pela Vercel a partir dos PNG originais.
    // As fotos do Victor têm 1600x1600 e fundo transparente — sem isso pesariam ~1,5 MB cada.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
