'use client';

// 현재 환경이 로컬인지 확인
const isLocalEnv = process.env.IS_LOCAL_ENV === 'true';

// 토큰 저장 (클라이언트 측)
export const setTokens = (accessToken: string, refreshToken?: string) => {
  // 로컬 환경에서는 토큰 이름을 구분하여 저장
  const tokenName = isLocalEnv ? 'serverAccessToken' : 'accessToken';
  const refreshTokenName = isLocalEnv ? 'serverRefreshToken' : 'refreshToken';
  
  document.cookie = `${tokenName}=${accessToken}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax;`;
  
  if (refreshToken) {
    document.cookie = `${refreshTokenName}=${refreshToken}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax;`;
  }
};

// 토큰 삭제 (로그아웃)
export const removeTokens = () => {
  // 로컬 환경에서는 두 종류의 토큰을 모두 삭제
  if (isLocalEnv) {
    document.cookie = 'serverAccessToken=; path=/; max-age=0;';
    document.cookie = 'serverRefreshToken=; path=/; max-age=0;';
    // Cloudflare 토큰은 유지 (필요한 경우)
  } else {
    document.cookie = 'accessToken=; path=/; max-age=0;';
    document.cookie = 'refreshToken=; path=/; max-age=0;';
  }
};

// 쿠키에서 특정 값 가져오기 (클라이언트 측)
export const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

// 클라이언트 측에서 토큰 가져오기
export const getClientToken = () => {
  const tokenName = isLocalEnv ? 'serverAccessToken' : 'accessToken';
  return getCookie(tokenName);
};

// 클라이언트 측에서 로그인 상태 확인
export const isClientAuthenticated = () => {
  return !!getClientToken();
};

// 로그인 후 리다이렉션 처리
export const handleAuthRedirect = (data: { accessToken: string; refreshToken?: string; isSignupRequired: boolean }) => {
  // 회원가입이 필요한 경우, 토큰을 쿠키에 저장하지 않고 URL 파라미터로만 전달
  if (data.isSignupRequired) {
    window.location.href = `/register?token=${data.accessToken}`;
  } else {
    // 이미 회원인 경우에만 토큰을 쿠키에 저장
    setTokens(data.accessToken, data.refreshToken);
    window.location.href = '/';
  }
}; 