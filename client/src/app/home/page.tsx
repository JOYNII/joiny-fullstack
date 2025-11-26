"use client";
import { useQuery } from "@tanstack/react-query"; 
import React, { useState } from "react";
import PartyCard from "../../components/PartyCard";
import PageHeader from "../../components/PageHeader";
import { getParties } from "../../utils/api";
import { Party } from "../../types";
import ThemeSelectionModal from './components/ThemeSelectionModal';

const HomePage = () => {
  const { data: parties, isLoading, error } = useQuery<Party[]>({
    queryKey: ['parties'],
    queryFn: getParties
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateNewPartyClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-neutral-50 text-gray-900 p-6 md:p-12 lg:p-20">
      <PageHeader 
        title="Myparty"
        subtitle="내가 가입한 파티, 그리고 새로운 시작."
      />

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
