// src/types/index.ts

export interface User {
  id: string;
  name: string;
  email?: string;
  image?: string;
  participantId?: number; // 파티 참여 ID (삭제 시 필요)
}


export interface Party {
  id: string;
  theme: string | null;
  hostName: string;
  hostId?: string; // 주최자 ID
  partyName: string;
  date: string;
  partyDescription: string;
  place: string;
  partyFood: string;
  fee: number | string;
  members: User[]; // 이제 User 객체의 배열입니다.
  maxMembers: number;
}

export interface Friendship {
  id: number;
  from_user: User;
  to_user: User;
  status: 'pending' | 'accepted';
  created_at: string;
}

