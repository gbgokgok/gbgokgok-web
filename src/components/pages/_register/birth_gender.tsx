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
  birthDate,
  setBirthDate,
  gender,
  setGender,
  onNext,
  loading = false,
}: {
  birthDate: string;
  setBirthDate: (v: string) => void;
  gender: string;
  setGender: (v: string) => void;
  onNext: () => void;
  loading?: boolean;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"year" | "month" | "day">("year");
  
  // 생년월일 분리
  const [year, setYear] = useState(() => {
    if (birthDate) {
      const parts = birthDate.split('-');
      return parts[0] || "";
    }
    return "";
  });
  
  const [month, setMonth] = useState(() => {
    if (birthDate) {
      const parts = birthDate.split('-');
      return parts[1] || "";
    }
    return "";
  });
  
  const [day, setDay] = useState(() => {
    if (birthDate) {
      const parts = birthDate.split('-');
      return parts[2] || "";
    }
    return "";
  });

  // 생년월일 변경 시 birthDate 업데이트
  const updateBirthDate = (newYear: string, newMonth: string, newDay: string) => {
    if (newYear && newMonth && newDay) {
      setBirthDate(`${newYear}-${newMonth.padStart(2, '0')}-${newDay.padStart(2, '0')}`);
    }
  };

  // 연도 관련 데이터
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => (1950 + i).toString());
  const initialYearIndex = year ? years.indexOf(year) : years.indexOf("2015");
  
  // 월 관련 데이터
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const initialMonthIndex = month ? months.indexOf(month) : 0;
  
  // 일 관련 데이터
  const getDaysInMonth = (year: string, month: string) => {
    if (!year || !month) return Array.from({ length: 31 }, (_, i) => (i + 1).toString());
    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
  };
  
  const days = getDaysInMonth(year, month);
  const initialDayIndex = day ? days.indexOf(day) : 0;

  const isBirthDateValid = () => {
    if (!year || !month || !day) return false;
    
    try {
      const date = new Date(`${year}-${month}-${day}`);
      return !isNaN(date.getTime()) && 
             parseInt(year) >= 1950 && 
             parseInt(year) <= currentYear;
    } catch (e) {
      console.error('생년월일 유효성 검사 오류:', e);
      return false;
    }
  };
  
  const isGenderValid = gender === "MALE" || gender === "FEMALE";
  const isValid = isBirthDateValid() && isGenderValid;
  
  const [carouselIndex, setCarouselIndex] = useState(() => {
    switch (dialogType) {
      case "year": return initialYearIndex;
      case "month": return initialMonthIndex;
      case "day": return initialDayIndex;
      default: return 0;
    }
  });

  // 스와이프/드래그 관련 상태
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dialog가 열릴 때마다 Carousel 위치를 맞춰줌
  const handleDialogOpen = (open: boolean, type?: "year" | "month" | "day") => {
    if (type) setDialogType(type);
    setDialogOpen(open);
    
    if (open) {
      let targetIndex = 0;
      
      switch (type) {
        case "year":
          targetIndex = year ? years.indexOf(year) : initialYearIndex;
          break;
        case "month":
          targetIndex = month ? months.indexOf(month) : initialMonthIndex;
          break;
        case "day":
          targetIndex = day ? days.indexOf(day) : initialDayIndex;
          break;
      }
      
      setCarouselIndex(targetIndex >= 0 ? targetIndex : 0);
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
    
    let maxIndex = 0;
    switch (dialogType) {
      case "year": maxIndex = years.length - 1; break;
      case "month": maxIndex = months.length - 1; break;
      case "day": maxIndex = days.length - 1; break;
    }
    
    if (deltaY > 0) {
      // 위로 스와이프 = 값 증가 (아래로)
      newIndex = Math.min(maxIndex, startIndex + steps);
    } else {
      // 아래로 스와이프 = 값 감소 (위로)
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
    
    let maxIndex = 0;
    switch (dialogType) {
      case "year": maxIndex = years.length - 1; break;
      case "month": maxIndex = months.length - 1; break;
      case "day": maxIndex = days.length - 1; break;
    }
    
    if (deltaY > 0) {
      // 위로 드래그 = 값 증가 (아래로)
      newIndex = Math.min(maxIndex, startIndex + steps);
    } else {
      // 아래로 드래그 = 값 감소 (위로)  
      newIndex = Math.max(0, startIndex - steps);
    }
    
    setCarouselIndex(newIndex);
  };

  // 터치/드래그 종료
  const handleEnd = () => {
    setIsDragging(false);
  };
  
  // 선택 완료 핸들러
  const handleSelect = () => {
    let selectedValue = "";
    
    switch (dialogType) {
      case "year":
        selectedValue = years[carouselIndex];
        setYear(selectedValue);
        updateBirthDate(selectedValue, month, day);
        break;
      case "month":
        selectedValue = months[carouselIndex];
        setMonth(selectedValue);
        
        // 월이 변경되면 일수가 변경될 수 있으므로 일 조정
        const newDays = getDaysInMonth(year, selectedValue);
        if (parseInt(day) > newDays.length) {
          setDay(newDays.length.toString());
          updateBirthDate(year, selectedValue, newDays.length.toString());
        } else {
          updateBirthDate(year, selectedValue, day);
        }
        break;
      case "day":
        selectedValue = days[carouselIndex];
        setDay(selectedValue);
        updateBirthDate(year, month, selectedValue);
        break;
    }
    
    setDialogOpen(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[400px]">
      <p className="text-left w-full text-2xl font-bold mb-8">
        생년월일과 성별을 입력해 주세요
      </p>
      {/* 생년월일 선택 */}
      <div className="w-full mb-6">
        <label className="block mb-2 text-gray-700 font-medium">생년월일</label>
        <div className="flex gap-2">
          {/* 연도 선택 */}
          <Dialog open={dialogOpen && dialogType === "year"} onOpenChange={(open) => handleDialogOpen(open, "year")}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="flex-1 border-b border-gray-300 py-3 text-left text-lg bg-transparent"
              >
                {year ? year : "연도"}
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
                    {years.map((yearValue, idx) => {
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
                          key={yearValue}
                          className={`absolute cursor-pointer transition-all duration-200 text-center flex items-center justify-center w-full h-10 ${textStyle} ${opacity}`}
                          style={{ transform }}
                          onClick={() => {
                            setYear(yearValue);
                            updateBirthDate(yearValue, month, day);
                            setDialogOpen(false);
                          }}
                        >
                          {yearValue}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <Button 
                  className="mt-4 bg-green-800 text-white" 
                  onClick={handleSelect}
                >
                  선택
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* 월 선택 */}
          <Dialog open={dialogOpen && dialogType === "month"} onOpenChange={(open) => handleDialogOpen(open, "month")}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="flex-1 border-b border-gray-300 py-3 text-left text-lg bg-transparent"
              >
                {month ? month : "월"}
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>월 선택</DialogTitle>
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
                  {/* 월 리스트 - 세로 배열 */}
                  <div className="flex flex-col items-center justify-center h-full relative">
                    {months.map((monthValue, idx) => {
                      const distance = Math.abs(idx - carouselIndex);
                      const isVisible = distance <= 3;
                      
                      if (!isVisible) return null;
                      
                      let textStyle = "";
                      let transform = "";
                      let opacity = "opacity-100";
                      
                      const offset = (idx - carouselIndex) * 50; // 각 월 간격
                      
                      if (distance === 0) {
                        // 선택된 월: 중앙, 크고 초록색
                        textStyle = "text-green-600 text-3xl font-bold";
                      } else if (distance === 1) {
                        // 인접한 월
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
                          key={monthValue}
                          className={`absolute cursor-pointer transition-all duration-200 text-center flex items-center justify-center w-full h-10 ${textStyle} ${opacity}`}
                          style={{ transform }}
                          onClick={() => {
                            setMonth(monthValue);
                            updateBirthDate(year, monthValue, day);
                            setDialogOpen(false);
                          }}
                        >
                          {monthValue}월
                        </div>
                      );
                    })}
                  </div>
                </div>
                <Button 
                  className="mt-4 bg-green-800 text-white" 
                  onClick={handleSelect}
                >
                  선택
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* 일 선택 */}
          <Dialog open={dialogOpen && dialogType === "day"} onOpenChange={(open) => handleDialogOpen(open, "day")}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="flex-1 border-b border-gray-300 py-3 text-left text-lg bg-transparent"
              >
                {day ? day : "일"}
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>일 선택</DialogTitle>
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
                  {/* 일 리스트 - 세로 배열 */}
                  <div className="flex flex-col items-center justify-center h-full relative">
                    {days.map((dayValue, idx) => {
                      const distance = Math.abs(idx - carouselIndex);
                      const isVisible = distance <= 3;
                      
                      if (!isVisible) return null;
                      
                      let textStyle = "";
                      let transform = "";
                      let opacity = "opacity-100";
                      
                      const offset = (idx - carouselIndex) * 50; // 각 일 간격
                      
                      if (distance === 0) {
                        // 선택된 일: 중앙, 크고 초록색
                        textStyle = "text-green-600 text-3xl font-bold";
                      } else if (distance === 1) {
                        // 인접한 일
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
                          key={dayValue}
                          className={`absolute cursor-pointer transition-all duration-200 text-center flex items-center justify-center w-full h-10 ${textStyle} ${opacity}`}
                          style={{ transform }}
                          onClick={() => {
                            setDay(dayValue);
                            updateBirthDate(year, month, dayValue);
                            setDialogOpen(false);
                          }}
                        >
                          {dayValue}일
                        </div>
                      );
                    })}
                  </div>
                </div>
                <Button 
                  className="mt-4 bg-green-800 text-white" 
                  onClick={handleSelect}
                >
                  선택
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {!isBirthDateValid() && birthDate && (
          <p className="mt-1 text-xs text-red-500">올바른 생년월일을 선택해 주세요.</p>
        )}
      </div>
      {/* 성별 선택 */}
      <div className="w-full mb-8">
        <label className="block mb-2 text-gray-700 font-medium">성별</label>
        <div className="flex gap-4">
          <button
            type="button"
            className={`flex-1 py-3 rounded-lg border transition-colors
              ${gender === "MALE"
                ? "bg-blue-100 text-blue-700 border-blue-300"
                : "bg-gray-100 text-gray-700 border-gray-300"}
            `}
            onClick={() => setGender("MALE")}
          >
            남성
          </button>
          <button
            type="button"
            className={`flex-1 py-3 rounded-lg border transition-colors
              ${gender === "FEMALE"
                ? "bg-pink-100 text-pink-700 border-pink-300"
                : "bg-gray-100 text-gray-700 border-gray-300"}
            `}
            onClick={() => setGender("FEMALE")}
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