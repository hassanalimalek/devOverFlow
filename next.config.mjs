/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", domain: "*" },
      { protocol: "http", domain: "*" },
    ],
  },
};

export default nextConfig;
