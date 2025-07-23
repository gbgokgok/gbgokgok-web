import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // URL에서 인가 코드 추출
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    
    if (!code) {
      return NextResponse.redirect(`${url.origin}/login?error=no_code`);
    }

    // 내부 API 라우트를 통해 로그인 처리
    const loginResponse = await fetch(`${url.origin}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code,
        redirectUri: `${url.origin}/api/auth/google/callback`,
      }),
    });

    if (!loginResponse.ok) {
      console.error('로그인 API 응답 오류:', loginResponse.status);
      return NextResponse.redirect(`${url.origin}/login?error=server_error`);
    }

    const data = await loginResponse.json();
    
    let redirectUrl;
    if (data.isSignupRequired) {
      // 회원가입이 필요한 경우 회원가입 페이지로 리다이렉트
      // 토큰을 쿠키에 저장하지 않고 URL 파라미터로만 전달
      redirectUrl = `${url.origin}/register?token=${data.accessToken}`;
      return NextResponse.redirect(redirectUrl);
    } else {
      // 이미 회원인 경우 메인 페이지로 리다이렉트하고 토큰을 쿠키에 저장
      redirectUrl = `${url.origin}/`;
      
      const responseWithCookies = NextResponse.redirect(redirectUrl);
      
      // 토큰을 쿠키에 저장
      responseWithCookies.cookies.set('accessToken', data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1일
        path: '/',
      });
      
      if (data.refreshToken) {
        responseWithCookies.cookies.set('refreshToken', data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30, // 30일
          path: '/',
        });
      }
      
      return responseWithCookies;
    }
  } catch (error) {
    console.error('Google OAuth 콜백 처리 오류:', error);
    const url = new URL(request.url);
    return NextResponse.redirect(`${url.origin}/login?error=unknown`);
  }
} 