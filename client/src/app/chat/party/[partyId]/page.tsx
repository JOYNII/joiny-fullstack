'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import PartyChat from '../../../../components/PartyChat';

export default function ChatPage() {
    const params = useParams();
    const partyId = params.partyId as string;

    return (
        <div className="h-screen w-screen bg-white">
            <PartyChat partyId={partyId} isFullScreen={true} />
        </div>
    );
}
