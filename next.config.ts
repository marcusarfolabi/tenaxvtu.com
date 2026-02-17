import type { NextConfig } from "next";

const nextConfig = {
  /* Regular config options */
  poweredByHeader: false,  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },

} as any; 

export default nextConfig;