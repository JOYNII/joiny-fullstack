"use client"; 

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 

const InitialPage = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace('/home'); 
    }, []); 

    return <div>잠시만 기다려주세요...</div>;
};

export default InitialPage;