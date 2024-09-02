/** @type {import('next').NextConfig} */

const nextConfig = {
    webpack: (config) => {
      config.externals.push('pino-pretty', 'lokijs', 'encoding');
      return config;
    },
    images: {
      domains: ['api.xyznt.io'], // Tambahkan domain yang diizinkan
    },
  };
  
  export default nextConfig;
  