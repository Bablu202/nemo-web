/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["unsplash.com"],
  },
  async rewrites() {
    return [
      {
        source: "/auth/callback",
        destination: "/api/auth/v1/callback",
      },
    ];
  },
};

export default nextConfig;
