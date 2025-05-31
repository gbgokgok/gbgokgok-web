import Image from 'next/image';

export default function login() {
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
        <div className="flex flex-col space-y-4 w-full">
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
          <button className="bg-gray-100 text-black py-3 px-4 rounded-xl flex items-center justify-center w-full active:bg-blue-300 transition-colors">
            <Image
              src="/icon/google-icon.png"
              alt="google icon"
              width={24}
              height={24}
              className="mr-4 p-1"
            />
            Google로 로그인
          </button>
        </div>
      </div>
    </div>
  );
}