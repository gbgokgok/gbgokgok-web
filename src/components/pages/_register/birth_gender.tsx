"use client";

import { useState, useRef } from "react";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";


export default function BirthGenderPage({
  birthYear,
  setBirthYear,
  gender,
  setGender,
  onNext,
  loading = false,
}: {
  birthYear: string;
  setBirthYear: (v: string) => void;
  gender: string;
  setGender: (v: string) => void;
  onNext: () => void;
  loading?: boolean;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => (1950 + i).toString());
  const initialIndex = birthYear ? years.indexOf(birthYear) : years.indexOf("2015");

  const isBirthYearValid = /^[1-2][0-9]{3}$/.test(birthYear) && +birthYear >= 1900 && +birthYear <= currentYear;
  const isGenderValid = gender === "male" || gender === "female";
  const isValid = isBirthYearValid && isGenderValid;
  const [carouselIndex, setCarouselIndex] = useState(initialIndex);

  // 스와이프/드래그 관련 상태
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dialog가 열릴 때마다 Carousel 위치를 맞춰줌
  const handleDialogOpen = (open: boolean) => {
    setDialogOpen(open);
    if (open) {
      const targetIndex = birthYear ? years.indexOf(birthYear) : years.indexOf("2015");
      setCarouselIndex(targetIndex >= 0 ? targetIndex : years.length - 1);
    }
  };

  // 터치 시작
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setStartIndex(carouselIndex);
  };

  // 마우스 시작
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartIndex(carouselIndex);
    e.preventDefault();
  };

  // 터치 이동
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = startY - currentY;
    const threshold = 30; // 30px 이동시 한 칸씩 이동 (더 민감하게)
    
    const steps = Math.floor(Math.abs(deltaY) / threshold);
    let newIndex = startIndex;
    
    if (deltaY > 0) {
      // 위로 스와이프 = 연도 증가 (아래로)
      newIndex = Math.min(years.length - 1, startIndex + steps);
    } else {
      // 아래로 스와이프 = 연도 감소 (위로)
      newIndex = Math.max(0, startIndex - steps);
    }
    
    setCarouselIndex(newIndex);
  };

  // 마우스 이동
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const currentY = e.clientY;
    const deltaY = startY - currentY;
    const threshold = 30; // 더 민감하게 반응
    
    const steps = Math.floor(Math.abs(deltaY) / threshold);
    let newIndex = startIndex;
    
    if (deltaY > 0) {
      // 위로 드래그 = 연도 증가 (아래로)
      newIndex = Math.min(years.length - 1, startIndex + steps);
    } else {
      // 아래로 드래그 = 연도 감소 (위로)  
      newIndex = Math.max(0, startIndex - steps);
    }
    
    setCarouselIndex(newIndex);
  };

  // 터치/드래그 종료
  const handleEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[400px]">
      <p className="text-left w-full text-2xl font-bold mb-8">
        출생연도와 성별을 입력해 주세요
      </p>
      {/* 출생연도 Dialog + Carousel */}
      <div className="w-full mb-6">
        <label className="block mb-2 text-gray-700 font-medium">출생연도</label>
        <Dialog open={dialogOpen} onOpenChange={handleDialogOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="w-full border-b border-gray-300 py-3 text-left text-lg bg-transparent"
              onClick={() => setDialogOpen(true)}
            >
              {birthYear ? birthYear : "출생연도를 선택하세요"}
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>출생연도 선택</DialogTitle>
              <DialogDescription>상하로 드래그해서 선택해주세요</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center py-6">
              <div 
                ref={containerRef}
                className="relative w-full h-48 overflow-hidden cursor-grab select-none"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              >                
                {/* 연도 리스트 - 세로 배열 */}
                <div className="flex flex-col items-center justify-center h-full relative">
                  {years.map((year, idx) => {
                    const distance = Math.abs(idx - carouselIndex);
                    const isVisible = distance <= 3;
                    
                    if (!isVisible) return null;
                    
                    let textStyle = "";
                    let transform = "";
                    let opacity = "opacity-100";
                    
                    const offset = (idx - carouselIndex) * 50; // 각 연도 간격
                    
                    if (distance === 0) {
                      // 선택된 연도: 중앙, 크고 초록색
                      textStyle = "text-green-600 text-3xl font-bold";
                    } else if (distance === 1) {
                      // 인접한 연도
                      textStyle = "text-gray-500 text-xl";
                      opacity = "opacity-70";
                    } else if (distance === 2) {
                      // 더 멀리
                      textStyle = "text-gray-400 text-lg";
                      opacity = "opacity-50";
                    } else {
                      // 가장 멀리
                      textStyle = "text-gray-300 text-base";
                      opacity = "opacity-30";
                    }
                    
                    transform = `translateY(${offset}px)`;
                    
                    return (
                      <div
                        key={year}
                        className={`absolute cursor-pointer transition-all duration-200 text-center flex items-center justify-center w-full h-10 ${textStyle} ${opacity}`}
                        style={{ transform }}
                        onClick={() => {
                          setBirthYear(year);
                          setDialogOpen(false);
                        }}
                      >
                        {year}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {!isBirthYearValid && birthYear && (
          <p className="mt-1 text-xs text-red-500">올바른 출생연도를 선택해 주세요.</p>
        )}
      </div>
      {/* 성별 선택 */}
      <div className="w-full mb-8">
        <label className="block mb-2 text-gray-700 font-medium">성별</label>
        <div className="flex gap-4">
          <button
            type="button"
            className={`flex-1 py-3 rounded-lg border transition-colors
              ${gender === "male"
                ? "bg-blue-100 text-blue-700 border-blue-300"
                : "bg-gray-100 text-gray-700 border-gray-300"}
            `}
            onClick={() => setGender("male")}
          >
            남성
          </button>
          <button
            type="button"
            className={`flex-1 py-3 rounded-lg border transition-colors
              ${gender === "female"
                ? "bg-pink-100 text-pink-700 border-pink-300"
                : "bg-gray-100 text-gray-700 border-gray-300"}
            `}
            onClick={() => setGender("female")}
          >
            여성
          </button>
        </div>
      </div>
      <Button
        className={`w-full py-6 rounded-lg text-base font-semibold transition-colors
          ${isValid ? "bg-green-800 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}
        `}
        disabled={!isValid || loading}
        onClick={onNext}
      >
        {loading ? "처리 중..." : "다음"}
      </Button>
    </div>
  );
}