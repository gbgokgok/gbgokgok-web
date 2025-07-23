import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 현재 환경이 로컬인지 확인
  const isLocalEnv = process.env.IS_LOCAL_ENV === 'true';
  const tokenName = isLocalEnv ? 'serverAccessToken' : 'accessToken';
  
  // 쿠키 이름 환경에 따라 구분
  const accessToken = request.cookies.get(tokenName)?.value;
  const isAuthenticated = !!accessToken;

  // 로그인 상태에서 /login 또는 /register 페이지 접근 시 홈으로 리다이렉션
  if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 로그인하지 않은 상태에서 /register 페이지 접근 시 token 파라미터 확인
  if (!isAuthenticated && pathname === '/register') {
    const token = request.nextUrl.searchParams.get('token');
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// 미들웨어가 적용될 경로 설정
export const config = {
  matcher: ['/login', '/register'],
}; 