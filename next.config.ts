/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript xatolarini build paytida tekshirmaslik uchun
  typescript: {
    ignoreBuildErrors: true,
  },
  // ESLint xatolarini build paytida o'tkazib yuborish uchun
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Build qilingan fayllar uchun papka nomi
  distDir: '.next',
  // Eksport xatolarini yumshatish va ba'zi modullarni o'tkazib yuborish uchun
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};

export default nextConfig;
