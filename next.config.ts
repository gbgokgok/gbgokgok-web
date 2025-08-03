import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    IS_LOCAL_ENV: process.env.NODE_ENV === 'development' ? 'true' : 'false',
  },
  // 컨테이너 환경에서 올바른 호스트 이름 사용을 위한 설정
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX,
  // 서버 외부 패키지 설정 (필요한 경우)
  serverExternalPackages: [],
};

export default nextConfig;
