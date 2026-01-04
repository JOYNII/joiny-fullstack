"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LocationSelector from "./components/LocationSelector";
import PlaceSection from "./components/PlaceSection";

import FormField from "../../components/FormField";
import PageHeader from "../../components/PageHeader";
import FeeSelector from "../../components/FeeSelector";
import { createParty } from "../../utils/api";

export default function InvitationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const theme = searchParams.get("theme");

  const { mutate, isPending } = useMutation({
    mutationFn: createParty,
    onSuccess: () => {
      // When the mutation is successful, invalidate the parties query to refetch
      queryClient.invalidateQueries({ queryKey: ['parties'] });
      router.push("/home");
    },
    onError: (error) => {
      // Handle error, e.g., show a notification
      console.error("Failed to create party:", error);
      alert("파티 생성에 실패했습니다.");
    },
  });

  let themeText = "";
  if (theme === "christmas") {
    themeText = "(크리스마스 ver)";
  } else if (theme === "reunion") {
    themeText = "(동창회 ver)";
  }

  const [place, setPlace] = useState("");
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [hostName, setHostName] = useState("");
  const [fee, setFee] = useState<number | string>("");
  const [partyName, setPartyName] = useState("");
  const [partyDate, setPartyDate] = useState("");
  const [partyDescription, setPartyDescription] = useState("");
  const [partyFood, setPartyFood] = useState("");

  const handleConfirmPlace = (selectedPlace: string) => {
    setPlace(selectedPlace);
    setIsSelectingLocation(false);
  };

  const handleSave = () => {
    // Basic validation
    if (!hostName || !partyName || !partyDate) {
      alert("주최자, 파티명, 일자는 필수 항목입니다.");
      return;
    }

    const feeValue = typeof fee === 'string' && fee === '' ? 0 : Number(fee);

    mutate({
      theme,
      hostName,
      partyName,
      date: partyDate,
      partyDescription,
      place,
      partyFood,
      fee: feeValue,
      maxMembers: 10,
    });
  };

  return (
    <>
      <div className="min-h-screen bg-neutral-50 text-gray-900 p-6 md:p-12 lg:p-20">
        <PageHeader
          title={`Invitation ${themeText}`}
          subtitle="특별한 파티를 계획하고 친구들을 초대해보세요."
        />

        <section className="max-w-3xl space-y-10">
          <FormField
            label="주최자"
            id="host-name"
            type="text"
            placeholder="주최자의 이름을 입력하세요"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
          />

          <FormField
            label="파티명"
            id="party-name"
            type="text"
            placeholder="예: 2025 신년회"
            value={partyName}
            onChange={(e) => setPartyName(e.target.value)}
          />

          <FormField
            label="일자"
            id="party-date"
            type="date"
            value={partyDate}
            onChange={(e) => setPartyDate(e.target.value)}
          />

          <FormField
            as="textarea"
            label="설명"
            id="party-description"
            rows={4}
            placeholder="파티에 대한 설명을 자유롭게 적어주세요."
            value={partyDescription}
            onChange={(e) => setPartyDescription(e.target.value)}
          />

          <PlaceSection
            place={place}
            onSelectClick={() => setIsSelectingLocation(true)}
          />

          <FormField
            label="음식"
            id="party-food"
            type="text"
            placeholder="예: 피자, 치킨, 음료 등"
            value={partyFood}
            onChange={(e) => setPartyFood(e.target.value)}
          />

          <FeeSelector value={fee} onFeeChange={setFee} />



          <div className="pt-8 flex items-center justify-start gap-4 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={isPending}
              className="relative px-10 py-4 bg-black text-white font-bold text-lg rounded-xl shadow-lg hover:bg-neutral-800 transition-colors transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isPending ? "저장 중..." : "초대장 저장"}
            </button>
          </div>
        </section>
      </div>
      {isSelectingLocation && (
        <LocationSelector
          onConfirm={handleConfirmPlace}
          onCancel={() => setIsSelectingLocation(false)}
        />
      )}
    </>
  );
}
