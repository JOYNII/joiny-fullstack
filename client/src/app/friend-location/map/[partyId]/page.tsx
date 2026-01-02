'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import { useSocket } from '../../../../hooks/useSocket';
import PageHeader from '../../../../components/PageHeader';
import PartyChat from '../../../../components/PartyChat';
import { getCurrentUser } from '../../../../utils/api';

interface LocationData {
    party_id: string;
    user_id: string;
    user_name: string;
    lat: number;
    lng: number;
}

export default function FriendMapPage() {
    const params = useParams();
    const partyId = params.partyId as string;
    const currentUser = getCurrentUser();
    const [markers, setMarkers] = useState<Record<string, LocationData>>({});
    const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null);

    // Connect to /location namespace
    const { socket, isConnected } = useSocket('/location');

    // Initialize Kakao Map Loader
    const [loading, error] = useKakaoLoader({
        appkey: process.env.NEXT_PUBLIC_KAKAO_JS_KEY!,
        libraries: ['services'],
    });

    // Socket Interactions
    useEffect(() => {
        if (!socket) return;

        socket.emit('join_party', { party_id: partyId });

        socket.on('location_update', (data: LocationData) => {
            // Assuming backend broadcasts to others (skip_sid used in server)
            setMarkers((prev) => ({
                ...prev,
                [data.user_id]: data,
            }));
        });

        return () => {
            socket.off('location_update');
            socket.emit('leave_party', { party_id: partyId });
        };
    }, [socket, partyId]);

    // Geolocation Tracking
    useEffect(() => {
        // Check if tracking is enabled for this party (from localStorage set in previous page)
        const savedStates = localStorage.getItem('trackingStates');
        const trackingEnabled = savedStates ? JSON.parse(savedStates)[partyId] : false;

        if (!trackingEnabled || !socket) return;

        if (!navigator.geolocation) {
            console.error('Geolocation is not supported by this browser.');
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setMyLocation({ lat: latitude, lng: longitude });

                // Emit location to server
                socket.emit('location_update', {
                    party_id: partyId,
                    user_id: currentUser.id,
                    user_name: currentUser.name,
                    lat: latitude,
                    lng: longitude,
                });
            },
            (error) => {
                console.error(`Error getting location (Code ${error.code}): ${error.message}`);
            },
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 0,
            }
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, [socket, partyId, currentUser]);

    if (loading) return <div className="flex items-center justify-center h-screen">Map Loading...</div>;
    if (error) return <div className="flex items-center justify-center h-screen">Error loading map</div>;

    return (
        <div className='relative h-screen flex flex-col'>
            {/* Floating Header */}
            <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-white/90 to-transparent pointer-events-none">
                <div className="pointer-events-auto">
                    <PageHeader title="실시간 위치" showBackButton={true} />
                </div>
            </div>

            <Map
                center={myLocation || { lat: 37.5665, lng: 126.9780 }}
                style={{ width: '100%', height: '100%' }}
                level={3}
            >
                {/* My Location Marker */}
                {myLocation && (
                    <MapMarker
                        position={myLocation}
                        image={{
                            src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png", // Example Red Marker for self
                            size: { width: 34, height: 40 },
                        }}
                    >
                        <div style={{ padding: '4px', color: '#000', fontSize: '12px' }}>나 ({currentUser.name})</div>
                    </MapMarker>
                )}

                {/* Friends Markers */}
                {Object.values(markers).map((marker) => (
                    <MapMarker
                        key={marker.user_id}
                        position={{ lat: marker.lat, lng: marker.lng }}
                        image={{
                            src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_blue.png", // Example Blue Marker for friends
                            size: { width: 34, height: 40 },
                        }}
                    >
                        <div style={{ padding: '4px', color: '#000', fontSize: '12px' }}>{marker.user_name}</div>
                    </MapMarker>
                ))}
            </Map>

            {/* Chat Overlay */}
            <PartyChat partyId={partyId} />
        </div>
    );
}
