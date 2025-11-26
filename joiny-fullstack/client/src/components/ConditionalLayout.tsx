"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import BottomNavBar from './BottomNavBar';

const ConditionalLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // 이 경로들에서는 하단 네비게이션 바가 나타나지 않습니다.
  const hideNavBarOn = ['/invitation', '/theme'];

  // 현재 경로가 숨김 목록의 경로로 시작하는지 확인합니다.
  const shouldShowNavBar = !hideNavBarOn.some(path => pathname.startsWith(path));

  return (
    <>
      <main className={`flex-grow overflow-y-auto ${shouldShowNavBar ? 'pb-20' : ''}`}>
        {children}
      </main>
      {shouldShowNavBar && <BottomNavBar />}
    </>
  );
};

export default ConditionalLayout;
