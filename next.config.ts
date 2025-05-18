import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")], // @use "variables.scss" as *;
  },
};

export default nextConfig;
