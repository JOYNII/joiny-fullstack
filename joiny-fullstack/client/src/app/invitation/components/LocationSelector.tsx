"use client";

import { useState } from "react";
import KakaoMap from "../../../components/KakaoMap";

interface LocationSelectorProps {
  onConfirm: (placeName: string) => void;
  onCancel: () => void;
}

export default function LocationSelector({
  onConfirm,
  onCancel,
}: LocationSelectorProps) {
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);

  const handleSearch = () => {
    setSearchKeyword(keyword);
  };

  const handleSelectPlace = (placeName: string) => {
    setSelectedPlace(placeName);
  };

  const handleConfirmPlace = () => {
    if (selectedPlace) {
      onConfirm(selectedPlace);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-2xl p-6 md:p-8 space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tighter text-gray-900">
              장소 선택
            </h1>
            <p className="mt-1 text-md text-gray-500 font-light">
              파티 장소를 검색하고 지도에서 선택해주세요.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </header>

        <section className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="장소를 검색하세요"
              className="flex-grow p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
            />
            <button
              onClick={handleSearch}
              className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              검색
            </button>
          </div>

          {selectedPlace && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between text-lg">
              <span className="text-gray-900">
                <strong>선택된 장소:</strong> {selectedPlace}
              </span>
            </div>
          )}

          <div className="w-full h-[50vh] rounded-lg overflow-hidden shadow-md">
            <KakaoMap
              searchKeyword={searchKeyword}
              onPlaceSelect={handleSelectPlace}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              onClick={onCancel}
              className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
            >
              취소
            </button>
            <button
              onClick={handleConfirmPlace}
              disabled={!selectedPlace}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              이 장소로 설정
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
