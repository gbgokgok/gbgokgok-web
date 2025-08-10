import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // URL에서 인가 코드 추출
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    
    // 실제 도메인을 가져오는 부분 수정
    const host = request.headers.get('host') || request.headers.get('x-forwarded-host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const baseUrl = `${protocol}://${host}`;
    console.log('baseUrl', baseUrl);
    
    if (!code) {
      return NextResponse.redirect(`${baseUrl}/login?error=no_code`);
    }

    // 내부 API 라우트를 통해 로그인 처리
    const loginResponse = await fetch(`${baseUrl}/oauth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code,
        redirectUri: `${baseUrl}/api/auth/google/callback`,
      }),
    });

    console.log('loginResponse', loginResponse);
    if (!loginResponse.ok) {
      console.error('로그인 API 응답 오류:', loginResponse.status);
      return NextResponse.redirect(`${baseUrl}/login?error=server_error`);
    }
    
    const data = await loginResponse.json();
    
    let redirectUrl;
    if (data.isSignupRequired) {
      redirectUrl = `${baseUrl}/register?token=${data.accessToken}`;
      return NextResponse.redirect(redirectUrl);
    } else {
      redirectUrl = `${baseUrl}/`;
      
      const responseWithCookies = NextResponse.redirect(redirectUrl);
      
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
    
    // 에러 발생 시에도 올바른 도메인 사용
    const host = request.headers.get('host') || request.headers.get('x-forwarded-host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const baseUrl = `${protocol}://${host}`;
    
    return NextResponse.redirect(`${baseUrl}/login?error=unknown`);
  }
} 
