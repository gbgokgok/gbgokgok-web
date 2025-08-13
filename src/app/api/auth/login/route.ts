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
    
    
    // 백엔드의 Set-Cookie 헤더 추출
    const setCookie = response.headers.get('set-cookie');

    let data;
    if (text) {
      try {
        data = JSON.parse(text);
        console.log('파싱된 데이터:', data);
      } catch (e) {
        console.error('JSON 파싱 오류:', e);
        const init: ResponseInit = { status: 500 };
        if (setCookie) init.headers = { 'Set-Cookie': setCookie };
        return NextResponse.json(
          { error: '서버 응답을 처리할 수 없습니다.', rawResponse: text },
          init
        );
      }
    } else {
      // 응답이 비어있는 경우
      data = { message: '응답이 비어있습니다.' };
    }
    
    // 응답 구조에 맞게 data 객체 접근
    const responseData = data.data || data;
    
    if (!response.ok) {
      const init: ResponseInit = { status: response.status };
      if (setCookie) init.headers = { 'Set-Cookie': setCookie };
      return NextResponse.json(data, init);
    }
    
    // 성공 시에도 Set-Cookie를 그대로 전달
    {
      const init: ResponseInit = {};
      if (setCookie) init.headers = { 'Set-Cookie': setCookie };
      return NextResponse.json(responseData, init);
    }
  } catch (error) {
    console.error('로그인 API 오류:', error);
    return NextResponse.json(
      { error: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}