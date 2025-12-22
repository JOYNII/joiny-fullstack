"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPartyById, getCurrentUser, joinParty } from "../../../utils/api";
import PleaseLogin from "../../../components/PleaseLogin";

export default function InvitationLandingPage() {
    const { id } = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [showConfetti, setShowConfetti] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // 파티 정보 조회
    const { data: party, isLoading, error } = useQuery({
        queryKey: ['party', id],
        queryFn: () => getPartyById(id as string),
        enabled: !!id,
    });

    // 파티 참여 Mutation
    const { mutate: acceptInvitation, isPending } = useMutation({
        mutationFn: () => {
            const user = getCurrentUser();
            return joinParty(id as string, user.id);
        },
        onSuccess: () => {
            // 1. 폭죽 효과 실행
            setShowConfetti(true);

            // 2. 파티 데이터 갱신
            queryClient.invalidateQueries({ queryKey: ['party', id] });
            queryClient.invalidateQueries({ queryKey: ['parties'] });

            // 3. 2초 후 파티 상세 페이지로 이동
            setTimeout(() => {
                router.push(`/party/${id}`);
            }, 2000);
        },
        onError: (err) => {
            alert("초대 수락에 실패했습니다: " + err);
        }
    });

    const handleAcceptClick = () => {
        // 1. 로그인 체크
        const user = getCurrentUser();
        if (!user || !user.id || user.id === 'unknown') {
            // 우리 Mock 시스템에서 비로그인 상태는 보통 user 파라미터가 없을 때
            const params = new URLSearchParams(window.location.search);
            if (!params.has('user')) {
                setShowLoginModal(true);
                return;
            }
        }

        // 2. 초대 수락 (Mock API)
        acceptInvitation();
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-neutral-100">초대장을 불러오는 중...</div>;
    if (error || !party) return <div className="min-h-screen flex items-center justify-center bg-neutral-100 text-red-500">유효하지 않은 초대장입니다.</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <style>{styles}</style>

            {/* 배경 장식 (Blob) */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

            {/* 초대장 카드 (티켓 스타일) */}
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all hover:scale-105 duration-500 z-10 animate-fade-in-up">
                {/* 상단 이미지 영역 */}
                <div className="h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-black opacity-10"></div>
                    <div className="text-white text-center z-10 px-6">
                        <p className="text-sm font-medium tracking-widest uppercase opacity-90 mb-2">You're Invited</p>
                        <h1 className="text-3xl font-bold drop-shadow-md">{party.partyName}</h1>
                    </div>
                    {/* 티켓 펀치 구멍 효과 (좌우) */}
                    <div className="absolute -left-3 top-1/2 w-6 h-6 bg-gray-100 rounded-full"></div>
                    <div className="absolute -right-3 top-1/2 w-6 h-6 bg-gray-100 rounded-full"></div>
                </div>

                {/* 하단 내용 영역 */}
                <div className="p-8 text-center space-y-6">
                    <div className="space-y-2">
                        <p className="text-gray-500 text-sm">HOSTED BY</p>
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                {party.hostName ? party.hostName[0] : 'H'}
                            </div>
                            <span className="font-semibold text-gray-800">{party.hostName}</span>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Date</span>
                            <span className="font-medium text-gray-900">{party.date}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Location</span>
                            <span className="font-medium text-gray-900 truncate max-w-[150px]">{party.place || 'TBD'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Theme</span>
                            <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${getThemeColor(party.theme)}`}>
                                {party.theme || 'Party'}
                            </span>
                        </div>
                    </div>

                    <p className="text-gray-600 italic">"{party.partyDescription || '특별한 시간에 당신을 초대합니다.'}"</p>

                    <button
                        onClick={handleAcceptClick}
                        disabled={isPending || showConfetti}
                        className="w-full py-4 bg-black text-white text-lg font-bold rounded-xl shadow-lg hover:bg-gray-800 transform active:scale-95 transition-all flex items-center justify-center gap-2 group"
                    >
                        {showConfetti ? "환영합니다! 🎉" : (
                            <>
                                초대 수락하기
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* 로그인 모달 */}
            {showLoginModal && <PleaseLogin />}

            {/* 폭죽 효과 컴포넌트 */}
            {showConfetti && <Confetti />}
        </div>
    );
}

// 헬퍼: 테마별 색상
function getThemeColor(theme?: string) {
    if (theme === 'christmas') return 'bg-red-100 text-red-600';
    if (theme === 'reunion') return 'bg-blue-100 text-blue-600';
    return 'bg-purple-100 text-purple-600';
}

// CSS 효과: Blob, FadeIn, Confetti
const Confetti = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
            {[...Array(30)].map((_, i) => (
                <div key={i} className="absolute animate-confetti text-2xl" style={{
                    left: `${Math.random() * 100}%`,
                    top: `-10%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                    transform: `rotate(${Math.random() * 360}deg)`
                }}>
                    {['🎉', '🎊', '✨', '🎈', '🥳'][Math.floor(Math.random() * 5)]}
                </div>
            ))}
        </div>
    );
}

// Tailwind에 animation-blob, fade-in-up 등이 정의되어 있지 않으므로 style 태그로 주입 (프로토타이핑용)
// *주의: 실제 프로덕션에서는 tailwind.config.js에 추가하는 것이 좋음.
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

@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes confettiDrop {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}
.animate-confetti {
    animation: confettiDrop 3s linear forwards;
}
`;
