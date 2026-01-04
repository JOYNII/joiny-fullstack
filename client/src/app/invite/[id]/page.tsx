"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPartyById, getCurrentUser, joinParty } from "../../../utils/api";
import PleaseLogin from "../../../components/PleaseLogin";
import { getTheme } from "../../../utils/themes";

export default function InvitationLandingPage() {
    const { id } = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isOpening, setIsOpening] = useState(false);

    // 파티 정보 조회
    const { data: party, isLoading, error } = useQuery({
        queryKey: ['party', id],
        queryFn: () => getPartyById(id as string),
        enabled: !!id,
    });

    // 파티 참여 Mutation
    const { mutate: acceptInvitation, isPending } = useMutation({
        mutationFn: async () => {
            const user = getCurrentUser();
            await joinParty(id as string, user.id);
        },
        onSuccess: () => {
            // 데이터 갱신
            queryClient.invalidateQueries({ queryKey: ['party', id] });
            queryClient.invalidateQueries({ queryKey: ['parties'] });

            // 애니메이션 후 이동 (이미 isOpening=true 상태임)
            setTimeout(() => {
                router.push(`/party/${id}`);
            }, 800);
        },
        onError: (err) => {
            setIsOpening(false);
            alert("초대 수락에 실패했습니다: " + err);
        }
    });

    const handleAcceptClick = () => {
        const user = getCurrentUser();
        if (!user) {
            setShowLoginModal(true);
            return;
        }

        // 1. 애니메이션 시작 (즉시 반응)
        setIsOpening(true);

        // 2. 약간의 딜레이 후 API 호출 (연출용) 혹은 즉시 호출
        // 여기서는 바로 호출
        acceptInvitation();
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-neutral-100">초대장을 불러오는 중...</div>;
    if (error || !party) return <div className="min-h-screen flex items-center justify-center bg-neutral-100 text-red-500">유효하지 않은 초대장입니다.</div>;

    const ui = getTheme(party.theme);

    // Zoom & Fade Effect Styles
    const containerClasses = isOpening
        ? "scale-[5] opacity-0 transition-all duration-[1000ms] ease-in-out"
        : "scale-100 opacity-100 transition-all duration-500";

    const wrapperClasses = isOpening
        ? `bg-white transition-colors duration-[1000ms]`  // 화이트아웃 효과
        : `${ui.wrapperBg} transition-colors duration-500`;

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden ${wrapperClasses} ${ui.fontClass}`}>
            <style>{styles}</style>

            {/* 배경 장식 (Blob) - Opening 시 사라짐 */}
            {!isOpening && (
                <>
                    <div className="absolute top-0 left-0 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </>
            )}

            {/* 초대장 카드 (티켓 스타일) */}
            <div className={`relative w-full max-w-md transform z-10 ${containerClasses}`}>

                {/* Connecting Logic: Ticket Number Badge */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                    <span className={`px-4 py-1 rounded-full text-xs font-bold tracking-widest shadow-sm ${ui.badgeStyle}`}>
                        TICKET NO. 001
                    </span>
                </div>

                <div className={`relative overflow-hidden ${ui.cardContainer}`}>

                    {/* Inner Decor (Reunion) */}
                    {ui.innerBorder && (
                        <div className={`absolute inset-2 border ${ui.innerBorder.replace('border-2 ', '')} opacity-30 pointer-events-none rounded-lg`}></div>
                    )}

                    {/* 상단 이미지 영역 */}
                    <div className="h-40 relative overflow-hidden flex items-center justify-center">
                        <div className={`absolute inset-0 ${ui.dividerColor} opacity-20`}></div>
                        {/* 테마별 패턴이나 그라데이션 추가 가능 */}
                        <div className="z-10 text-center">
                            <p className={`text-xs font-bold tracking-[0.3em] uppercase mb-2 ${ui.labelColor}`}>You're Invited</p>
                            <h1 className={`text-2xl font-bold ${ui.titleColor}`}>{party.partyName}</h1>
                        </div>

                        {/* 펀치 구멍 (좌우) - 디자인 통일감 */}
                        <div className={`absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full ${ui.wrapperBg}`}></div>
                        <div className={`absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full ${ui.wrapperBg}`}></div>
                    </div>

                    {/* 하단 내용 영역 */}
                    <div className="p-8 text-center space-y-6 bg-white/50 backdrop-blur-sm">

                        {/* Host Info */}
                        <div className="flex flex-col items-center justify-center space-y-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-1 ${ui.badgeStyle.split(' ')[0]} text-white shadow-md`}>
                                {party.hostName ? party.hostName[0] : 'H'}
                            </div>
                            <p className={`text-xs ${ui.labelColor}`}>Hosted By</p>
                            <span className={`font-semibold ${ui.titleColor}`}>{party.hostName}</span>
                        </div>

                        {/* Details Box */}
                        <div className={`p-4 rounded-xl space-y-3 border ${ui.dividerColor.replace('bg-', 'border-')} bg-white/60`}>
                            <div className="flex items-center justify-between text-sm">
                                <span className={ui.labelColor}>Date</span>
                                <span className={`font-medium ${ui.bodyColor}`}>{party.date}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className={ui.labelColor}>Location</span>
                                <span className={`font-medium ${ui.bodyColor} truncate max-w-[150px]`}>{party.place || 'TBD'}</span>
                            </div>
                        </div>

                        <p className={`italic ${ui.bodyColor} opacity-80 text-sm`}>
                            "{party.partyDescription || '특별한 시간에 당신을 초대합니다.'}"
                        </p>

                        <button
                            onClick={handleAcceptClick}
                            disabled={isPending || isOpening}
                            className={`w-full py-4 text-lg font-bold rounded-xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2 group ${ui.buttonStyle(true, isPending)}`}
                        >
                            {isPending || isOpening ? (
                                <span className="animate-pulse">Opening...</span>
                            ) : (
                                <>
                                    입장하기
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>



            {/* 로그인 모달 */}
            {showLoginModal && <PleaseLogin />}
        </div>
    );
}

// Styles for Blob & FadeIn
const styles = `
@keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
    animation: blob 7s infinite;
}
.animation-delay-2000 {
    animation-delay: 2s;
}
.animation-delay-4000 {
    animation-delay: 4s;
}
`;
