import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // URL에서 인가 코드 추출
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    
    if (!code) {
      return NextResponse.redirect(`${url.origin}/login?error=no_code`);
    }

    // 백엔드 API로 인가 코드 전송
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const cfAccessToken = process.env.NEXT_PUBLIC_CF_ACCESS_TOKEN || '';
    
    const response = await fetch(`${apiUrl}/oauth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CF-Access-Token': cfAccessToken
      },
      body: JSON.stringify({
        code,
        redirectUri: `${url.origin}/api/auth/google/callback`,
      }),
    });

    if (!response.ok) {
      console.error('백엔드 서버 응답 오류:', response.status);
      const text = await response.text();
      console.error('오류 응답 내용:', text);
      return NextResponse.redirect(`${url.origin}/login?error=server_error`);
    }

    const text = await response.text();
    console.log('백엔드 응답 원문:', text);
    let data;
    try {
      data = JSON.parse(text);
      // 응답 구조에 맞게 data 객체 접근
      if (data.data) {
        data = data.data;
      }
    } catch (e) {
      console.error('JSON 파싱 오류:', e);
      throw new Error('응답이 JSON 형식이 아닙니다.');
    }
    
    // 토큰 저장을 위한 쿠키 설정
    let redirectUrl;
    if (data.isSignupRequired) {
      // 회원가입이 필요한 경우 회원가입 페이지로 리다이렉트
      redirectUrl = `${url.origin}/register?token=${data.accessToken}`;
    } else {
      // 이미 회원인 경우 메인 페이지로 리다이렉트
      redirectUrl = `${url.origin}/`;
    }
    
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
  } catch (error) {
    console.error('Google OAuth 콜백 처리 오류:', error);
    const url = new URL(request.url);
    return NextResponse.redirect(`${url.origin}/login?error=unknown`);
  }
} 