import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    const host = request.headers.get('host') || request.headers.get('x-forwarded-host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const baseUrl = `${protocol}://${host}`;

    if (!code) {
      return NextResponse.redirect(`${baseUrl}/login?error=no_code`);
    }

    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        redirectUri: `${baseUrl}/api/auth/google/callback`
      }),
    });

    if (!loginResponse.ok) {
      console.error('로그인 API 응답 오류:', loginResponse.status);
      return NextResponse.redirect(`${baseUrl}/login?error=server_error`);
    }

    let data: any = {};
    try {
      data = await loginResponse.json();
    } catch {}

    let redirectUrl = `${baseUrl}/`;
    if (data?.isSignupRequired) {
      redirectUrl = `${baseUrl}/register`;
    }

    const response = NextResponse.redirect(redirectUrl);

    // 1) 원본 Set-Cookie를 그대로 전달 (스테이징/프로덕션용)
    const setCookie = loginResponse.headers.get('set-cookie');
    if (setCookie) {
      response.headers.append('set-cookie', setCookie);
    }

    // 2) 로컬 개발 환경에서는 쿠키 재발급 (도메인/보안 속성 맞춤)
    const isLocal = host?.includes('localhost') || protocol === 'http';
    if (isLocal && setCookie) {
      // refreshToken=...; 로부터 값만 추출
      const m = /(?:^|,)\s*refreshToken=([^;]+)/i.exec(setCookie);
      if (m && m[1]) {
        response.cookies.set('refreshToken', m[1], {
          httpOnly: true,
          secure: false,      // 로컬 HTTP
          sameSite: 'lax',    // 로컬은 None 필요 없음
          path: '/',
          maxAge: 60 * 60 * 24 * 7
        });
      }

      // (선택) 백엔드가 accessToken 쿠키를 줄 경우도 대비
      const a = /(?:^|,)\s*accessToken=([^;]+)/i.exec(setCookie);
      if (a && a[1]) {
        response.cookies.set('accessToken', a[1], {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 1
        });
      }
    }

    return response;
  } catch (error) {
    console.error('Google OAuth 콜백 처리 오류:', error);
    const host = request.headers.get('host') || request.headers.get('x-forwarded-host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const baseUrl = `${protocol}://${host}`;
    return NextResponse.redirect(`${baseUrl}/login?error=unknown`);
  }
}