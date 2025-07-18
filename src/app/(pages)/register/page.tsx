"use client"

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NicknameStep from "@/components/pages/_register/nickname_step";
import BirthGenderPage from "@/components/pages/_register/birth_gender";
import TosStep from "@/components/pages/_register/tos";
import { setTokens, isClientAuthenticated } from "@/lib/auth";

// SearchParams를 사용하는 컴포넌트를 분리
function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [signupToken, setSignupToken] = useState<string | null>(null);
  
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // URL에서 토큰 파라미터 가져오기 및 인증 상태 확인
  useEffect(() => {
    // 이미 로그인된 상태라면 메인 페이지로 리다이렉션
    if (isClientAuthenticated()) {
      router.push('/');
      return;
    }

    // 토큰 파라미터 확인
    const token = searchParams?.get('token');
    if (token) {
      setSignupToken(token);
    } else {
      // 토큰이 없으면 로그인 페이지로 리다이렉션
      router.push('/login');
    }
  }, [searchParams, router]);

  const handleSignup = async () => {
    try {
      setLoading(true);
      setError("");

      // Next.js API 라우트를 통해 요청
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(signupToken ? { 'Authorization': `Bearer ${signupToken}` } : {})
        },
        body: JSON.stringify({
          nickname,
          birthDate,
          gender
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.error || '회원가입 중 오류가 발생했습니다.');
      }

      const data = await response.json();
      
      // 응답 구조에 맞게 data 객체 접근
      const responseData = data.data || data;
      
      // 토큰 저장
      if (responseData.accessToken) {
        setTokens(responseData.accessToken, responseData.refreshToken);
      }
      
      // 회원가입 성공 후 홈페이지로 이동
      router.push('/');
    } catch (err) {
      console.error('회원가입 오류:', err);
      setError(err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[80vh] justify-between items-center bg-white" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
      <main className="w-full max-w-[90%] md:max-w-[70%] lg:max-w-[50%] flex-grow flex items-start justify-center pt-16">
        {step === 0 && (
          <TosStep
            onNext={() => setStep(1)}
          />
        )}
        {step === 1 && (
          <NicknameStep
            nickname={nickname}
            setNickname={setNickname}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <BirthGenderPage
            birthDate={birthDate}
            setBirthDate={setBirthDate}
            gender={gender}
            setGender={setGender}
            onNext={handleSignup}
            loading={loading}
          />
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md w-full">
            {error}
          </div>
        )}
      </main>
    </div>
  );
}

// 메인 컴포넌트에서 Suspense로 감싸기
export default function Register() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-[80vh]">로딩 중...</div>}>
      <RegisterContent />
    </Suspense>
  );
}