
import React from "react";
import { Party } from "../../../../types";

interface PartyMembersProps {
  party: Party;
}

export default function PartyMembers({ party }: PartyMembersProps) {
  return (
    <div className="pt-6 border-t">
      <h3 className="font-semibold text-gray-800 mb-4">참여 인원 ({party.members.length} / {party.maxMembers})</h3>
      <div className="flex flex-wrap gap-4">
        {party.members.map(member => (
          <div key={member.id} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{member.name}</div>
        ))}
      </div>
    </div>
  );
}
