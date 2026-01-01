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
            href="/auth/login/email"
            className="block w-full px-6 py-4 text-center font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm text-lg"
          >
            이메일로 로그인
          </Link>
          <div className="flex justify-center mt-4">
            <span className="text-gray-500 text-sm mr-2">계정이 없으신가요?</span>
            <Link
              href="/auth/register/email"
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              이메일로 회원가입
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
