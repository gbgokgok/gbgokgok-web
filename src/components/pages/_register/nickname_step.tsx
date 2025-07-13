import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useRef } from 'react';

export default function NicknameStep({ nickname, setNickname, onNext }: {
  nickname: string;
  setNickname: (v: string) => void;
  onNext: () => void;
}) {
  const value = nickname.trim();
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 한글 2-6글자
  const isKoreanOnly = /^[가-힣]{2,6}$/.test(value);

  // 영어 2-14글자
  const isEnglishOnly = /^[a-zA-Z]{2,14}$/.test(value);

  // 형식 유효성
  const isFormatValid = isKoreanOnly || isEnglishOnly;

  // 최종 유효성 (형식 + 중복 검사)
  const isValid = isFormatValid && isAvailable === true;

  // 닉네임 중복 검사
  const checkNicknameAvailability = async (name: string) => {
    if (!isFormatValid) {
      setIsAvailable(null);
      return;
    }

    setIsChecking(true);
    try {
      // 내부 API 라우트를 통해 요청
      const response = await fetch(`/api/nicknames/${name}/available`);

      if (!response.ok) {
        throw new Error('서버 오류');
      }

      const result = await response.json();
      // 응답 구조에 맞게 데이터 추출 - { "data": true/false }
      setIsAvailable(result.data);
    } catch (error) {
      console.error('닉네임 검사 오류:', error);
      setIsAvailable(false);
    } finally {
      setIsChecking(false);
    }
  };

  // 닉네임 변경 시 디바운스 처리
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (value) {
      setIsChecking(true);
      timerRef.current = setTimeout(() => {
        checkNicknameAvailability(value);
      }, 500); // 0.5초 디바운스
    } else {
      setIsAvailable(null);
      setIsChecking(false);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, isFormatValid]);

  // 버튼 텍스트 결정
  const getButtonText = () => {
    if (isChecking) return '확인 중...';
    if (!isFormatValid) return '다음';
    if (isAvailable === false) return '이미 사용 중인 닉네임입니다';
    return '다음';
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[400px]">
      <p className="text-left w-full text-2xl font-bold mb-8">
        경북곡곡에서 사용할<br />
        닉네임을 입력해 주세요
      </p>
      <div className="relative w-full">
        <Input
          type="text"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          placeholder="입력해주세요"
          className="pr-8"
        />
        {nickname && (
          <button
            type="button"
            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => {
              setNickname("");
              setIsAvailable(null);
            }}
            tabIndex={-1}
          >
            ×
          </button>
        )}
      </div>
      <p className="mt-2 text-sm text-gray-400 w-full text-left">
        한글 2-6글자, 영어 2-14글자 (한영 혼용 불가)
      </p>
      {isAvailable === false && isFormatValid && (
        <p className="mt-2 text-sm text-red-500 w-full text-left">
          이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.
        </p>
      )}
      <Button
        className={`w-full mt-8 py-6 rounded-lg text-base font-semibold transition-colors
          ${isValid ? "bg-green-800 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}
        `}
        disabled={!isValid || isChecking}
        onClick={onNext}
      >
        {getButtonText()}
      </Button>
    </div>
  );
}