'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

// 에러 처리를 위한 컴포넌트
function ErrorHandler() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // URL에서 오류 파라미터 확인
    const errorParam = searchParams.get('error');
    if (errorParam) {
      switch (errorParam) {
        case 'no_code':
          setError('인증 코드를 받지 못했습니다. 다시 시도해주세요.');
          break;
        case 'server_error':
          setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          break;
        case 'unknown':
          setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
          break;
        default:
          setError('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    }
  }, [searchParams]);

  if (!error) return null;

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
      <p>{error}</p>
    </div>
  );
}

// 로딩 상태를 위한 폴백 컴포넌트
function ErrorHandlerFallback() {
  return null; // 로딩 중에는 아무것도 표시하지 않음
}

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Google OAuth 클라이언트 ID
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      // 리다이렉트 URI (GCP에 등록된 콜백 주소와 일치해야 함)
      const redirectUri = `${window.location.origin}/api/auth/google/callback`;
      // OAuth 스코프
      const scope = 'email profile';
      
      // Google OAuth 인증 URL 생성
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;
      
      // Google 로그인 페이지로 리다이렉트
      window.location.href = googleAuthUrl;
    } catch (error) {
      console.error('Google 로그인 오류:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[80vh] justify-between items-center overflow-hidden" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
      <div className="w-full max-w-[90%] md:max-w-[70%] lg:max-w-[50%] flex-grow flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Image
            src="/image/logo.png"
            alt="logo"
            width={120}
            height={120}
            style={{ width: 'auto', height: 'auto', minWidth: '60px', minHeight: '60px' }}
          />
        </div>
      </div>
      <div className="w-full max-w-[90%] md:max-w-[70%] lg:max-w-[50%] p-4 md:p-6 rounded-lg pb-4">
        <Suspense fallback={<ErrorHandlerFallback />}>
          <ErrorHandler />
        </Suspense>
        <div className="flex flex-col space-y-4 w-full">
            <Link href="/register" passHref>
                <button className="bg-gray-100 text-black py-3 px-4 rounded-xl flex items-center justify-center w-full active:bg-yellow-300 transition-colors">
                    <Image
                    src="/icon/kakao-icon.png"
                    alt="kakao icon"
                    width={24}
                    height={24}
                    className="mr-4 p-1"
                    />
                    Kakao로 로그인
                </button>
            </Link>
            <button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="bg-gray-100 text-black py-3 px-4 rounded-xl flex items-center justify-center w-full active:bg-blue-300 transition-colors"
            >
                <Image
                src="/icon/google-icon.png"
                alt="google icon"
                width={24}
                height={24}
                className="mr-4 p-1"
                />
                {isLoading ? '로그인 중...' : 'Google로 로그인'}
            </button>
        </div>
      </div>
    </div>
  );
}