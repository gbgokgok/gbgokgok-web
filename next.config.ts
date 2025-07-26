import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    IS_LOCAL_ENV: process.env.NODE_ENV === 'development' ? 'true' : 'false',
  },
};

export default nextConfig;
