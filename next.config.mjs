/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "pastel-heron-61.convex.cloud", 
            },
            {
                hostname: "flowbite.s3.amazonaws.com", 
            },
            {
                hostname: "w3.org", 
            },
        ]
    }
};

export default nextConfig;
