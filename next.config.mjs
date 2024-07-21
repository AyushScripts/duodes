/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "pastel-heron-61.convex.cloud",
            }
        ]
    }
};

export default nextConfig;
