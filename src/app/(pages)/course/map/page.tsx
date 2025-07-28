'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import useKakaoMap from '@/lib/hooks/useKakaoMap';
import MapController from '@/components/ui/map-controller';

export default function MapPage() {
  const {
    mapRef,
    isLoaded,
    initializeMap,
    addMarker,
    zoomIn,
    zoomOut,
    moveToCurrentLocation,
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
      <div ref={mapRef} className="w-full h-full" />
      
      {/* 지도 컨트롤러 */}
      <MapController
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onCurrentLocation={handleCurrentLocation}
      />
      
      {/* 로딩 인디케이터 */}
      {isLoading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md">
          <div className="flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            <span>위치 가져오는 중...</span>
          </div>
        </div>
      )}
      
      {/* 에러 메시지 */}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-800 px-4 py-2 rounded-full shadow-md">
          {error}
        </div>
      )}
    </div>
  );
}