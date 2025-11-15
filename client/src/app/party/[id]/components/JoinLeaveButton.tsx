
import React from "react";

interface JoinLeaveButtonProps {
  isMember: boolean;
  isPending: boolean;
  onClick: () => void;
}

export default function JoinLeaveButton({ isMember, isPending, onClick }: JoinLeaveButtonProps) {
  return (
    <div className="flex justify-center">
      <button onClick={onClick} disabled={isPending} className={`px-8 py-3 font-bold text-lg rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:cursor-not-allowed ${isMember ? "bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400" : "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400"}`}>
        {isPending ? "처리 중..." : (isMember ? "파티 나가기" : "파티 참여하기")}
      </button>
    </div>
  );
}
