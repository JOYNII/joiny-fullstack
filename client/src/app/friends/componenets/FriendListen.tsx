"use client";

import React from 'react';
import { UserCircleIcon as UserCircleIconSolid } from '@heroicons/react/24/solid';

const FriendListItem = ({ friend }) => (
  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
    <div className="flex items-center">
      {friend.avatar ? (
        <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-full mr-4" />
      ) : (
        <UserCircleIconSolid className="w-12 h-12 text-gray-300 mr-4" />
      )}
      <span className="font-medium text-gray-800">{friend.name}</span>
    </div>
    {/* Kebab menu for actions can go here */}
  </div>
);

export default FriendListItem;
