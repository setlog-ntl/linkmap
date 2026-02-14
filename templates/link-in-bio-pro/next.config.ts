import type { NextConfig } from 'next';

const repoName = process.env.NEXT_PUBLIC_REPO_NAME || '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: repoName ? `/${repoName}` : '',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
