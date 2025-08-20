'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import useKakaoMap from '@/lib/hooks/useKakaoMap';
import MapController from '@/components/ui/map-controller';
import MapSearchBar from '@/components/pages/_course/tour-search-bar';
import dynamic from "next/dynamic";

// Drawer 동적 import
const CourseDrawer = dynamic(
  () => import("@/components/pages/_course/tourinfo_drawer"),
  { ssr: false }
);

export default function MapPage() {
  const {
    mapRef,
    initializeMap,
    addMarker,
    zoomIn,
    zoomOut,
    moveToCurrentLocation,
    setCenter,
  } = useKakaoMap();
  
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCourseIdx, setSelectedCourseIdx] = useState<number | null>(null);
  const [coursePlaces, setCoursePlaces] = useState<(string | null)[]>([null, null, null]);

  // 카카오맵 API 키
  const KAKAO_MAP_API_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY || '';

  // 지도가 로드되면 초기화
  useEffect(() => {
    if (window.kakao && window.kakao.maps && !isMapLoaded) {
      initializeMap();
      setIsMapLoaded(true);
    }
  }, [initializeMap, isMapLoaded]);

  // 현재 위치로 이동
  const handleCurrentLocation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await moveToCurrentLocation();
    } catch (err) {
      setError('현재 위치를 가져오는데 실패했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 검색 처리
  const handleSearch = (query: string) => {
    // 실제 구현에서는 API 호출 등을 통해 검색 결과를 가져옴
    console.log('검색어:', query);
    
    // 예시: 검색어를 기반으로 특정 위치로 이동
    const searchLocation = {
      lat: 36.575895656660265, 
      lng: 128.50577160755265
    };
    
    setCenter(searchLocation.lat, searchLocation.lng);
    
    // 마커 추가
    addMarker({
      position: { lat: searchLocation.lat, lng: searchLocation.lng },
      content: query,
    });
  };

  // 관광지 선택 시
  const handleSelectPlace = (place: string) => {
    if (selectedCourseIdx !== null) {
      const newPlaces = [...coursePlaces];
      newPlaces[selectedCourseIdx] = place;
      setCoursePlaces(newPlaces);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {/* 상단: 지도 */}
      <div className="relative w-full h-1/2">
        {/* 뒤로가기 버튼 */}
        <button
          className="absolute top-4 left-4 z-20 bg-white/60 hover:bg-white/90 rounded-full p-2 shadow-md transition"
          onClick={() => window.history.back()}
          aria-label="뒤로가기"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <Script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false`}
          onLoad={() => window.kakao.maps.load(() => {
            initializeMap();
            setIsMapLoaded(true);
          })}
        />
        <div ref={mapRef} className="w-full h-full z-0" />
        {/* 지도 컨트롤러 */}
        <div className="absolute right-0 z-10">
          <MapController
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onCurrentLocation={handleCurrentLocation}
          />
        </div>
        {/* 로딩/에러 */}
        {isLoading && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md z-40">
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
              <span>위치 가져오는 중...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-800 px-4 py-2 rounded-full shadow-md z-40">
            {error}
          </div>
        )}
      </div>
      {/* 하단: 코스 목록 */}
      <div className="w-full h-1/2 overflow-y-auto bg-[#f5f5f5] border-t">
        <div className="p-4">
          {/* 코스명 및 여행지1, 도착시간 */}
          <div className="flex justify-between items-center border-b pb-2 mb-2">
            <input
              className="font-bold text-base bg-transparent outline-none"
              placeholder="코스명"
            />
            <div className="flex gap-2 text-xs">
              <span>여행지1</span>
              <span>도착시간</span>
            </div>
          </div>
          {/* 코스 반복 예시 */}
          {[0, 1, 2].map((idx) => (
            <div key={idx} className="bg-white rounded border mb-2 p-2">
              <div className="flex justify-between items-center mb-1">
                <button
                  className="bg-gray-200 px-2 py-1 rounded text-xs font-semibold"
                  onClick={() => {
                    setSelectedCourseIdx(idx);
                    setDrawerOpen(true);
                  }}
                >
                  검색(관광지)
                </button>
                <div className="text-xs text-gray-500 min-w-[80px]">
                  {coursePlaces[idx] ? coursePlaces[idx] : "선택 장소(도로명주소)"}
                </div>
                <div className="text-xs text-gray-500">체류시간<br />예상시간</div>
              </div>
              <div className="text-xs text-center text-gray-400 border-t pt-1">
                이동시간
              </div>
            </div>
          ))}
        </div>
        {/* Drawer 컴포넌트 */}
        <CourseDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          onSelectPlace={handleSelectPlace}
        />
      </div>
    </div>
  );
}