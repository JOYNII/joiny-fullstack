"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import PartyCard from "../../components/PartyCard";
import PageHeader from "../../components/PageHeader";
import { getParties, getCurrentUser, logout } from "../../utils/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "../../types";



import { Party } from "../../types";
import ThemeSelectionModal from './components/ThemeSelectionModal';

const HomePage = () => {
  const { data: parties, isLoading, error } = useQuery<Party[]>({
    queryKey: ['parties'],
    queryFn: getParties
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  React.useEffect(() => {
    setUser(getCurrentUser());

    const handleStorageChange = () => {
      setUser(getCurrentUser());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);


  const handleCreateNewPartyClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const router = useRouter();
  const handleLogout = () => {
    logout();
    router.replace('/auth/login/email');
  };


  return (
    <div className="bg-neutral-50 text-gray-900 p-6 md:p-12 lg:p-20">
      <PageHeader
        title="Myparty"
        subtitle="내가 가입한 파티, 그리고 새로운 시작."
      />
      <div className="absolute top-6 right-6 md:top-12 md:right-12 flex gap-3">
        {user ? (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors duration-200"
          >
            로그아웃
          </button>
        ) : (
          <Link
            href="/auth/login/email"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-bold shadow-md transition-all duration-200"
          >
            로그인
          </Link>
        )}
      </div>



      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 tracking-tight">
            활성화된 파티 목록 ({parties?.length || 0})
          </h2>
          <button
            onClick={handleCreateNewPartyClick}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-700 transition-all duration-300 text-sm font-semibold flex items-center space-x-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            <span>새 파티</span>
          </button>
        </div>

        {isLoading && <p className="text-lg text-gray-600">파티 목록을 불러오는 중...</p>}
        {error && <p className="text-lg text-red-600">오류가 발생했습니다: {error.message}</p>}

        {parties && parties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {parties.map((party) => (
              <PartyCard key={party.id} party={party} />
            ))}
          </div>
        ) : (
          !isLoading && <p className="text-lg text-gray-600">아직 가입한 파티가 없습니다.</p>
        )}
      </section>

      {isModalOpen && <ThemeSelectionModal onClose={handleCloseModal} />}
    </div>
  );
};

export default HomePage;