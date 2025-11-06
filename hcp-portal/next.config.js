module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Expose THEME_V2 environment variable to client-side
  env: {
    THEME_V2: process.env.THEME_V2 || process.env.NEXT_PUBLIC_THEME_V2 || 'false',
  },
}
