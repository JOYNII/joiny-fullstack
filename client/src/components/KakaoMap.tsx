'use client';
import { useEffect, useState } from 'react';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';

interface KakaoMapProps {
  searchKeyword: string;
  onPlaceSelect: (placeName: string) => void;
}

export default function KakaoMap({
  searchKeyword,
  onPlaceSelect,
}: KakaoMapProps) {
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAOMAP_APP_KEY!,
    libraries: ['services'],
  });

  const [info, setInfo] = useState<any>();
  const [markers, setMarkers] = useState<any[]>([]);
  const [map, setMap] = useState<any>();

  useEffect(() => {
    if (!map || !searchKeyword) return;

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(searchKeyword, (data, status, _pagination) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const bounds = new window.kakao.maps.LatLngBounds();
        let markers = [];

        for (var i = 0; i < data.length; i++) {
          markers.push({
            position: {
              lat: data[i].y,
              lng: data[i].x,
            },
            content: data[i].place_name,
          });
          bounds.extend(new window.kakao.maps.LatLng(data[i].y, data[i].x));
        }
        setMarkers(markers);
        map.setBounds(bounds);
      }
    });
  }, [map, searchKeyword]);

  return (
    <>
        <Map
          center={{
            lat: 37.566826,
            lng: 126.9786567,
          }}
          style={{
            width: '100%',
            height: '100vh',
          }}
          level={3}
          onCreate={setMap}
        >
          {markers.map((marker) => (
            <MapMarker
              key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
              position={marker.position}
              onMouseOver={() => setInfo(marker)}
              onMouseOut={() => setInfo(undefined)}
              onClick={() => onPlaceSelect(marker.content)}
            >
              {info && info.content === marker.content && (
                <div style={{ color: '#000' }}>{marker.content}</div>
              )}
            </MapMarker>
          ))}
        </Map>
    </>
  );
}
