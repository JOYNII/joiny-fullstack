'use client';

import KakaoMap from "./KakaoMap";

interface LocationViewModalProps {
    placeName: string;
    onClose: () => void;
}

export default function LocationViewModal({ placeName, onClose }: LocationViewModalProps) {
    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex justify-center items-center p-4 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden relative" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2 truncate pr-4">
                        📍 <span className="truncate">{placeName}</span>
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors shrink-0">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Map Body */}
                <div className="h-[400px] w-full relative">
                    {/* KakaoMap 재사용: placeName을 검색어로 전달, 선택 핸들러는 무시 */}
                    <KakaoMap searchKeyword={placeName} onPlaceSelect={() => { }} />

                    {/* 안내 문구 오버레이 */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 rounded-full text-xs font-medium text-gray-600 shadow-sm z-10 pointer-events-none">
                        검색된 위치가 표시됩니다
                    </div>
                </div>
            </div>
        </div>
    );
}
