"use client";

import React, { useEffect } from 'react';
import { shareInvitation, initKakao } from '../../../utils/kakao';

interface InviteButtonProps {
  senderName?: string;
  partyTitle?: string;
  partyId?: string;
}

const InviteButton = ({
  senderName = "김조이",
  partyTitle = "한강 치맥 파티",
  partyId = "1"
}: InviteButtonProps) => {

  useEffect(() => {
    // 컴포넌트 마운트 시 SDK 초기화 시도
    initKakao();
  }, []);

  const handleShare = () => {
    shareInvitation(senderName, partyTitle, partyId);
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="px-4 py-2 text-sm font-medium text-[#191919] bg-[#FEE500] hover:bg-[#E6D000] rounded-lg transition-colors duration-200 tracking-wide font-bold flex items-center justify-center gap-2"
    >
      {/* Kakao Icon */}
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 3C5.373 3 0 7.373 0 12.768c0 3.655 2.457 6.804 6.162 8.528-.27 3.018-1.077 5.768-1.127 5.952-.163.606.505.992.836.568 0 0 4.792-6.103 4.976-6.326.685.12 1.397.18 2.122.18 6.627 0 12-4.373 12-9.768S16.627 3 12 3z" />
      </svg>
      초대하기
    </button>
  );
};

export default InviteButton;
