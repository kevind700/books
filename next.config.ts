import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    SERVER_JSON_HOST: process.env.SERVER_JSON_HOST,
  },
};

export default nextConfig;
