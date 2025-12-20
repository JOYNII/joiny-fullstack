"use client";

import React, { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageHeader from "../../../components/PageHeader";
import { getPartyById, getCurrentUser, joinParty } from "../../../utils/api";

import { Party } from "../../../types";
import PartyDetails from "./components/PartyDetails";
import PartyMembers from "./components/PartyMembers";
import JoinLeaveButton from "./components/JoinLeaveButton";
import { useErrorNotification } from "../../../hooks/useErrorNotification";

export default function PartyDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { id } = params;
  const { notifyError } = useErrorNotification();

  const currentUser = useMemo(() => getCurrentUser(), [searchParams]);

  const { data: party, isLoading, error } = useQuery<Party | undefined>({
    queryKey: ['party', id],
    queryFn: () => getPartyById(id as string),
    enabled: !!id,
  });


  const { mutate: toggleJoinLeave, isPending: isJoinLeavePending } = useMutation({
    mutationFn: () => {
      return joinParty(id as string, currentUser.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['party', id] });
    },
    onError: (error: Error) => {
      notifyError(error.message);
    }
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><p>파티 정보를 불러오는 중...</p></div>;
  }

  if (error || !party) {
    return <div className="min-h-screen flex items-center justify-center"><p>파티를 찾을 수 없거나 오류가 발생했습니다.</p></div>;
  }

  const isMember = party.members.some(member => member.id === currentUser.id);
  let themeText = party.theme === "christmas" ? "(크리스마스 ver)" : party.theme === "reunion" ? "(동창회 ver)" : "";

  return (
    <div className="min-h-screen bg-neutral-50 text-gray-900 p-6 md:p-12 lg:p-20">
      <PageHeader title={`Invitation ${themeText}`} subtitle={`'${party.partyName}' 파티에 초대합니다!`} />

      <section className="max-w-3xl mx-auto space-y-8">
        <PartyDetails party={party} />

        <div className="bg-white p-8 rounded-xl shadow-md space-y-6">
          <PartyMembers party={party} />
        </div>

        <JoinLeaveButton
          isMember={isMember}
          isPending={isJoinLeavePending}
          onClick={() => toggleJoinLeave()}
        />
      </section>
    </div>
  );
}
