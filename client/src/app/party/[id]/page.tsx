"use client";

import React, { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPartyById, getCurrentUser, joinParty, leaveParty } from "../../../utils/api";
import { Party } from "../../../types";
import JoinLeaveButton from "./components/JoinLeaveButton";
import { useErrorNotification } from "../../../hooks/useErrorNotification";
import { Gowun_Batang, Inter, Nanum_Myeongjo } from 'next/font/google';

// -----------------------------------------------------------------------------
// Assets & Fonts
// -----------------------------------------------------------------------------
const fontChristmas = Gowun_Batang({ weight: ["400", "700"], subsets: ["latin"] });
const fontDefault = Inter({ subsets: ["latin"] });
const fontReunion = Nanum_Myeongjo({ weight: ["400", "700", "800"], subsets: ["latin"] });

// -----------------------------------------------------------------------------
// Theme Configuration
// -----------------------------------------------------------------------------
type ThemeConfig = {
  wrapperBg: string; // 전체 화면 배경
  wrapperGradient?: string; // 그라데이션 배경 (Modern용)
  fontClass: string;

  // Card Styles
  cardContainer: string; // 카드 컨테이너 스타일 (배경, 그림자, 테두리 등)
  innerBorder?: string; // 내부 장식용 테두리 (Reunion 등)

  // Text Colors
  titleColor: string;
  subtitleColor: string;
  labelColor: string;
  bodyColor: string;

  // Accents
  dividerColor: string; // 구분선 색상

  // Components
  EffectComponent?: React.FC;
  buttonStyle: (isMember: boolean, isPending: boolean) => string;

  // Specifics
  headerPrefix?: string;
  headerSuffix?: string;
};

