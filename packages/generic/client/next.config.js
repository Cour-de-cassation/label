module.exports = {
  transpilePackages: ['pelta-design-system'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
         config.resolve.fallback.fs = false
         config.resolve.fallback.dns = false
         config.resolve.fallback.net = false
         config.resolve.fallback.tls = false
    }

    return config;
  },
  env: {
    PUBLIC_URL: '/label'
  },
  experimental: {
    craCompat: false,
  },
  // Remove this to leverage Next.js' static image handling
  // read more here: https://nextjs.org/docs/api-reference/next/image
  images: {
    disableStaticImages: true
  }  
}
