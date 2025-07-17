import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 요청 본문에서 데이터 추출
    const { nickname, birthDate, gender } = await request.json();
    
    // 인증 토큰 추출 (있는 경우)
    const authHeader = request.headers.get('Authorization');
    
    // API URL 및 Cloudflare 토큰 설정
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const cfAccessToken = process.env.NEXT_PUBLIC_CF_ACCESS_TOKEN || '';
    
    // 백엔드 서버로 요청 전송
    const response = await fetch(`${apiUrl}/oauth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CF-Access-Token': cfAccessToken,
        ...(authHeader ? { 'Authorization': authHeader } : {})
      },
      body: JSON.stringify({
        nickname,
        birthDate,
        gender
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
    
    if (!response.ok) {
      return NextResponse.json(
        data,
        { status: response.status }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('회원가입 API 오류:', error);
    return NextResponse.json(
      { error: '회원가입 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 