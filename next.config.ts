import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    transpilePackages: ['@react-three/fiber', 'three', '@react-three/drei']
};

export default nextConfig;
