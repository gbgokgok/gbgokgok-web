"use client"

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, Bell, Globe, Cloud, Car, Users, Star, ChevronRight, Home as HomeIcon, User } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 헤더 */}
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <Menu className="w-6 h-6 text-gray-600" />
        <div className="flex items-center space-x-4">
          <Globe className="w-5 h-5 text-gray-600" />
          <Bell className="w-5 h-5 text-gray-600" />
        </div>
      </header>

      {/* 로고 및 검색 */}
      <div className="bg-white px-4 py-6">
        <div className="flex items-center mb-4">
          <Image
            src="/image/logo_blank.png"
            alt="logo"
            width={50}
            height={70}
            className="w-auto h-auto max-h-[50px] sm:max-h-[60px] md:max-h-[70px]"
            priority
          />
          <h1 className="text-2xl font-bold text-gray-800 ml-2">경북곡곡</h1>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input 
            placeholder="여행지 검색하기"
            className="pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-full w-full"
          />
        </div>
        
        <p className="text-sm text-gray-500 mt-2 flex items-center">
          <span className="mr-1">💬</span>
          &ldquo;5분에 따나는 감성 여행&rdquo;, &ldquo;사람 적은 숨은 명소 3선&rdquo;
        </p>
      </div>

      {/* 탭 메뉴 */}
      <div className="bg-white px-4 py-3 border-b">
        <div className="flex space-x-6">
          <button className="text-blue-600 font-medium border-b-2 border-blue-600 pb-2">홈</button>
          <button className="text-gray-500">추천 코스</button>
          <button className="text-gray-500">맛집 랭킹</button>
          <button className="text-gray-500">기능</button>
          <button className="text-gray-500">기능</button>
        </div>
      </div>

      <div className="px-4 space-y-6 pb-20">
        {/* 메인 배너 */}
        <Card className="mt-6 overflow-hidden bg-gradient-to-r from-blue-400 to-green-400 border-0">
          <CardContent className="p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold mb-1">가정의 달</h2>
                <h3 className="text-2xl font-bold mb-2">추천 여행지</h3>
                <p className="text-sm opacity-90">#경북이가족여행</p>
                <p className="text-sm opacity-90">#힐링자연여행</p>
                <Button variant="secondary" className="mt-4 bg-white text-blue-600 hover:bg-gray-100">
                  코스 상세하기
                </Button>
              </div>
              <div className="text-right">
                <Image 
                  src="/image/logo_blank.png" 
                  alt="여행지 이미지" 
                  width={120} 
                  height={80} 
                  className="rounded-lg w-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 날씨 및 교통 정보 */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-700">오늘의 날씨</h4>
                  <p className="text-sm text-gray-500">맑음, 22°C</p>
                  <p className="text-2xl font-bold text-blue-600">24°C</p>
                  <p className="text-xs text-gray-500">습도 45%</p>
                </div>
                <Cloud className="w-12 h-12 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-700">교통 상황</h4>
                  <p className="text-sm text-green-600 font-medium">원활</p>
                  <p className="text-xs text-gray-500">수요 도로 소통 원활</p>
                  <p className="text-xs text-gray-500">교통 혼잡 2단계</p>
                </div>
                <Car className="w-12 h-12 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 지역기반 정보 */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium text-gray-700 mb-3">지역기반정보 제공(날씨/교통상황/)</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-pink-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-pink-600">🎯</span>
                  </div>
                  <div>
                    <p className="font-medium">내 여행 최장 테스트</p>
                    <p className="text-sm text-gray-500">맞춤 코스 추천</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-yellow-600">🎁</span>
                  </div>
                  <div>
                    <p className="font-medium">리더드 이벤트 냥자</p>
                    <p className="text-sm text-gray-500">특가 혜택</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 오늘의 추천 여행코스 */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">오늘의 추천 여행코스예요</h3>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            <Card className="min-w-[200px] bg-gradient-to-br from-purple-100 to-pink-100">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-purple-700">5월에 떠나는 감성 여행</p>
              </CardContent>
            </Card>
            <Card className="min-w-[200px] bg-gradient-to-br from-blue-100 to-green-100">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-blue-700">사람 적은 숨은 명소 3선</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 추천 맛집 여행 코스 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">추천 맛집 여행 코스</h3>
            <button className="text-blue-600 text-sm">더보기</button>
          </div>
          <div className="space-y-3">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">🍽️</span>
                  </div>
                  <div className="flex-1 p-4">
                    <h4 className="font-medium">경주 역사 탐방로 1박 2일 코스</h4>
                    <p className="text-sm text-gray-500 mt-1">천년 고도의 문화 여행</p>
                    <div className="flex items-center mt-2">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-600">4.8</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">🌸</span>
                  </div>
                  <div className="flex-1 p-4">
                    <h4 className="font-medium">포항 해안도로 로맨틱 코스</h4>
                    <p className="text-sm text-gray-500 mt-1">바다와 함께하는 힐링 여행</p>
                    <div className="flex items-center mt-2">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-600">4.6</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 랭킹 섹션 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">무슨 랭킹</h4>
            <div className="space-y-2">
              <div className="text-sm">1. ㄱ</div>
              <div className="text-sm">2. ㄴ</div>
              <div className="text-sm">3. ㄷ</div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-3">관광 랭킹</h4>
            <div className="space-y-2">
              <div className="text-sm">1. 동궁과 월지</div>
              <div className="text-sm">2. 호미곶 해맞이광장</div>
              <div className="text-sm">3. 경주월드</div>
            </div>
          </div>
        </div>

        {/* 커뮤니티 인기글 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">커뮤니티 인기글 top5</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      {item}
                    </span>
                    <div>
                      <p className="text-sm font-medium">경북 숨은 맛집 추천글 {item}</p>
                      <p className="text-xs text-gray-500">2시간 전</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Users className="w-4 h-4 mr-1" />
                    <span className="text-xs">24</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 숨은 명소 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">숨은 명소</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="w-full h-24 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                  <span className="text-gray-400">🏔️</span>
                </div>
                <p className="text-sm font-medium">비밀의 계곡</p>
              </div>
              <div className="text-center">
                <div className="w-full h-24 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                  <span className="text-gray-400">🌸</span>
                </div>
                <p className="text-sm font-medium">벚꽃 숲길</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 하단 탭바 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <button className="flex flex-col items-center py-2">
            <HomeIcon className="w-6 h-6 text-blue-600" />
            <span className="text-xs text-blue-600 mt-1">홈</span>
          </button>
          <button className="flex flex-col items-center py-2">
            <Search className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400 mt-1">검색</span>
          </button>
          <button className="flex flex-col items-center py-2">
            <User className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400 mt-1">마이</span>
          </button>
        </div>
      </div>
    </div>
  );
}
