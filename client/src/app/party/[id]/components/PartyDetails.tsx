
import React from "react";
import { Party } from "../../../../types";

interface PartyDetailsProps {
  party: Party;
}

export default function PartyDetails({ party }: PartyDetailsProps) {
  let themeText = party.theme === "christmas" ? "(크리스마스 ver)" : party.theme === "reunion" ? "(동창회 ver)" : "";

  return (
    <div className="bg-white p-8 rounded-xl shadow-md space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div className="font-semibold text-gray-500">주최자</div>
        <div>{party.hostName}</div>

        <div className="font-semibold text-gray-500">파티명</div>
        <div>{party.partyName}</div>

        <div className="font-semibold text-gray-500">일자</div>
        <div>{party.partyDate}</div>
        
        <div className="font-semibold text-gray-500">장소</div>
        <div>{party.place}</div>

        <div className="font-semibold text-gray-500">음식</div>
        <div>{party.partyFood}</div>

        <div className="font-semibold text-gray-500">회비</div>
        <div>{party.fee}</div>
        
        <div className="md:col-span-2 font-semibold text-gray-500">설명</div>
        <div className="md:col-span-2 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">{party.partyDescription}</div>
      </div>
    </div>
  );
}
