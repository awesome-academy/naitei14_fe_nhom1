import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'res.cloudinary.com',
  //       port: '',
  //       pathname: '/**',
  //     },
  //   ],
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**', // Allows loading images from any path on this domain
      },
      // You can add more external domains here if needed
    ],
  },
};
  /* config options here */
  typescript: {
    // ignoreBuildErrors removed to enforce type safety
  },
};

export default nextConfig;
