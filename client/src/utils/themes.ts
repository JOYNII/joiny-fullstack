import { NextFont } from 'next/dist/compiled/@next/font';
import { Gowun_Batang, Inter, Nanum_Myeongjo } from 'next/font/google';

// -----------------------------------------------------------------------------
// Fonts
// -----------------------------------------------------------------------------
export const fontChristmas = Gowun_Batang({ weight: ["400", "700"], subsets: ["latin"] });
export const fontDefault = Inter({ subsets: ["latin"] });
export const fontReunion = Nanum_Myeongjo({ weight: ["400", "700", "800"], subsets: ["latin"] });

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
export type ThemeConfig = {
    wrapperBg: string;
    wrapperGradient?: string;
    fontClass: string;

    // Card Styles
    cardContainer: string;
    innerBorder?: string;

    // Text Colors
    titleColor: string;
    subtitleColor: string;
    labelColor: string;
    bodyColor: string; // 본문 색상

    // Accents
    dividerColor: string;

    // UI Elements
    buttonStyle: (isPrimary: boolean, isPending: boolean) => string;
    badgeStyle: string; // "No. 001" 배지 스타일
};

// -----------------------------------------------------------------------------
// Theme Definitions
// -----------------------------------------------------------------------------
export const THEMES: Record<string, ThemeConfig> = {
    christmas: {
        wrapperBg: "bg-[#052f17]",
        fontClass: fontChristmas.className,
        cardContainer: "bg-[#fffdf5] border-4 border-red-700 shadow-[0_0_40px_rgba(255,0,0,0.2)] rounded-2xl",
        titleColor: "text-red-700",
        subtitleColor: "text-green-800",
        labelColor: "text-green-700 uppercase tracking-widest",
        bodyColor: "text-gray-800",
        dividerColor: "bg-red-700/20",
        badgeStyle: "bg-red-700 text-[#fffdf5] border border-[#fffdf5]",
        buttonStyle: (isPrimary, isPending) => isPrimary
            ? "bg-red-700 text-white shadow-lg hover:shadow-red-900/40 hover:bg-red-800 border-2 border-transparent"
            : "bg-transparent text-red-700 border-2 border-red-700 hover:bg-red-50",
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
        badgeStyle: "bg-[#c5a059] text-white border border-[#fffbf0]",
        buttonStyle: (isPrimary, isPending) => isPrimary
            ? "bg-[#0f172a] text-[#f1f5f9] hover:shadow-xl hover:bg-[#1e293b] border border-transparent"
            : "bg-transparent text-[#94a3b8] border border-[#cbd5e1] hover:bg-[#f1f5f9]",
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
        badgeStyle: "bg-indigo-600 text-white border border-white/50",
        buttonStyle: (isPrimary, isPending) => isPrimary
            ? "bg-black text-white shadow-lg hover:bg-gray-800 hover:scale-105 transition-transform border border-transparent"
            : "bg-white/50 text-gray-500 border border-gray-200 hover:bg-white",
    }
};

export const getTheme = (themeName?: string) => {
    return (themeName && themeName in THEMES) ? THEMES[themeName] : THEMES['default'];
};
