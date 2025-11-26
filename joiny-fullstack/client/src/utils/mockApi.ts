// src/utils/mockApi.ts
import { Party, User } from '../types';

// --- Mock Data (used for initial user, etc.) ---

const MOCK_USERS: User[] = [
  { id: 'user1', name: '김조이' },
  { id: 'user2', name: '박개발' },
  { id: 'user3', name: '최디자' },
];

const CURRENT_USER: User = MOCK_USERS[0]; // Default user

// The initialParties data is now primarily managed by the server.
const initialParties: Party[] = [
  // This is now just for reference, server holds the true state.
];


// --- Exported Functions ---

export const getParties = async (): Promise<Party[]> => {
  console.log('Fetching all parties via API...');
  // This function is now implemented in api.ts
  return Promise.resolve([]);
};

export const getPartyById = async (id: string): Promise<Party | undefined> => {
  console.log(`Fetching party with id: ${id} via API...`);
  // This function should be implemented in api.ts
  return Promise.resolve(undefined);
};

// The functions below are now legacy as the logic is on the server.
// They are kept to prevent breaking other parts of the app that might use them.

export const createParty = async (partyData: Omit<Party, 'id' | 'members'>): Promise<Party> => {
  console.log('Creating new party...');
  return new Promise((resolve) => {
    // This logic is now on the server. This function is deprecated.
    resolve({} as Party); 
  });
};

export const joinParty = async (partyId: string, userId: string): Promise<Party | undefined> => {
  console.log(`User ${userId} attempting to join party ${partyId}`);
  return new Promise((resolve, reject) => {
    // This logic is now on the server. This function is deprecated.
    resolve(undefined);
  });
};

export const leaveParty = async (partyId: string, userId: string): Promise<Party | undefined> => {
    console.log(`User ${userId} attempting to leave party ${partyId}`);
    return new Promise((resolve, reject) => {
        // This logic is now on the server. This function is deprecated.
        resolve(undefined);
    });
};
