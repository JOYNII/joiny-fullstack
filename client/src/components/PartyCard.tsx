import React from "react";
import Link from "next/link";
import InviteButton from "../app/home/components/InviteButton";
import { Party, User } from "../types";
import { getCurrentUser, deleteParty } from "../utils/api";

interface PartyCardProps {
  party: Party;
}

const PartyCard: React.FC<PartyCardProps> = ({ party }) => {
  const { id, partyName, partyDescription, members, maxMembers, date, hostName } = party;
  const currentUser = getCurrentUser();

  const isHost = currentUser && hostName === currentUser.name;
  const isMember = currentUser && members?.some(member => member.id === currentUser.id);


  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // 링크 이동 방지
    if (confirm("정말로 파티를 삭제하시겠습니까? (복구할 수 없습니다)")) {
      try {
        await deleteParty(id);
        alert("파티가 삭제되었습니다.");
        // TODO: 목록 갱신을 위해 부모 컴포넌트 리렌더링 필요 (현재는 새로고침 권장)
        window.location.reload();
      } catch (error) {
        alert("파티 삭제에 실패했습니다.");
      }
    }
  };

  const handleLeave = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("파티 나가기 기능은 상세 페이지에서 가능합니다.");
  };

  return (
    <div className="relative group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-100 flex flex-col h-full">
      {/* 호스트 전용 삭제 버튼 (가시성 강화: z-index, 그림자 추가) */}
      <button
        onClick={handleDelete}
        className="absolute top-3 right-3 p-2 text-gray-500 bg-white hover:text-red-600 hover:bg-red-50 rounded-full transition-all z-50 shadow-sm border border-gray-100 hover:border-red-200"
        title="파티 삭제"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      <div className="flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
            {party.theme || 'Party'}
          </div>
          {/* 날짜 표시 등 기존 코드 유지 가능하지만, 여기서는 공간 확보를 위해 생략하거나 위치 조정 */}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {partyName}
        </h3>

        <p className="text-gray-500 text-sm mb-6 line-clamp-2 h-10">
          {partyDescription}
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <span className="w-20 font-medium text-gray-400">일시</span>
            <span>{date}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="w-20 font-medium text-gray-400">호스트</span>
            <span>{hostName} {isHost && <span className="text-blue-500 text-xs ml-1">(나)</span>}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="w-20 font-medium text-gray-400">참여인원</span>
            <span className="font-medium text-blue-600">
              {members?.length || 0}
            </span>
            <span className="text-gray-400 mx-1">/</span>
            <span>{maxMembers}명</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end space-x-3">
        {/* 하단 버튼 영역 */}
        <Link href={`/party/${id}?${new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').toString()}`} passHref>
          <button className={`px-4 py-2 text-sm font-medium border rounded-lg transition-colors duration-200 tracking-wide ${isMember ? 'text-blue-600 border-blue-200 bg-white hover:bg-blue-50' : 'text-white bg-blue-600 border-transparent hover:bg-blue-700'
            }`}>
            {isMember ? '파티 입장' : '파티 구경하기'}
          </button>
        </Link>
        <InviteButton
          senderName={hostName}
          partyTitle={partyName}
          partyId={id}
        />
      </div>
    </div>
  );
};

export default PartyCard;
