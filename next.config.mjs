/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
      },
    images: {
        domains: [
            "utfs.io",
            "img.clerk.com"
        ]
    }
};

export default nextConfig;
