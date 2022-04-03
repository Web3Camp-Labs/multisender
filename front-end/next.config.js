/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  reactStrictMode: true,
  experimental:{
    styledCompontents:true
  },
  // assetPrefix: isProd ?'/batch-query':'',
}

module.exports = nextConfig
