// src/components/PartyCard.tsx

import React from "react";
import Link from "next/link";
import InviteButton from "../app/home/components/InviteButton";
import { Party } from "../types";

interface PartyCardProps {
  party: Party;
}

const PartyCard: React.FC<PartyCardProps> = ({ party }) => {
  const { id, partyName, partyDescription, members, maxMembers, date } = party;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between border border-gray-100 min-h-[220px]">
      <div>
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold tracking-tight text-gray-900 mb-1">{partyName}</h3>
          <p className="text-sm text-gray-500 flex-shrink-0 ml-4">{date}</p>
        </div>

        {partyDescription && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{partyDescription}</p>
        )}

        <div className="flex items-center space-x-1.5 pt-4">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20h-2m2-9a4 4 0 100-8 4 4 0 000 8zM12 10a4 4 0 100-8 4 4 0 000 8zM4 18v-2a3 3 0 013-3h5.5M19 20v-2a3 3 0 00-3-3H7a3 3 0 00-3 3v2"></path>
          </svg>
          <p className="text-sm font-medium text-gray-600">
            인원: <span className="font-semibold text-blue-700">{members?.length || 0}</span> /{" "}
            {maxMembers}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end space-x-3">
        <Link href={`/party/${id}`} passHref>
          <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 bg-white hover:bg-blue-50 rounded-lg transition-colors duration-200 tracking-wide">
            파티 입장
          </button>
        </Link>
        <InviteButton />
      </div>
    </div>
  );
};

export default PartyCard;
