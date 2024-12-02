import dotenv from "dotenv";

dotenv.config();

const staticBuildEnabled = process.env.STATIC_BUILD_ENABLED === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  output: staticBuildEnabled ? "export" : undefined,
};

export default nextConfig;