// Effects
const SnowEffect = () => {
  // Generate static snowflake styles to avoid hydration mismatch if possible, 
  // but random for now is fine if suppressed or handled in useEffect. 
  // Here we use simple random mapping.
  const snowflakes = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${5 + Math.random() * 10}s`,
    animationDelay: `${Math.random() * 5}s`,
    opacity: Math.random() * 0.5 + 0.3,
    size: Math.random() < 0.3 ? 'w-3 h-3' : 'w-2 h-2',
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {snowflakes.map((flake) => (
        <div key={flake.id} className={`absolute top-[-20px] bg-white rounded-full animate-snow ${flake.size}`} style={{ left: flake.left, animationDuration: flake.animationDuration, animationDelay: flake.animationDelay, opacity: flake.opacity }} />
      ))}
      <style>{`
                @keyframes snow { 0% { transform: translateY(-20px) translateX(-10px); } 100% { transform: translateY(110vh) translateX(10px); } }
                .animate-snow { animation-name: snow; animation-timing-function: linear; animation-iteration-count: infinite; }
            `}</style>
    </div>
  );
};

const THEMES: Record<string, ThemeConfig> = {
  christmas: {
    wrapperBg: "bg-[#052f17]",
    fontClass: fontChristmas.className,
    cardContainer: "bg-[#fffdf5] border-4 border-red-700 shadow-[0_0_40px_rgba(255,0,0,0.2)] rounded-2xl",
    titleColor: "text-red-700",
    subtitleColor: "text-green-800",
    labelColor: "text-green-700 uppercase tracking-widest",
    bodyColor: "text-gray-800",
    dividerColor: "bg-red-700/20",
    EffectComponent: SnowEffect,
    buttonStyle: (isMember, isPending) => isMember
      ? "bg-transparent text-red-700 border-2 border-red-700 hover:bg-red-50"
      : "bg-red-700 text-white shadow-lg hover:shadow-red-900/40 hover:bg-red-800",
  },
  reunion: {
    wrapperBg: "bg-[#1e293b]",
    fontClass: fontReunion.className,
    cardContainer: "bg-[#fffbf0] border-2 border-[#c5a059] shadow-2xl rounded-sm",
    innerBorder: "border-2 border-[#c5a059] opacity-40",
    titleColor: "text-[#0f172a]",
    subtitleColor: "text-[#c5a059]",
    labelColor: "text-[#b45309] uppercase tracking-widest",
    bodyColor: "text-[#334155]",
    dividerColor: "bg-[#c5a059]",
    EffectComponent: undefined,
    buttonStyle: (isMember, isPending) => isMember
      ? "bg-transparent text-[#94a3b8] border border-[#cbd5e1] hover:bg-[#f1f5f9]"
      : "bg-[#0f172a] text-[#f1f5f9] hover:shadow-xl hover:bg-[#1e293b]",
  },
  default: { // Modern Theme
    wrapperBg: "bg-gray-50",
    wrapperGradient: "bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 animate-gradient-xy",
    fontClass: fontDefault.className,
    cardContainer: "bg-white/60 backdrop-blur-xl border border-white/50 shadow-xl rounded-3xl",
    titleColor: "text-gray-900",
    subtitleColor: "text-indigo-600",
    labelColor: "text-indigo-500 uppercase tracking-widest",
    bodyColor: "text-gray-700",
    dividerColor: "bg-indigo-200",
    EffectComponent: undefined, // Gradient는 wrapperGradient로 처리
    buttonStyle: (isMember, isPending) => isMember
      ? "bg-white/50 text-gray-500 border border-gray-200 hover:bg-white"
      : "bg-black text-white shadow-lg hover:bg-gray-800 hover:scale-105 transition-transform",
  }
};

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

  const memberRecord = (currentUser && party?.members)
    ? party.members.find(member => String(member.id) === String(currentUser.id))
    : null;
  const isMember = !!memberRecord;

  const { mutate: toggleJoinLeave, isPending: isJoinLeavePending } = useMutation({
    mutationFn: () => {
      if (!currentUser) throw new Error("로그인이 필요합니다.");
      if (isMember && memberRecord?.participantId) {
        return leaveParty(memberRecord.participantId);
      } else {
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

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  if (error || !party) return <div className="min-h-screen flex items-center justify-center"><p>Error loading party.</p></div>;

  // Theme Setup
  const themeKey = party.theme in THEMES ? party.theme! : 'default';
  const ui = THEMES[themeKey];
  const Effect = ui.EffectComponent;

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 md:p-8 lg:p-12 relative overflow-hidden transition-colors duration-500 ${ui.wrapperBg} ${ui.fontClass}`}>

      {/* Modern Theme Gradient Animation */}
      {ui.wrapperGradient && (
        <div className={`absolute inset-0 z-0 ${ui.wrapperGradient}`}></div>
      )}
      {ui.wrapperGradient && (
        <style>{`
                @keyframes gradient-xy {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient-xy {
                    background-size: 200% 200%;
                    animation: gradient-xy 15s ease infinite;
                }
            `}</style>
      )}

      {/* Global Effect (Snow etc) */}
      {Effect && <Effect />}

      {/* --- MAIN CARD LAYOUT (Unified Structure) --- */}
      <div className={`relative w-full max-w-5xl p-8 md:p-16 transition-all duration-500 z-10 ${ui.cardContainer}`}>

        {/* Inner Decoration Border (Only for Reunion) */}
        {ui.innerBorder && (
          <>
            <div className={`absolute inset-3 border-2 ${ui.innerBorder.replace('border-2 ', '')} pointer-events-none`}></div>
            <div className={`absolute inset-4 border ${ui.innerBorder.replace('border-2 ', '')} opacity-50 pointer-events-none`}></div>
          </>
        )}

        {/* HEADER SECTION */}
        <div className="text-center mb-12 relative z-10">
          <p className={`text-sm font-bold mb-4 ${ui.subtitleColor} tracking-[0.3em] uppercase`}>Invitation</p>
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 tracking-tight ${ui.titleColor}`}>
            {ui.headerPrefix}{party.partyName}{ui.headerSuffix}
          </h1>
          <div className={`w-20 h-[2px] mx-auto opacity-60 ${ui.dividerColor}`}></div>
        </div>

        {/* CONTENT SECTION (Grid Layout) */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* LEFT: Details (2 Cols Span) */}
          <div className="md:col-span-2 space-y-8">
            {/* Item 1: Date */}
            <div className={`pl-4 border-l-4 ${ui.dividerColor.replace('bg-', 'border-')}`}>
              <span className={`block text-xs font-bold mb-1 ${ui.labelColor}`}>When</span>
              <span className={`text-2xl font-semibold ${ui.bodyColor}`}>{party.date}</span>
            </div>

            {/* Item 2: Location */}
            <div className={`pl-4 border-l-4 ${ui.dividerColor.replace('bg-', 'border-')}`}>
              <span className={`block text-xs font-bold mb-1 ${ui.labelColor}`}>Where</span>
              <span className={`text-2xl font-semibold ${ui.bodyColor}`}>{party.place || "TBD"}</span>
            </div>

            {/* Item 3: Message */}
            <div className={`pl-4 border-l-4 ${ui.dividerColor.replace('bg-', 'border-')}`}>
              <span className={`block text-xs font-bold mb-2 ${ui.labelColor}`}>Message</span>
              <p className={`text-lg leading-relaxed ${ui.bodyColor} opacity-90`}>
                {party.partyDescription || "Join us for a wonderful time!"}
              </p>
            </div>
          </div>

          {/* RIGHT: Visual / Members (1 Col Span) */}
          <div className={`rounded-xl p-6 flex flex-col items-center text-center justify-center space-y-6 ${themeKey === 'default' ? 'bg-white/40 shadow-inner' : 'bg-black/5'}`}>

            {/* Host Info */}
            <div>
              <p className={`text-xs font-bold mb-2 ${ui.labelColor} opacity-70`}>Hosted By</p>
              <div className={`text-xl font-bold ${ui.titleColor}`}>{party.hostName}</div>
            </div>

            {/* Member Avatars */}
            <div className="w-full h-px bg-current opacity-10 mx-auto"></div>

            <div>
              <p className={`text-xs font-bold mb-3 ${ui.labelColor} opacity-70`}>Attendees ({party.members.length})</p>
              <div className="flex flex-wrap justify-center gap-2">
                {party.members.length > 0 ? party.members.map((m, idx) => (
                  <div key={idx} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${themeKey === 'default' ? 'bg-white text-indigo-600' : 'bg-gray-200 text-gray-700'}`} title={m.name}>
                    {m.name[0]}
                  </div>
                )) : (
                  <span className={`text-sm ${ui.bodyColor} opacity-50`}>No attendees yet</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER: Action Button */}
        <div className="mt-16 text-center relative z-10">
          {currentUser ? (
            <button
              onClick={() => toggleJoinLeave()}
              disabled={isJoinLeavePending}
              className={`px-12 py-4 rounded-full text-lg font-bold transition-all duration-300 transform active:scale-95 ${ui.buttonStyle(isMember, isJoinLeavePending)}`}
            >
              {isJoinLeavePending ? "Processing..." : isMember ? "Decline Invitation" : "Accept Invitation"}
            </button>
          ) : (
            <div className="inline-block px-6 py-3 rounded-lg bg-black/5 backdrop-blur-sm">
              <p className={`text-sm font-medium ${ui.bodyColor}`}>Please login to respond</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
