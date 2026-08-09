import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  // Next 14 exposes this under experimental.turbo. The top-level `turbopack`
  // key belongs to newer Next versions and is ignored by this project.
  experimental: {
    turbo: {
      root: process.cwd()
    }
  },
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true
};

export default withNextIntl(nextConfig);
