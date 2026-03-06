/** @type {import('next').NextConfig} */

// Uncomment when using Contentlayer:
// const { withContentlayer } = require('next-contentlayer')

const nextConfig = {
  // Turbopack is now default in Next.js 16
  // No need to explicitly enable it

  // Image configuration (add your CMS domain when migrating)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS images (restrict in production)
      },
    ],
    // Add specific domains for production:
    // domains: ['your-strapi.com', 'cdn.sanity.io'],
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Redirects (add as needed)
  async redirects() {
    return [
      // Example: redirect old blog path
      // {
      //   source: '/old-blog/:slug',
      //   destination: '/blog/:slug',
      //   permanent: true,
      // },
    ]
  },
}

// When using Contentlayer, wrap config:
// module.exports = withContentlayer(nextConfig)

module.exports = nextConfig
