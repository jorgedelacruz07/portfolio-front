const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: [
      "@heroicons/react",
      "lucide-react",
      "framer-motion",
      "date-fns",
      "@tanstack/react-query"
    ],
    optimizeCss: true, // Enable critical CSS optimization
  },

  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
    loader: "default",
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
    // Remove React DevTools in production
    reactRemoveProperties: process.env.NODE_ENV === "production",
  },

  // Headers for better caching
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
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
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/documents/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Fallback for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        process: false,
        path: false,
        os: false,
        url: false,
        querystring: false,
        http: false,
        https: false,
        zlib: false,
        assert: false,
        constants: false,
        _stream_duplex: false,
        _stream_passthrough: false,
        _stream_readable: false,
        _stream_transform: false,
        _stream_writable: false,
      };
    }

    return config;
  },

  // Enable compression
  compress: true,

  // Power optimization
  poweredByHeader: false,
};

module.exports = withBundleAnalyzer(nextConfig);
