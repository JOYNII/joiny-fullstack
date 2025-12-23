import React from 'react';
import { useRouter } from 'next/navigation';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
}

export default function PageHeader({ title, subtitle, showBackButton }: PageHeaderProps) {
  const router = useRouter();

  return (
    <header className="mb-8 md:mb-12">
      {showBackButton && (
        <button
          onClick={() => router.back()}
          className="mb-4 text-gray-500 hover:text-gray-900 flex items-center transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          뒤로가기
        </button>
      )}
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-none">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-lg md:text-xl text-gray-500 font-light">
          {subtitle}
        </p>
      )}
    </header>
  );
}