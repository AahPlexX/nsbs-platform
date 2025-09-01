/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,

  // Production optimizations
  productionBrowserSourceMaps: false,

  // Bundle optimization
  modularizeImports: {
    "@/components/ui": {
      transform: "@/components/ui/{{member}}",
      preventFullImport: true,
    },
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{kebabCase member}}",
      preventFullImport: true,
    },
  },

  // Experimental features for performance
  experimental: {
    // optimizePackageImports: ["@/components/ui", "lucide-react", "framer-motion"],
    // webpackBuildWorker: true,
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer, webpack }) => {
    // Handle client-side dependencies on server
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      }
    }

    // Global polyfills for all environments
    // config.plugins.push(
    //   new webpack.DefinePlugin({
    //     'typeof window': isServer ? '"undefined"' : '"object"',
    //     'typeof document': isServer ? '"undefined"' : '"object"',
    //     'typeof navigator': isServer ? '"undefined"' : '"object"',
    //     'typeof location': isServer ? '"undefined"' : '"object"',
    //   })
    // )

    if (!dev) {
      // Production optimizations
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk for external dependencies
            vendor: {
              name: "vendor",
              chunks: "all",
              test: /node_modules/,
              priority: 20,
            },
            // Common chunk for shared components
            common: {
              name: "common",
              chunks: "all",
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
            // UI components chunk
            ui: {
              name: "ui",
              chunks: "all",
              test: /[\\/]components[\\/]ui[\\/]/,
              priority: 30,
            },
          },
        },
      }
    }

    return config
  },

  // Headers for security and caching
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // Cache static assets for 1 year
        source: "/public/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache API responses for 1 hour with revalidation
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ]
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: "/course/:slug",
        destination: "/courses/:slug",
        permanent: true,
      },
      {
        source: "/certification/:slug",
        destination: "/courses/:slug",
        permanent: true,
      },
    ]
  },

  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // 24 hours
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Development settings
  eslint: {
    ignoreDuringBuilds: true, // Temporarily disable ESLint in builds
  },
  typescript: {
    ignoreBuildErrors: false, // Enable TypeScript checking in production builds
  },

  // Enable GZIP compression
  compress: true,

  // Power by header removal
  poweredByHeader: false,

  // Generate sitemap and robots.txt
  trailingSlash: false,

  // Environment variable validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

export default nextConfig
