import type { NextConfig } from "next";

const nextConfig = {
  /* Regular config options */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },

  allowedDevOrigins: ['10.10.3.39', 'localhost:3000'],

} as any; // Casting to 'any' bypasses the "unknown property" error

export default nextConfig;