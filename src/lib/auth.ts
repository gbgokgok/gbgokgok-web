'use client';

// 클라이언트 측 함수들

// 토큰 저장 (클라이언트 측)
export const setTokens = (accessToken: string, refreshToken?: string) => {
  document.cookie = `accessToken=${accessToken}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax;`;
  
  if (refreshToken) {
    document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax;`;
  }
};

// 토큰 삭제 (로그아웃)
export const removeTokens = () => {
  document.cookie = 'accessToken=; path=/; max-age=0;';
  document.cookie = 'refreshToken=; path=/; max-age=0;';
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
  return getCookie('accessToken');
};

// 클라이언트 측에서 로그인 상태 확인
export const isClientAuthenticated = () => {
  return !!getClientToken();
};

// 로그인 후 리다이렉션 처리
export const handleAuthRedirect = (data: { accessToken: string; refreshToken?: string; isSignupRequired: boolean }) => {
  setTokens(data.accessToken, data.refreshToken);
  
  if (data.isSignupRequired) {
    window.location.href = `/register?token=${data.accessToken}`;
  } else {
    window.location.href = '/';
  }
}; 