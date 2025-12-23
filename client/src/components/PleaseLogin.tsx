import React from "react";
import Link from "next/link";

export default function PleaseLogin() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col justify-center items-center z-50">
      <div className="w-full max-w-sm p-8">
        <div className="text-center mb-10">
          <img src="/Myparty_icon.png" alt="Myparty Icon" className="mx-auto mb-4 h-20 w-20" />
          <h2 className="text-3xl font-bold text-gray-800">마이파티</h2>
          <p className="text-gray-600 mt-4">이 서비스를 이용하려면 로그인이 필요합니다.<br />테스트할 사용자를 선택하세요.</p>
        </div>
        <div className="space-y-4">
          <Link
            href="/mypage?user=1" // [TEST] Simulate login as user 1 and go to mypage
            className="block w-full px-6 py-4 text-center font-bold text-gray-800 bg-yellow-300 rounded-xl hover:bg-yellow-400 transition-colors shadow-sm text-lg"
          >
            카카오로 로그인
          </Link>
          <div className="flex justify-center space-x-4 mt-2">
            <Link
              href="/auth/login/email" // Replace with actual email login page
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              이메일로 로그인
            </Link>
            <Link
              href="/auth/register/email" // Replace with actual email registration page
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              이메일로 회원가입
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
