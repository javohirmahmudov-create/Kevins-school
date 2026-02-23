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
};

export default nextConfig;
