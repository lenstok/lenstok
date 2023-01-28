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
      "cdn.stamp.fyi",
      "avatars.dicebear.com",
      "assets.lenster.xyz",
      "as1.ftcdn.net",
      "avataaars.io",
      "theshr.infura-ipfs.io",
      "test.com",
      "ui-avatars.com",
      "bafybeifiw5y4fowyuonetx3u3pufj5y46b3e5zkr4ld25u4et2n4opueni.ipfs.w3s.link",
      "statics-polygon-lens.s3.eu-west-1.amazonaws.com"
    ],
  },
};

module.exports = nextConfig;
