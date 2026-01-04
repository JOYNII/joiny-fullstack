"use client";

import React, { useState } from "react";
import { Party } from "../../../../types";
import { deleteParty, updateParty } from "../../../../utils/api";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface HostControlsProps {
    party: Party;
    isHost: boolean;
}

export default function HostControls({ party, isHost }: HostControlsProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [showEditModal, setShowEditModal] = useState(false);
    const [formData, setFormData] = useState({
        partyName: party.partyName,
        partyDescription: party.partyDescription,
        date: party.date,
        place: party.place,
        partyFood: party.partyFood,
        fee: party.fee,
        maxMembers: party.maxMembers,
    });

    const { mutate: doDelete, isPending: isDeleting } = useMutation({
        mutationFn: () => deleteParty(party.id),
        onSuccess: () => {
            alert("파티가 삭제되었습니다.");
            router.push("/");
        },
        onError: (err: Error) => {
            alert(err.message);
        }
    });

    const { mutate: doUpdate, isPending: isUpdating } = useMutation({
        mutationFn: () => updateParty(party.id, formData),
        onSuccess: () => {
            alert("파티 정보가 수정되었습니다.");
            setShowEditModal(false);
            queryClient.invalidateQueries({ queryKey: ['party', party.id] });
        },
        onError: (err: Error) => {
            alert(err.message);
        }
    });

    if (!isHost) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="mt-8 flex justify-center gap-4 relative z-10">
            <button
                onClick={() => setShowEditModal(true)}
                className="px-6 py-2 rounded-full bg-indigo-600 text-white font-bold shadow hover:bg-indigo-700 transition"
            >
                party update
            </button>
            <button
                onClick={() => {
                    if (confirm("정말로 파티를 삭제하시겠습니까?")) doDelete();
                }}
                disabled={isDeleting}
                className="px-6 py-2 rounded-full bg-red-500 text-white font-bold shadow hover:bg-red-600 transition"
            >
                {isDeleting ? "deleting..." : "party delete"}
            </button>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-gray-800">파티 수정</h2>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">파티명</label>
                                <input name="partyName" value={formData.partyName} onChange={handleChange} className="w-full border rounded p-2" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">일자</label>
                                    <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full border rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">최대 인원</label>
                                    <input type="number" name="maxMembers" value={formData.maxMembers} onChange={handleChange} className="w-full border rounded p-2" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">장소</label>
                                <input name="place" value={formData.place} onChange={handleChange} className="w-full border rounded p-2" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">음식/준비물</label>
                                <input name="partyFood" value={formData.partyFood} onChange={handleChange} className="w-full border rounded p-2" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">참가비</label>
                                <input type="number" name="fee" value={formData.fee} onChange={handleChange} className="w-full border rounded p-2" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">설명</label>
                                <textarea name="partyDescription" value={formData.partyDescription} onChange={handleChange} className="w-full border rounded p-2 h-24" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <button onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded text-gray-600 hover:bg-gray-100">취소</button>
                            <button
                                onClick={() => doUpdate()}
                                disabled={isUpdating}
                                className="px-4 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isUpdating ? "저장 중..." : "저장하기"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
