import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const cfAccessToken = process.env.NEXT_PUBLIC_CF_ACCESS_TOKEN || '';
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    
    const response = await fetch(`${apiUrl}/oauth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CF-Access-Token': cfAccessToken
      },
      body: JSON.stringify({
        code,
        redirectUri: `${origin}/api/auth/google/callback`,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('백엔드 서버 응답 오류:', response.status, text);
      throw new Error('로그인 처리 중 오류가 발생했습니다.');
    }

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('JSON 파싱 오류:', e);
      throw new Error('응답이 JSON 형식이 아닙니다.');
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Google OAuth 로그인 오류:', error);
    return NextResponse.json(
      { error: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 