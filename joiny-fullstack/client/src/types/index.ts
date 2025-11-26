// src/types/index.ts

export interface User {
  id: string;
  name: string;
}

export interface Party {
  id:string;
  theme: string | null;
  hostName: string;
  partyName: string;
  date: string;
  partyDescription: string;
  place: string;
  partyFood: string;
  fee: number | string;
  members: User[]; // 이제 User 객체의 배열입니다.
  maxMembers: number;
}
