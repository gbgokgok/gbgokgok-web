import { useRef, useEffect, useState, useCallback } from 'react';

interface MapOptions {
  center?: {
    lat: number;
    lng: number;
  };
  level?: number;
}

interface Marker {
  position: {
    lat: number;
    lng: number;
  };
  content?: string;
}

export default function useKakaoMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLocationMarker, setCurrentLocationMarker] = useState<any>(null);

  // 지도 초기화
  const initializeMap = useCallback((options: MapOptions = {}) => {
    if (!mapRef.current || !window.kakao?.maps) return;

    const { center = { lat: 36.575895656660265, lng: 128.50577160755265 }, level = 9 } = options;
    
    const mapOptions = {
      center: new window.kakao.maps.LatLng(center.lat, center.lng),
      level,
    };

    const mapInstance = new window.kakao.maps.Map(mapRef.current, mapOptions);
    setMap(mapInstance);
    setIsLoaded(true);
    
    return mapInstance;
  }, []);

  // 마커 추가
  const addMarker = useCallback((markerOptions: Marker) => {
    if (!map || !window.kakao?.maps) return;

    const position = new window.kakao.maps.LatLng(
      markerOptions.position.lat,
      markerOptions.position.lng
    );

    const marker = new window.kakao.maps.Marker({
      position,
      map,
    });

    // 인포윈도우 추가 (선택 사항)
    if (markerOptions.content) {
      const infowindow = new window.kakao.maps.InfoWindow({
        content: markerOptions.content,
      });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        infowindow.open(map, marker);
      });
    }

    setMarkers((prev) => [...prev, marker]);
    return marker;
  }, [map]);

  // 마커 모두 제거
  const clearMarkers = useCallback(() => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  }, [markers]);

  // 지도 중심 위치 변경
  const setCenter = useCallback((lat: number, lng: number) => {
    if (!map) return;
    map.setCenter(new window.kakao.maps.LatLng(lat, lng));
  }, [map]);

  // 지도 확대/축소 레벨 변경
  const setLevel = useCallback((level: number) => {
    if (!map) return;
    map.setLevel(level);
  }, [map]);

  // 현재 레벨 가져오기
  const getLevel = useCallback(() => {
    if (!map) return 3;
    return map.getLevel();
  }, [map]);

  // 줌 인
  const zoomIn = useCallback(() => {
    if (!map) return;
    const currentLevel = map.getLevel();
    map.setLevel(currentLevel - 1);
  }, [map]);

  // 줌 아웃
  const zoomOut = useCallback(() => {
    if (!map) return;
    const currentLevel = map.getLevel();
    map.setLevel(currentLevel + 1);
  }, [map]);

  // 현재 위치 가져오기
  const getCurrentLocation = useCallback(() => {
    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ lat: latitude, lng: longitude });
        },
        (error) => {
          reject(error);
        }
      );
    });
  }, []);

  // 현재 위치로 이동
  const moveToCurrentLocation = useCallback(async () => {
    try {
      const { lat, lng } = await getCurrentLocation();
      
      // 현재 위치로 지도 이동
      setCenter(lat, lng);
      
      // 기존 현재 위치 마커 제거
      if (currentLocationMarker) {
        currentLocationMarker.setMap(null);
      }
      
      // 새 마커 생성
      if (map && window.kakao?.maps) {
        const markerPosition = new window.kakao.maps.LatLng(lat, lng);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          map: map,
        });
        
        const infowindow = new window.kakao.maps.InfoWindow({
          content: '<div style="padding:5px;">현재 위치</div>',
        });
        
        infowindow.open(map, marker);
        setCurrentLocationMarker(marker);
      }
      
      return { lat, lng };
    } catch (error) {
      console.error('Failed to get current location:', error);
      throw error;
    }
  }, [map, setCenter, currentLocationMarker]);

  return {
    mapRef,
    map,
    isLoaded,
    initializeMap,
    addMarker,
    clearMarkers,
    setCenter,
    setLevel,
    getLevel,
    zoomIn,
    zoomOut,
    getCurrentLocation,
    moveToCurrentLocation,
  };
} 