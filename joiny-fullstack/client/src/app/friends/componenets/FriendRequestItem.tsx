"use client";

import React from 'react';
import { UserCircleIcon as UserCircleIconSolid } from '@heroicons/react/24/solid';

const FriendRequestItem = ({ request }) => (
  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
    <div className="flex items-center">
      {request.avatar ? (
        <img src={request.avatar} alt={request.name} className="w-12 h-12 rounded-full mr-4" />
      ) : (
        <UserCircleIconSolid className="w-12 h-12 text-gray-300 mr-4" />
      )}
      <span className="font-medium text-gray-800">{request.name}</span>
    </div>
    <div className="flex space-x-2">
      <button className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">수락</button>
      <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300">거절</button>
    </div>
  </div>
);

export default FriendRequestItem;
