"use client";

import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import { UserCircleIcon as UserCircleIconSolid } from '@heroicons/react/24/solid';
import FriendListItem from './componenets/FriendListen';
import FriendRequestItem from './componenets/FriendRequestItem';
import { getCurrentUser, getFriendships, requestFriend, acceptFriend, removeFriend } from '../../utils/api';
import PleaseLogin from '../../components/PleaseLogin';
import { User, Friendship } from '../../types';




const FriendsPage = () => {
  const [activeTab, setActiveTab] = useState('friends');
  const [user, setUser] = useState<User | null>(null);
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState(''); // 검색할 이메일 상태
  const [isSearching, setIsSearching] = useState(false); // 검색/추가 로딩 상태

  const fetchFriendships = async () => {
    try {
      const data = await getFriendships();
      setFriendships(data);
    } catch (error) {
      console.error('Failed to fetch friendships', error);
    }
  };

  useEffect(() => {
    const userData = getCurrentUser();
    setUser(userData);
    if (userData) {
      fetchFriendships();
    }
    setLoading(false);

    const handleStorageChange = () => {
      setUser(getCurrentUser());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSendRequest = async () => {
    if (!searchEmail.trim()) {
      alert('이메일을 입력해주세요.');
      return;
    }
    setIsSearching(true);
    try {
      await requestFriend(searchEmail);
      alert('친구 요청을 보냈습니다.');
      setSearchEmail('');
      fetchFriendships(); // 목록 갱신
    } catch (e: any) {
      alert(e.message || '친구 요청 실패');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAccept = async (id: number) => {
    if (!confirm('친구 요청을 수락하시겠습니까?')) return;
    try {
      await acceptFriend(id);
      fetchFriendships();
    } catch (e) {
      alert('수락 실패');
    }
  };

  const handleRejectOrDelete = async (id: number) => {
    if (!confirm('정말 삭제/거절 하시겠습니까?')) return;
    try {
      await removeFriend(id);
      fetchFriendships();
    } catch (e) {
      alert('요청 처리 실패');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <PleaseLogin />;

  // 친구 목록 필터링
  // 1. accepted 상태
  // 2. pending 상태 중 내가 받은 요청 (to_user가 나)

  const acceptedFriends = friendships
    .filter(f => f.status === 'accepted')
    .map(f => {
      // 상대방 정보 찾기
      const friendUser = String(f.from_user.id) === String(user.id) ? f.to_user : f.from_user;
      return {
        id: friendUser.id,
        name: friendUser.name,
        avatar: friendUser.image,
        friendshipId: f.id, // 삭제를 위해 필요
      };
    });

  const receivedRequests = friendships
    .filter(f => f.status === 'pending' && String(f.to_user.id) === String(user.id))
    .map(f => ({
      id: f.from_user.id,
      name: f.from_user.name,
      avatar: f.from_user.image,
      friendshipId: f.id,
    }));

  return (
    <div className="bg-neutral-50 text-gray-900 p-6 md:p-12 lg:p-20 min-h-screen">
      <PageHeader title="친구 목록" subtitle="함께하는 친구들을 관리해보세요." />

      <div className="mt-8 max-w-2xl mx-auto">
        {/* Search Bar for Adding Friends */}
        <div className="mb-8 flex gap-2">
          <input
            type="email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendRequest()}
            placeholder="이메일로 친구 추가"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <button
            onClick={handleSendRequest}
            disabled={isSearching}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:bg-gray-400"
          >
            {isSearching ? '전송중...' : '요청'}
          </button>
        </div>

        {/* My Profile Section */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center">
          <UserCircleIconSolid className="w-16 h-16 text-gray-300 mr-4" />
          <div>
            <p className="text-sm text-gray-500 mb-1">내 프로필</p>
            <h3 className="font-bold text-xl text-gray-800">{user.name}</h3>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mt-8 mb-4">
          <button
            onClick={() => setActiveTab('friends')}
            className={`px-6 py-3 font-semibold text-lg transition-colors ${activeTab === 'friends' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            친구 <span className="ml-1 text-sm bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">{acceptedFriends.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-3 font-semibold text-lg transition-colors relative ${activeTab === 'requests' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            받은 요청
            <span className="ml-1 text-sm bg-red-100 px-2 py-0.5 rounded-full text-red-600">{receivedRequests.length}</span>
            {receivedRequests.length > 0 && <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
          </button>
        </div>
      </div>

      {/* Content based on tab */}
      <div className="mt-4 max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[300px] p-4">
        {activeTab === 'friends' && (
          <div className="space-y-1">
            {acceptedFriends.length === 0 ? (
              <div className="text-center py-20 text-gray-400">아직 친구가 없습니다.<br />이메일로 친구를 추가해보세요!</div>
            ) : (
              acceptedFriends.map(friend => (
                <FriendListItem key={friend.friendshipId} friend={friend} />
              ))
            )}
          </div>
        )}
        {activeTab === 'requests' && (
          <div className="space-y-1">
            {receivedRequests.length === 0 ? (
              <div className="text-center py-20 text-gray-400">받은 친구 요청이 없습니다.</div>
            ) : (
              receivedRequests.map(request => (
                <FriendRequestItem
                  key={request.friendshipId}
                  request={request}
                  onAccept={() => handleAccept(request.friendshipId)}
                  onReject={() => handleRejectOrDelete(request.friendshipId)}
                />
              ))
            )}
          </div>
        )}
      </div>

    </div>
  );
};


export default FriendsPage;