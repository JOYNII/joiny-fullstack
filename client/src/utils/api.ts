// src/utils/api.ts
import { Party, User } from '../types';
const API_BASE_URL = '/api';

const MOCK_USERS: User[] = [
  { id: 'user1', name: '김조이' },
  { id: 'user2', name: '박개발' },
  { id: 'user3', name: '최디자' },
];

const CURRENT_USER: User = MOCK_USERS[0];

// =============================================================================
// [MOCK STORAGE HELPER] - 세션 스토리지 기반 (새로고침 시 유지)
// =============================================================================
const STORAGE_KEY_PARTIES = 'MOCK_PARTIES_DATA';
const STORAGE_KEY_MEMBERS = 'MOCK_MEMBERS_DATA';

const getStoredParties = (): Party[] | null => {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem(STORAGE_KEY_PARTIES);
  return stored ? JSON.parse(stored) : null;
};

const setStoredParties = (parties: Party[]) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(STORAGE_KEY_PARTIES, JSON.stringify(parties));
  }
};
// =============================================================================

export const getCurrentUser = (): User => {
  if (typeof window === 'undefined') return CURRENT_USER;
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('user');
  if (userId) {
    const userIndex = parseInt(userId, 10) - 1;
    if (userIndex >= 0 && userIndex < MOCK_USERS.length) return MOCK_USERS[userIndex];
  }
  return CURRENT_USER;
};

export const getParties = async (): Promise<Party[]> => {
  // 1. 세션 스토리지에 데이터가 있으면 그거 리턴 (새로고침해도 유지됨!)
  const cachedParties = getStoredParties();

  if (cachedParties) {
    console.log('[MOCK API] Returning cached parties from SessionStorage');
    await new Promise(r => setTimeout(r, 200));
    return Promise.resolve(cachedParties);
  }

  // 2. 없으면 백엔드에서 초기 데이터 가져오기
  try {
    const response = await fetch(`${API_BASE_URL}/events/`);
    if (response.ok) {
      const data = await response.json();
      const mappedParties = data.map((party: any) => ({
        id: party.id,
        partyName: party.name,
        partyDescription: party.description,
        date: party.date,
        place: party.location_name,
        partyFood: party.food_description,
        maxMembers: party.max_members,
        hostName: party.host_name,
        fee: party.fee,
        members: party.members || [],
        theme: party.theme,
      }));

      // 스토리지에 저장!
      setStoredParties(mappedParties);
      console.log('[MOCK API] Initialized storage from backend');
      return mappedParties;
    }
  } catch (e) {
    console.warn('[MOCK API] Failed to fetch, using empty list', e);
  }

  return [];
};

export const getPartyById = async (id: string): Promise<Party | undefined> => {
  // 1. 스토리지에서 먼저 찾기 (삭제된 파티인지 확인 가능)
  const cachedParties = getStoredParties();
  if (cachedParties) {
    const found = cachedParties.find(p => p.id.toString() === id);
    if (found) return found;
  }

  // 2. 없으면 백엔드 (혹은 에러)
  const response = await fetch(`${API_BASE_URL}/events/${id}/`);
  if (!response.ok) {
    if (response.status === 404) return undefined;
    throw new Error('Failed to fetch party');
  }
  const party = await response.json();
  if (!party) return undefined;

  return {
    id: party.id,
    partyName: party.name,
    partyDescription: party.description,
    date: party.date,
    place: party.location_name,
    partyFood: party.food_description,
    maxMembers: party.max_members,
    hostName: party.host_name,
    fee: party.fee,
    members: party.members || [],
    theme: party.theme,
  };
};

export const createParty = async (partyData: Omit<Party, 'id' | 'members'>): Promise<Party> => {
  // ... 기존 코드 (createParty는 중요도가 낮으므로 간략화하지만, Mock 목록에 추가하는 로직 넣으면 좋음)
  const payload = {
    name: partyData.partyName,
    description: partyData.partyDescription,
    date: partyData.date,
    theme: partyData.theme,
    location_name: partyData.place,
    food_description: partyData.partyFood,
    host_name: partyData.hostName,
    fee: partyData.fee,
    max_members: partyData.maxMembers,
    latitude: 37.5665, longitude: 126.9780, place_id: 'mock'
  };

  const response = await fetch(`${API_BASE_URL}/events/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error('Failed to create party');

  const newPartyData = await response.json();

  // [MOCK] 생성된 파티를 스토리지에도 추가 (화면 반영을 위해)
  // 호스트(나)를 첫 번째 멤버로 자동 추가
  const currentUser = getCurrentUser();
  const hostMember: User = {
    id: currentUser.id || 'unknown',
    name: newPartyData.host_name || currentUser.name || 'Host'
  };

  const mappedNewParty: Party = {
    id: newPartyData.id,
    partyName: newPartyData.name,
    partyDescription: newPartyData.description,
    date: newPartyData.date,
    place: newPartyData.location_name,
    partyFood: newPartyData.food_description,
    maxMembers: newPartyData.max_members,
    hostName: newPartyData.host_name,
    fee: newPartyData.fee,
    members: [hostMember], // Host added automatically
    theme: newPartyData.theme,
  };

  const currentParties = getStoredParties() || [];
  currentParties.push(mappedNewParty);
  setStoredParties(currentParties);
  console.log('[MOCK API] New party added to storage:', mappedNewParty);

  return mappedNewParty;
};

export const joinParty = async (partyId: string, userId: string): Promise<void> => {
  // [MOCK] 스토리지 데이터 수정
  console.log('[MOCK API] Toggling join/leave...');
  await new Promise(r => setTimeout(r, 300));

  const parties = getStoredParties() || [];
  const party = parties.find(p => p.id.toString() === partyId);

  if (party) {
    const idx = party.members.findIndex(m => m.id === userId);
    if (idx >= 0) {
      party.members.splice(idx, 1); // 제거
    } else {
      const mockUser = MOCK_USERS.find(u => u.id === userId) || { id: userId, name: 'User' };
      party.members.push(mockUser); // 추가
    }
    setStoredParties(parties); // 저장
  }

  return Promise.resolve();
};

export const deleteParty = async (partyId: string): Promise<void> => {
  console.log(`[API] Deleting Party: ${partyId} from backend...`);

  // [BACKEND] 실제 API 호출
  const response = await fetch(`${API_BASE_URL}/events/${partyId}/`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    // 에러 처리 (상세 에러 로그)
    const errorText = await response.text();
    console.error('Delete failed:', errorText);
    throw new Error('Failed to delete party');
  }

  // [SYNC] 성공 시 로컬 Mock 스토리지에서도 삭제 (화면 갱신용)
  // (나중에 getParties가 완전히 백엔드만 본다면 이 부분은 없어도 됨)
  let parties = getStoredParties() || [];
  const initialLength = parties.length;
  parties = parties.filter(p => p.id.toString() !== partyId.toString());

  if (parties.length !== initialLength) {
    setStoredParties(parties);
    console.log('[API] Party deleted locally for sync.');
  }

  return Promise.resolve();
};
