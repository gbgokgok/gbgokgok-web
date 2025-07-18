import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 요청 본문에서 데이터 추출
    const { code, redirectUri } = await request.json();
    
    if (!code) {
      return NextResponse.json(
        { error: '인가 코드가 필요합니다.' },
        { status: 400 }
      );
    }
    
    // API URL 및 Cloudflare 토큰 설정
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const cfAccessToken = process.env.NEXT_PUBLIC_CF_ACCESS_TOKEN || '';
    
    // 백엔드 서버로 요청 전송
    const response = await fetch(`${apiUrl}/oauth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CF-Access-Token': cfAccessToken
      },
      body: JSON.stringify({
        code,
        redirectUri
      }),
    });
    
    // 응답 처리
    const text = await response.text();
    
    let data;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('JSON 파싱 오류:', e);
        // JSON 파싱 실패 시 텍스트 응답 그대로 반환
        return NextResponse.json(
          { error: '서버 응답을 처리할 수 없습니다.', rawResponse: text },
          { status: 500 }
        );
      }
    } else {
      // 응답이 비어있는 경우
      data = { message: '응답이 비어있습니다.' };
    }
    
    // 응답 구조에 맞게 data 객체 접근
    const responseData = data.data || data;
    
    if (!response.ok) {
      return NextResponse.json(
        data,
        { status: response.status }
      );
    }
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('로그인 API 오류:', error);
    return NextResponse.json(
      { error: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 