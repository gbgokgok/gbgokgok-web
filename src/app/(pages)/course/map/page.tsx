'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import useKakaoMap from '@/lib/hooks/useKakaoMap';
import MapController from '@/components/ui/map-controller';
import MapSearchBar from '@/components/ui/map-search-bar';

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

  return (
    <div className="w-full h-screen relative">
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false`}
        onLoad={() => window.kakao.maps.load(() => {
          initializeMap();
          setIsMapLoaded(true);
        })}
      />
      
      {/* 지도 컨테이너 */}
      <div ref={mapRef} className="w-full h-full z-0" />
      
      {/* 검색바 */}
      <MapSearchBar onSearch={handleSearch} />
      
      {/* 지도 컨트롤러 */}
      <div className="z-10">
        <MapController
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onCurrentLocation={handleCurrentLocation}
        />
      </div>
      
      {/* 로딩 인디케이터 */}
      {isLoading && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md z-40">
          <div className="flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            <span>위치 가져오는 중...</span>
          </div>
        </div>
      )}
      
      {/* 에러 메시지 */}
      {error && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-800 px-4 py-2 rounded-full shadow-md z-40">
          {error}
        </div>
      )}
    </div>
  );
}