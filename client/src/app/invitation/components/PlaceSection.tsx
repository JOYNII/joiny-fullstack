import React from 'react';

interface PlaceSectionProps {
  place: string;
  onSelectClick: () => void;
}

export default function PlaceSection({ place, onSelectClick }: PlaceSectionProps) {
  return (
    <div id="place-section">
      <label className="text-lg font-semibold text-gray-700">장소</label>
      {place ? (
        <div className="mt-2 flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg text-lg">
          <span className="text-gray-900">{place}</span>
          <button onClick={onSelectClick} className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition">변경</button>
        </div>
      ) : (
        <div onClick={onSelectClick} className="mt-2 w-full p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg text-lg text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition flex items-center justify-center cursor-pointer">
            <span>선택하기</span>
        </div>
      )}
    </div>
  );
}