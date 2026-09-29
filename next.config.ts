import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 記事一覧はトップページに移したため、旧URL（/blog）へのアクセスはトップへ転送する
  async redirects() {
    return [
      {
        source: "/blog",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
