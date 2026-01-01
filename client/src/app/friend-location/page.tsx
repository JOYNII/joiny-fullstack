'use client';

import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { getParties, getCurrentUser } from '../../utils/api';
import { Party, User } from '../../types';
import Link from 'next/link';
import PleaseLogin from '../../components/PleaseLogin';

export default function FriendLocationPage() {
    const [parties, setParties] = useState<Party[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Initial User Check & Load Parties
    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);
        setLoading(false);

        if (currentUser) {
            loadParties(currentUser);
        }

        async function loadParties(currentUser: User) {
            try {
                const allParties = await getParties();
                // Filter parties where current user is a member
                const myParties = allParties.filter(party =>
                    party.members.some(member => member.id === currentUser.id)
                );
                setParties(myParties);
            } catch (error) {
                console.error("Failed to load parties", error);
            }
        }
    }, []);

    // Handle tracking toggle
    const [trackingStates, setTrackingStates] = useState<Record<string, boolean>>({});

    useEffect(() => {
        // Load tracking states from local storage
        const savedStates = localStorage.getItem('trackingStates');
        if (savedStates) {
            setTrackingStates(JSON.parse(savedStates));
        }
    }, []);

    const toggleTracking = (partyId: string) => {
        const newState = !trackingStates[partyId];
        const newStates = { ...trackingStates, [partyId]: newState };
        setTrackingStates(newStates);
        localStorage.setItem('trackingStates', JSON.stringify(newStates));
    };

    if (loading) return null;
    if (!user) return <PleaseLogin />;

    return (
        <div className="pb-24">
            <PageHeader title="친구 위치" showBackButton={true} />

            <div className="px-6 mt-6">
                <h2 className="text-xl font-bold mb-4">내 파티 목록</h2>

                {parties.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">
                        가입한 파티가 없습니다.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {parties.map(party => (
                            <div key={party.id} className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{party.theme || '기본'}</span>
                                        <h3 className="font-bold text-lg mt-2">{party.partyName}</h3>
                                        <p className="text-sm text-gray-500">{party.date}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-gray-700">위치 추적 허용</span>
                                        <button
                                            onClick={() => toggleTracking(party.id.toString())}
                                            className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${trackingStates[party.id] ? 'bg-blue-500' : 'bg-gray-300'}`}
                                        >
                                            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 ${trackingStates[party.id] ? 'left-7' : 'left-1'}`} />
                                        </button>
                                    </div>

                                    <Link href={`/friend-location/map/${party.id}`}>
                                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                                            친구 위치 보기
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
