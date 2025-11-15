import Link from "next/link";
import React from "react";

// Placeholder Icons for UI clarity
const HomeIcon = () => (
  <svg
    className="w-6 h-6 mb-1"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    ></path>
  </svg>
);
const ThemeIcon = () => (
  <svg
    className="w-6 h-6 mb-1"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
    ></path>
  </svg>
);
const PlusCircleIcon = () => (
  <svg
    className="w-6 h-6 mb-1"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);
const UserIcon = () => (
  <svg
    className="w-6 h-6 mb-1"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    ></path>
  </svg>
);

const BottomNavBar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-200 shadow-[0_-1px_10px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-full max-w-lg mx-auto">
        <Link
          href="/home"
          className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-500 transition-colors w-1/4"
        >
          <HomeIcon />
          <span className="text-xs font-medium">홈</span>
        </Link>
        <div className="flex flex-col items-center justify-center text-gray-600 w-1/4">
          <ThemeIcon />
          <span className="text-xs font-medium">친구위치</span>
        </div>
        <div className="flex flex-col items-center justify-center text-gray-600 w-1/4">
          <PlusCircleIcon />
          <span className="text-xs font-medium">친구추가</span>
        </div>
        <div className="flex flex-col items-center justify-center text-gray-600 w-1/4">
          <UserIcon />
          <span className="text-xs font-medium">마이</span>
        </div>
      </div>
    </nav>
  );
};

export default BottomNavBar;
