import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function NicknameStep({ nickname, setNickname, onNext }: {
  nickname: string;
  setNickname: (v: string) => void;
  onNext: () => void;
}) {
  const value = nickname.trim();

  // 한글 2-6글자
  const isKoreanOnly = /^[가-힣]{2,6}$/.test(value);

  // 영어 2-14글자
  const isEnglishOnly = /^[a-zA-Z]{2,14}$/.test(value);

  // 최종 유효성
  const isValid = isKoreanOnly || isEnglishOnly;

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
            onClick={() => setNickname("")}
            tabIndex={-1}
          >
            ×
          </button>
        )}
      </div>
      <p className="mt-2 text-sm text-gray-400 w-full text-left">
        한글 2-6글자, 영어 2-14글자 (한영 혼용 불가)
      </p>
      <Button
        className={`w-full mt-8 py-6 rounded-lg text-base font-semibold transition-colors
          ${isValid ? "bg-green-800 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}
        `}
        disabled={!isValid}
        onClick={onNext}
      >
        다음
      </Button>
    </div>
  );
}