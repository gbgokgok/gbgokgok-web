"use client"

import { useState } from "react";
import NicknameStep from "@/components/pages/_register/nickname_step";
import BirthGenderPage from "@/components/pages/_register/birth_gender";
import TosStep from "@/components/pages/_register/tos";

export default function Register() {
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [gender, setGender] = useState("");

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
            birthYear={birthYear}
            setBirthYear={setBirthYear}
            gender={gender}
            setGender={setGender}
            onNext={() => setStep(3)}
          />
        )}
      </main>
    </div>
  );
}