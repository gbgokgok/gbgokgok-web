import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // URL에서 닉네임 직접 추출
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const nickname = pathParts[pathParts.length - 2]; // /api/nicknames/[nickname]/available 형식에서 추출
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const cfAccessToken = process.env.NEXT_PUBLIC_CF_ACCESS_TOKEN || '';
    
    const response = await fetch(`${apiUrl}/nicknames/${nickname}/available`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'CF-Access-Token': cfAccessToken
      },
    });

    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('닉네임 검사 API 오류:', error);
    return NextResponse.json(
      { error: '닉네임 검사 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 