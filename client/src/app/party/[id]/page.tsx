"use client";

import React, { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageHeader from "../../../components/PageHeader";
import { getPartyById, getCurrentUser, joinParty, leaveParty } from "../../../utils/api";

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


  // currentUser가 참여 중인지 확인 (ID 비교 시 형변환 주의)
  // party가 undefined일 수 있으므로 옵셔널 체이닝 및 null 처리 필요
  const memberRecord = (currentUser && party?.members)
    ? party.members.find(member => String(member.id) === String(currentUser.id))
    : null;
  const isMember = !!memberRecord;

  const { mutate: toggleJoinLeave, isPending: isJoinLeavePending } = useMutation({
    mutationFn: () => {
      // 이 함수는 버튼 클릭 시 실행되므로, 이 시점에는 party가 로드되어 rendering 되었음을 보장할 수 있음
      if (!currentUser) throw new Error("로그인이 필요합니다.");

      if (isMember && memberRecord?.participantId) {
        // 이미 멤버라면 탈퇴 (leaveParty)
        return leaveParty(memberRecord.participantId);
      } else {
        // 멤버가 아니면 가입 (joinParty)
        return joinParty(id as string, currentUser.id);
      }
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

  let themeText = party.theme === "christmas" ? "(크리스마스 ver)" : party.theme === "reunion" ? "(동창회 ver)" : "";

  return (
    <div className="min-h-screen bg-neutral-50 text-gray-900 p-6 md:p-12 lg:p-20">
      <PageHeader title={`Invitation ${themeText}`} subtitle={`'${party.partyName}' 파티에 초대합니다!`} />

      <section className="max-w-3xl mx-auto space-y-8">
        <PartyDetails party={party} />

        <div className="bg-white p-8 rounded-xl shadow-md space-y-6">
          <PartyMembers party={party} />
        </div>

        {currentUser ? (
          <JoinLeaveButton
            isMember={isMember}
            isPending={isJoinLeavePending}
            onClick={() => toggleJoinLeave()}
          />
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-2">파티에 참여하려면 로그인이 필요합니다.</p>
          </div>
        )}
      </section>
    </div>
  );


}

