interface KakaoMapOptions {
  center: KakaoLatLng;
  level: number;
  draggable?: boolean;
  scrollwheel?: boolean;
  disableDoubleClickZoom?: boolean;
}

interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}

interface KakaoMarkerOptions {
  position: KakaoLatLng;
  map?: KakaoMap;
}

interface KakaoInfoWindowOptions {
  content: string;
}

interface KakaoInfoWindow {
  open(map: KakaoMap, marker: KakaoMarker): void;
}

interface KakaoMarker {
  setMap(map: KakaoMap | null): void;
}

interface KakaoMap {
  setCenter(latlng: KakaoLatLng): void;
  setLevel(level: number): void;
  getLevel(): number;
}

interface KakaoMapsEvent {
  addListener(instance: object, eventName: string, handler: () => void): void;
}

interface KakaoMaps {
  Map: new (container: HTMLElement, options: KakaoMapOptions) => KakaoMap;
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  Marker: new (options: KakaoMarkerOptions) => KakaoMarker;
  InfoWindow: new (options: KakaoInfoWindowOptions) => KakaoInfoWindow;
  event: KakaoMapsEvent;
  load(callback: () => void): void;
}

interface Window {
  kakao: {
    maps: KakaoMaps;
  };
} 