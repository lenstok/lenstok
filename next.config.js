/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "ipfs.infura.io",
      "statics-polygon-lens-staging.s3.eu-west-1.amazonaws.com",
      "lens.infura-ipfs.io",
      "source.unsplash.com",
      "ipfs://",
      "avatar.tobi.sh",
      "statics-mumbai-lens-staging.s3.eu-west-1.amazonaws.com",
      "avatars.dicebear.com",
      "cdn.stamp.fyi",
    ],
  },
};

module.exports = nextConfig;
