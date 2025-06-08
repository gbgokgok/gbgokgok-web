"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FiCheck, FiChevronRight } from 'react-icons/fi';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function TosStep({ onNext }: {
  onNext: () => void;
}) {
  const [agreements, setAgreements] = useState({
    serviceTerms: false,
    privacyPolicy: false
  });
  const [serviceTermsOpen, setServiceTermsOpen] = useState(false);
  const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);

  const allChecked = Object.values(agreements).every(value => value);

  const toggleAgreement = (key: keyof typeof agreements) => {
    setAgreements(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleAll = () => {
    const newValue = !allChecked;
    setAgreements({
      serviceTerms: newValue,
      privacyPolicy: newValue
    });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[400px]">
      <p className="text-left w-full text-2xl font-bold mb-8">
        경북곡곡 서비스 이용을 위해<br />
        약관에 동의해 주세요
      </p>

      {/* 전체 동의 */}
      <div className="w-full border-b pb-4 mb-4">
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={toggleAll}
        >
          <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${allChecked ? 'bg-green-800 border-green-800' : 'border-gray-300'}`}>
            {allChecked && <FiCheck className="text-white" />}
          </div>
          <span className="font-medium">전체 동의</span>
        </div>
      </div>

      {/* 서비스 이용약관 */}
      <div className="w-full mb-3">
        <Drawer open={serviceTermsOpen} onOpenChange={setServiceTermsOpen}>
          <div className="flex items-center justify-between w-full">
            <div 
              className="flex items-center gap-3 cursor-pointer flex-1" 
              onClick={() => toggleAgreement('serviceTerms')}
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${agreements.serviceTerms ? 'bg-green-800 border-green-800' : 'border-gray-300'}`}>
                {agreements.serviceTerms && <FiCheck className="text-white text-sm" />}
              </div>
              <span>서비스 이용약관 동의 (필수)</span>
            </div>
            <DrawerTrigger asChild>
              <button 
                className="text-gray-400"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <FiChevronRight />
              </button>
            </DrawerTrigger>
          </div>
          <DrawerContent className="h-[90vh]">
            <DrawerHeader>
              <DrawerTitle>
                서비스 이용약관
              </DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-16 overflow-y-auto h-full">
              <div className="text-sm">
                <h3 className="font-bold mb-2">제1조 (목적)</h3>
                <p className="mb-4">
                  본 약관은 주식회사 경북곡곡(이하 &apos;회사&apos;라 함)가 운영하는 경북곡곡 서비스(이하 &apos;서비스&apos;라 함)를 이용함에 있어 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
                </p>
                
                <h3 className="font-bold mb-2">제2조 (용어의 정의)</h3>
                <p className="mb-4">
                  본 약관에서 사용하는 용어의 정의는 다음과 같습니다.
                </p>
                <ol className="list-decimal pl-5 mb-4 space-y-2">
                  <li>플랫폼은 이용자가 컴퓨터 등 정보통신설비를 이용하여 서비스를 이용할 수 있도록 회사가 제공하는 가상의 영업장을 말합니다.</li>
                  <li>이용자는 플랫폼을 통하여 이 약관에 따라 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
                  <li>회원은 플랫폼에 회원등록을 하여 회사가 제공하는 서비스를 이용하는 자를 말합니다.</li>
                  <li>비회원은 회원에 가입하지 않고 회사가 제공하는 서비스를 이용하는 자를 말합니다.</li>
                </ol>
                
                <h3 className="font-bold mb-2">제3조 (약관의 효력 및 개정)</h3>
                <p className="mb-4">
                  1. 본 약관은 서비스를 이용하는 모든 이용자에게 그 효력이 발생합니다.
                </p>
                <p className="mb-4">
                  2. 회사는 본 약관의 내용을 변경할 수 있으며, 변경된 약관은 플랫폼에 공지함으로써 효력이 발생합니다.
                </p>
                <p className="mb-4">
                  3. 회사는 약관을 개정할 경우에는 그 개정약관은 그 적용일자 이후에 체결되는 계약에만 적용되고 그 이전에 이미 체결된 계약에 대해서는 개정 전의 약관조항이 그대로 적용됩니다. 다만 이미 계약을 체결한 이용자가 개정약관 조항의 적용을 받기를 원하는 뜻을 제3항에 의한 개정약관의 공지기간 내에 회사에 송신하여 회사의 동의를 받은 경우에는 개정약관 조항이 적용됩니다.
                </p>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* 개인정보 수집 및 이용 동의 */}
      <div className="w-full mb-6">
        <Drawer open={privacyPolicyOpen} onOpenChange={setPrivacyPolicyOpen}>
          <div className="flex items-center justify-between w-full">
            <div 
              className="flex items-center gap-3 cursor-pointer flex-1" 
              onClick={() => toggleAgreement('privacyPolicy')}
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${agreements.privacyPolicy ? 'bg-green-800 border-green-800' : 'border-gray-300'}`}>
                {agreements.privacyPolicy && <FiCheck className="text-white text-sm" />}
              </div>
              <span>개인정보 수집 및 이용 동의 (필수)</span>
            </div>
            <DrawerTrigger asChild>
              <button 
                className="text-gray-400"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <FiChevronRight />
              </button>
            </DrawerTrigger>
          </div>
          <DrawerContent className="h-[90vh]">
            <DrawerHeader>
              <DrawerTitle>
                개인정보 수집 및 이용
              </DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-16 overflow-y-auto h-full">
              <div className="text-sm">
                <h3 className="font-bold mb-2">제1조 (목적)</h3>
                <p className="mb-4">
                  본 약관은 주식회사 경북곡곡(이하 &apos;회사&apos;라 함)가 운영하는 경북곡곡 서비스(이하 &apos;서비스&apos;라 함)에서 회원의 개인정보를 수집 및 이용함에 있어 회원과 회사 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
                </p>
                
                <h3 className="font-bold mb-2">제2조 (수집하는 개인정보의 항목)</h3>
                <p className="mb-4">
                  회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.
                </p>
                <ol className="list-decimal pl-5 mb-4 space-y-2">
                  <li>필수항목: 닉네임, 출생연도, 성별</li>
                  <li>서비스 이용 과정에서 생성되는 정보: 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보, 디바이스 정보</li>
                </ol>
                
                <h3 className="font-bold mb-2">제3조 (개인정보의 수집 및 이용목적)</h3>
                <p className="mb-4">
                  회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.
                </p>
                <ol className="list-decimal pl-5 mb-4 space-y-2">
                  <li>서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산</li>
                  <li>회원 관리: 회원제 서비스 이용에 따른 본인확인, 개인식별, 불량회원의 부정 이용 방지와 비인가 사용 방지, 가입 의사 확인, 연령확인, 불만처리 등 민원처리, 고지사항 전달</li>
                  <li>마케팅 및 광고에 활용: 신규 서비스 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공 및 참여기회 제공, 서비스의 유효성 확인, 접속빈도 파악 또는 회원의 서비스 이용에 대한 통계</li>
                </ol>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <Button
        className={`w-full mt-8 py-6 rounded-lg text-base font-semibold transition-colors
          ${allChecked ? "bg-green-800 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}
        `}
        disabled={!allChecked}
        onClick={onNext}
      >
        다음
      </Button>
    </div>
  );
}