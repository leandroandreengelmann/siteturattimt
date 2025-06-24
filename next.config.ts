import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurações para produção na Vercel
  output: "standalone",

  // Configurações de imagem para Supabase
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // Configurações de build otimizadas
  experimental: {
    optimizeCss: true,
  },

  // Configurações de headers para performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
