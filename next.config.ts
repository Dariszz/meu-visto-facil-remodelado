import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Preserva as instruções do repositório durante next dev.
  agentRules: false,
};

export default nextConfig;
