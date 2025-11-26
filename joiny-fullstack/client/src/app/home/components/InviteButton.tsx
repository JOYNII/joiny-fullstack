"use client";

import React from 'react';

const InviteButton = () => {
  // Web Share API가 사용 가능한지 확인하는 함수
  const isShareAvailable = () => {
    // navigator.share는 보안 컨텍스트(HTTPS)에서만 작동합니다.
    return navigator.share && window.isSecureContext;
  };

  // 공유하기 버튼 클릭 핸들러
  const handleShare = async () => {
    const shareData = {
      title: "💌 조이니 파티에 초대합니다!",
      text: "함께 즐거운 시간을 보내요. 자세한 내용은 아래 링크를 확인해주세요.",
      url: window.location.href,
    };

    if (isShareAvailable()) {
      try {
        await navigator.share(shareData);
        console.log("공유 성공!");
      } catch (error) {
        console.error("공유 실패 또는 취소:", error);
      }
    } else {
      // Web Share API를 사용할 수 없을 때 클립보드 복사 시도
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert("링크가 복사되었습니다!");
      } catch (err) {
        // 클립보드 복사도 실패하면 수동 복사를 위한 prompt 표시
        console.error("링크 복사 실패:", err);
        window.prompt("아래 링크를 복사하여 공유하세요:", shareData.url);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors duration-200 tracking-wide"
    >
      초대
    </button>
  );
};

export default InviteButton;
