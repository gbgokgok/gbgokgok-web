import { cookies } from 'next/headers';

// 현재 환경이 로컬인지 확인
const isLocalEnv = process.env.IS_LOCAL_ENV === 'true';

// 토큰 가져오기 (서버 측)
export const getToken = async () => {
  const cookieStore = await cookies();
  const tokenName = isLocalEnv ? 'serverAccessToken' : 'accessToken';
  return cookieStore.get(tokenName)?.value;
};

// 로그인 상태 확인 (서버 측)
export const isAuthenticated = async () => {
  return !!(await getToken());
}; 