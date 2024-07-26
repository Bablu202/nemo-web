/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["unsplash.com", "lcbdwqmmcmbjafecnosw.supabase.co"],
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
