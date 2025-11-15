// src/utils/api.ts
import { Party } from '../types';

const API_BASE_URL = '/api';

const MOCK_USERS: User[] = [
  { id: 'user1', name: '김조이' },
  { id: 'user2', name: '박개발' },
  { id: 'user3', name: '최디자' },
];

const CURRENT_USER: User = MOCK_USERS[0]; // Default user

export const getCurrentUser = (): User => {
  if (typeof window === 'undefined') return CURRENT_USER;
  
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('user');
  
  if (userId) {
    const userIndex = parseInt(userId, 10) - 1;
    if (userIndex >= 0 && userIndex < MOCK_USERS.length) {
      return MOCK_USERS[userIndex];
    }
  }
  
  return CURRENT_USER;
};

export const getParties = async (): Promise<Party[]> => {
  const response = await fetch(`${API_BASE_URL}/events/`);
  if (!response.ok) {
    throw new Error('Failed to fetch parties');
  }
  const data = await response.json();
  // 백엔드 응답(snake_case)을 프론트엔드 타입(camelCase)에 맞게 변환
  return data.map((party: any) => ({
    id: party.id,
    partyName: party.name,
    partyDescription: party.description, // 백엔드에서 제공되는 description 사용
    date: party.date,
    place: party.location_name,
    partyFood: party.food_description,
    maxMembers: party.max_members,
    hostName: party.host_name, // 백엔드에서 제공되는 host_name 사용
    fee: party.fee, // 백엔드에서 제공되는 fee 사용
    members: party.members || [],
    theme: party.theme,
  }));
};

export const getPartyById = async (id: string): Promise<Party | undefined> => {
  const response = await fetch(`${API_BASE_URL}/events/${id}/`);
  if (!response.ok) {
    if (response.status === 404) {
      return undefined;
    }
    throw new Error('Failed to fetch party');
  }
  const party = await response.json();
  if (!party) return undefined;

  // 백엔드 응답(snake_case)을 프론트엔드 타입(camelCase)에 맞게 변환
  return {
    id: party.id,
    partyName: party.name,
    partyDescription: party.description, // 백엔드에서 제공되는 description 사용
    date: party.date,
    place: party.location_name,
    partyFood: party.food_description,
    maxMembers: party.max_members,
    hostName: party.host_name, // 백엔드에서 제공되는 host_name 사용
    fee: party.fee, // 백엔드에서 제공되는 fee 사용
    members: party.members || [],
    theme: party.theme,
  };
};

export const createParty = async (partyData: Omit<Party, 'id' | 'members'>): Promise<Party> => {
  const payload = {
    name: partyData.partyName,
    description: partyData.partyDescription, // 새로운 description 필드 추가
    date: partyData.date,
    theme: partyData.theme,
    location_name: partyData.place,
    food_description: partyData.partyFood,
    host_name: partyData.hostName, // 새로운 host_name 필드 추가
    fee: partyData.fee, // 새로운 fee 필드 추가
    max_members: partyData.maxMembers,
    // TODO: Add latitude, longitude, and place_id from the location selection
    latitude: 37.5665,
    longitude: 126.9780,
    place_id: 'some-place-id',
  };

  console.log('Sending data to backend:', payload);

  const response = await fetch(`${API_BASE_URL}/events/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text(); // Get response as text first
    console.error('Raw backend error response:', errorText); // Log the raw text
    try {
      const errorData = JSON.parse(errorText); // Try to parse it as JSON
      throw new Error(errorData.detail || 'Failed to create party');
    } catch (e) {
      // If parsing fails, throw the raw text as the error
      throw new Error('Failed to create party. Server responded with: ' + errorText);
    }
  }

  return response.json();
};
