"use client";

import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { UserCircleIcon as UserCircleIconSolid } from '@heroicons/react/24/solid';
import FriendListItem from './componenets/FriendListen';
import FriendRequestItem from './componenets/FriendRequestItem';

// Mock Data
const myProfile = {
  name: '김조이',
  avatar: null,
};

const friends = [
  { id: 'friend1', name: '박개발', avatar: null },
  { id: 'friend2', name: '최디자', avatar: null },
  { id: 'friend3', name: '이마케', avatar: null },
];

const friendRequests = [
  { id: 'req1', name: '정기획', avatar: null },
];


const FriendsPage = () => {
  const [activeTab, setActiveTab] = useState('friends'); // 'friends' or 'requests'

  return (
    <div className="bg-neutral-50 text-gray-900 p-6 md:p-12 lg:p-20">
      <PageHeader title="친구 목록" subtitle="함께하는 친구들을 관리해보세요." />

      <div className="mt-8">
        {/* Search Bar Placeholder */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="이름으로 친구 검색"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* My Profile Section */}
        <div className="flex items-center p-3 mb-4">
          {myProfile.avatar ? (
            <img src={myProfile.avatar} alt={myProfile.name} className="w-16 h-16 rounded-full mr-4" />
          ) : (
            <UserCircleIconSolid className="w-16 h-16 text-gray-300 mr-4" />
          )}
          <span className="font-bold text-lg text-gray-800">{myProfile.name}</span>
        </div>

        {/* Divider */}
        <hr className="border-gray-200" />

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mt-4">
          <button
            onClick={() => setActiveTab('friends')}
            className={`px-4 py-2 font-semibold ${activeTab === 'friends' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          >
            친구 {friends.length}
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 font-semibold relative ${activeTab === 'requests' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          >
            받은 요청 {friendRequests.length}
            {friendRequests.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
          </button>
        </div>
      </div>

      {/* Content based on tab */}
      <div className="mt-4">
        {activeTab === 'friends' && (
          <div>
            {friends.map(friend => <FriendListItem key={friend.id} friend={friend} />)}
          </div>
        )}
        {activeTab === 'requests' && (
          <div>
            {friendRequests.map(request => <FriendRequestItem key={request.id} request={request} />)}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-24 right-4 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>

    </div>
  );
};

export default FriendsPage;