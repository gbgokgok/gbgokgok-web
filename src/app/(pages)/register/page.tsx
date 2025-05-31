"use client"

import { useState } from "react";
import NicknameStep from "@/components/pages/_register/nickname_step";
// import ProfileStep from "./ProfileStep"; // 다음 단계가 있다면

export default function Register() {
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState("");

  return (
    <div className="flex flex-col min-h-[80vh] justify-between items-center bg-white" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
      <main className="w-full max-w-[90%] md:max-w-[70%] lg:max-w-[50%] flex-grow flex items-start justify-center pt-16">
        {step === 0 && (
          <NicknameStep
            nickname={nickname}
            setNickname={setNickname}
            onNext={() => setStep(1)}
          />
        )}
        {/* {step === 1 && <ProfileStep ... />} */}
      </main>
    </div>
  );
}