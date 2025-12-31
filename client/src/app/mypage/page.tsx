"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PleaseLogin from "../../components/PleaseLogin";

import { getCurrentUser, logout } from "../../utils/api";
import { User } from "../../types";


export default function MyPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter(); // Import useRouter at top level if not imported


  useEffect(() => {
    // URL 파라미터가 변경될 때마다 유저 정보를 다시 가져옴
    const currentUser = getCurrentUser();
    const hasUserParam = searchParams.get("user");

    if (hasUserParam) {
      setUser(currentUser);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return <div>Loading...</div>; // Or a proper skeleton/spinner
  }

  if (!user) {
    return <PleaseLogin />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">마이페이지</h1>
        <p className="text-lg text-gray-600">이곳은 마이페이지입니다.</p>
        <p className="text-md text-gray-800 mt-4">환영합니다, {user.name}님!</p>

        <button
          onClick={() => {
            logout();
            router.replace('/auth/login/email');
          }}
          className="mt-8 px-6 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium"
        >
          로그아웃
        </button>
      </div>

    </div>
  );
}