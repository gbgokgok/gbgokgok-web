'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

interface MiniMapProps {
  width?: string;
  height?: string;
  className?: string;
  navigateTo?: string;
}

export default function MiniMap({
  width = '100%',
  height = '100%',
  className = '',
  navigateTo = '/course/map',
}: MiniMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<KakaoMap | null>(null);
  const router = useRouter();

  // 경상북도청 좌표
  const gyeongbukCoords = { lat: 36.575895656660265, lng: 128.50577160755265 };

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || !window.kakao?.maps) return;

      const options = {
        center: new window.kakao.maps.LatLng(gyeongbukCoords.lat, gyeongbukCoords.lng),
        level: 9,
        draggable: false,
        scrollwheel: false,
        disableDoubleClickZoom: true,
      };

      const map = new window.kakao.maps.Map(mapRef.current, options);
      mapInstance.current = map;

      // 마커 추가
      new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(gyeongbukCoords.lat, gyeongbukCoords.lng),
        map: map
      });

      // 클릭 이벤트 추가
      window.kakao.maps.event.addListener(map, 'click', () => {
        if (navigateTo) {
          router.push(navigateTo);
        }
      });
    };

    if (window.kakao && window.kakao.maps) {
      initMap();
    }
  }, [navigateTo, router, gyeongbukCoords.lat, gyeongbukCoords.lng]);

  return (
    <>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`}
        onLoad={() => window.kakao.maps.load(() => {
          if (mapRef.current && !mapInstance.current) {
            const options = {
              center: new window.kakao.maps.LatLng(gyeongbukCoords.lat, gyeongbukCoords.lng),
              level: 9,
              draggable: false,
              scrollwheel: false,
              disableDoubleClickZoom: true,
            };
            
            const map = new window.kakao.maps.Map(mapRef.current, options);
            mapInstance.current = map;
            
            // 마커 추가
            new window.kakao.maps.Marker({
              position: new window.kakao.maps.LatLng(gyeongbukCoords.lat, gyeongbukCoords.lng),
              map: map
            });
            
            // 클릭 이벤트 추가
            window.kakao.maps.event.addListener(map, 'click', () => {
              if (navigateTo) {
                router.push(navigateTo);
              }
            });
          }
        })}
      />
      <div
        ref={mapRef}
        style={{ width, height, cursor: 'pointer' }}
        className={`relative rounded-lg overflow-hidden ${className}`}
      />
    </>
  );
} 