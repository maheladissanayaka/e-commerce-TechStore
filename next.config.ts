import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Example: if you use Cloudinary for product images
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // Useful for testing/placeholder images
      },
      // Add your specific image host here (e.g., AWS S3 bucket)
    ],
  },
};

export default nextConfig;