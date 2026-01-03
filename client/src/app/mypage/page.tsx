"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PleaseLogin from "../../components/PleaseLogin";

import { getCurrentUser, logout, getJoinedEvents, getFriendships } from "../../utils/api";
import { User, Party, Friendship } from "../../types";
import ThemeSelectionModal from "../home/components/ThemeSelectionModal";

export default function MyPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [joinedParties, setJoinedParties] = useState<Party[]>([]);
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        try {
          // 병렬로 데이터 가져오기
          const [partiesData, friendsData] = await Promise.all([
            getJoinedEvents(),
            getFriendships()
          ]);
          setJoinedParties(partiesData);
          setFriendships(friendsData);
        } catch (err) {
          console.error("Failed to fetch my page data", err);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return <PleaseLogin />;
  }

  // 친구 목록 필터링 (수락된 친구만)
  const acceptedFriends = friendships
    .filter(f => f.status === 'accepted')
    .map(f => {
      // 내가 from_user인지 to_user인지 확인하여 상대방 정보 추출
      // id 비교 시 문자열/숫자 타입 주의. User.id는 문자열일 수 있음.
      const isFromMe = String(f.from_user.id) === String(user.id);
      return isFromMe ? f.to_user : f.from_user;
    });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더 섹션 */}
      <div className="bg-white shadow-sm pt-12 pb-8 px-6 mb-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600">
              {user.name[0]}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}님</h1>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              router.replace('/auth/login/email');
            }}
            className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-200"
          >
            로그아웃
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* 메인 콘텐츠: 참여 중인 파티 */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">참여 중인 파티 ({joinedParties.length})</h2>

          {joinedParties.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
              <p className="text-gray-500 mb-4">아직 참여 중인 파티가 없습니다.</p>
              <button
                onClick={() => router.push('/home')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                파티 둘러보기
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {joinedParties.map(party => (
                <div
                  key={party.id}
                  onClick={() => router.push(`/party/${party.id}`)}
                  className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer flex justify-between items-center group"
                >
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors">{party.partyName}</h3>
                    <div className="text-sm text-gray-500 mt-1 space-y-1">
                      <p>📅 {party.date}</p>
                      <p>📍 {party.place || '장소 미정'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${party.theme === '술' ? 'bg-amber-100 text-amber-700' :
                      party.theme === '맛집' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                      {party.theme}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 사이드바: 내 친구 목록 */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-xl font-bold text-gray-800">내 친구 ({acceptedFriends.length})</h2>
            <button
              onClick={() => router.push('/friends')}
              className="text-sm text-indigo-600 hover:underline"
            >
              친구 관리
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            {acceptedFriends.length === 0 ? (
              <p className="text-center text-gray-500 py-4 text-sm">등록된 친구가 없습니다.</p>
            ) : (
              <ul className="space-y-3">
                {acceptedFriends.map((friend) => (
                  <li key={friend.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm">
                      {friend.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{friend.name}</p>
                      <p className="text-xs text-gray-500 truncate">{friend.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 추가 기능 제안 섹션 (예시) */}
          <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
            <h3 className="font-bold text-indigo-900 mb-2">💡 새로운 모임이 필요하신가요?</h3>
            <p className="text-sm text-indigo-700 mb-3">직접 파티를 만들어서 친구들을 초대해보세요!</p>
            <button
              id="create-party-button"
              onClick={() => setIsModalOpen(true)}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
            >
              파티 만들기
            </button>
          </div>
        </div>

      </div>
      {isModalOpen && <ThemeSelectionModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}