import { cookies } from 'next/headers';

// 토큰 가져오기 (서버 측)
export const getToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get('accessToken')?.value;
};

// 로그인 상태 확인 (서버 측)
export const isAuthenticated = async () => {
  return !!(await getToken());
}; 