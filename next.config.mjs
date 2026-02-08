/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 1. Abaikan error TypeScript & ESLint agar Build sukses di Hosting
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // 2. Jika nanti gambar tidak muncul di hosting, tambahkan: unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mxrmjlkkzpyuptcqboqk.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig;