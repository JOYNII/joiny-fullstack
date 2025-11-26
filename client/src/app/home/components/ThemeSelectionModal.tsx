"use client";

import React from "react";
import Link from "next/link";

interface ThemeSelectionModalProps {
  onClose: () => void;
}

const themes = [
  {
    name: "기본",
    value: "default",
    description: "가장 기본적인 초대장입니다.",
  },
  {
    name: "크리스마스",
    value: "christmas",
    description: "연말 파티를 위한 테마입니다.",
  },
  {
    name: "동창회",
    value: "reunion",
    description: "오랜 친구들과의 모임을 위한 테마입니다.",
  },
];

const ThemeSelectionModal: React.FC<ThemeSelectionModalProps> = ({
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-8 m-4 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">테마 선택</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            &times;
          </button>
        </div>
        <p className="text-gray-600 mb-8">어떤 테마의 파티를 만드시겠어요?</p>
        <div className="space-y-4">
          {themes.map((theme) => (
            <Link
              key={theme.value}
              href={`/invitation?theme=${theme.value}`}
              className="block p-6 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-200"
            >
              <h3 className="font-semibold text-lg text-gray-900">
                {theme.name}
              </h3>
              <p className="text-gray-500 text-sm">{theme.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelectionModal;
