import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/file/d/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },{
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;