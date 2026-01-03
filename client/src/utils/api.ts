// src/utils/api.ts
import { Party, User, Friendship } from '../types';

const API_BASE_URL = 'http://localhost:8000/api'; // Django API Server

// =============================================================================
// [AUTH & TOKEN MANAGEMENT]
// =============================================================================
const TOKEN_KEY = 'ACCESS_TOKEN';
const REFRESH_KEY = 'REFRESH_TOKEN';
const USER_KEY = 'USER_INFO';

export const setTokens = (connect: { access: string; refresh: string; user: User }) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, connect.access);
    localStorage.setItem(REFRESH_KEY, connect.refresh);
    localStorage.setItem(USER_KEY, JSON.stringify(connect.user));
    // Trigger storage event for cross-tab or same-tab sync if needed
    window.dispatchEvent(new Event('storage'));
  }
};

export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event('storage'));
  }
};

export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

export const logout = () => {
  clearTokens();
  // Redirect to home or login page handled by component
};

const getAuthHeaders = () => {
  const token = getAccessToken();
  return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
};

// =============================================================================
// [AUTH API]
// =============================================================================

export const loginEmail = async (email: string, password: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, password }), // Using email as username for simplejwt if configured, or adjust backend
  });

  // Note: Standard SimpleJWT expects 'username' and 'password'. 
  // If your User model uses 'email' as username or you customized it, adjust accordingly.
  // Django default User model uses 'username'. 
  // If we want to login with email, we might need to customize backend or just send email as username if they are same.
  // For this MVP, let's assume we send 'username' as the field name but put email in it if the backend supports it, 
  // OR the user inputs username. 
  // *Correction*: The plan said Login with Email. 
  // If we used default User model, we need to authenticate with username. 
  // Let's assume the user enters their username in the "Email" field for now, OR we need a backend custom auth backend.
  // To keep it simple for now, we will send the input as 'username'. 

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  // data = { access, refresh }
  // We also need user info. Let's fetch it or the login view should return it.
  // Standard SimpleJWT doesn't return user info. 
  // But wait, my RegisterView returns user info! 
  // The LoginView (TokenObtainPairView) does NOT by default.
  // We need to fetch user info separately or customize TokenObtainPairView.
  // Let's fetch user info separately for now.

  const accessToken = data.access;
  const refreshToken = data.refresh;

  // Fetch User Info
  const userResponse = await fetch(`${API_BASE_URL}/auth/user/`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  if (!userResponse.ok) {
    throw new Error('Failed to fetch user info');
  }

  const userData = await userResponse.json();
  const user: User = { id: String(userData.id), name: userData.username, email: userData.email };

  setTokens({ access: accessToken, refresh: refreshToken, user });
  return user;
};

export const registerEmail = async (name: string, email: string, password: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: name, email, password }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(JSON.stringify(err));
  }

  const data = await response.json();
  // data = { user, access, refresh } from my custom RegisterView

  const user: User = { id: String(data.user.id), name: data.user.username, email: data.user.email };
  setTokens({ access: data.access, refresh: data.refresh, user });

  return user;
};

// =============================================================================
// [DATA API]
// =============================================================================

export const getParties = async (): Promise<Party[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/`, {
      headers: getAuthHeaders(),
    });
    if (response.ok) {
      const data = await response.json();
      return data.map((party: any) => ({
        id: party.id,
        partyName: party.name,
        partyDescription: party.description,
        date: party.date,
        place: party.location_name,
        partyFood: party.food_description,
        maxMembers: party.max_members,
        hostName: party.host_name,
        fee: party.fee,
        members: (party.members || []).map((m: any) => ({
          id: m.user ? String(m.user) : `guest-${m.id}`, // User ID를 id로 사용 (없으면 임시 ID)
          name: m.name,
          participantId: m.id // 삭제를 위한 Participant ID
        })),
        theme: party.theme,
      }));
    }
  } catch (e) {
    console.warn('[API] Failed to fetch parties', e);
  }
  return [];
};

export const getPartyById = async (id: string): Promise<Party | undefined> => {
  const response = await fetch(`${API_BASE_URL}/events/${id}/`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    return undefined;
  }
  const party = await response.json();
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
    members: (party.members || []).map((m: any) => ({
      id: m.user ? String(m.user) : `guest-${m.id}`,
      name: m.name,
      participantId: m.id
    })),
    theme: party.theme,
  };
};

export const createParty = async (partyData: Omit<Party, 'id' | 'members'>): Promise<Party> => {
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
    latitude: 37.5665, longitude: 126.9780, place_id: 'mock' // Default or passed
  };

  const response = await fetch(`${API_BASE_URL}/events/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error('Failed to create party');

  const newPartyData = await response.json();

  return {
    id: newPartyData.id,
    partyName: newPartyData.name,
    partyDescription: newPartyData.description,
    date: newPartyData.date,
    place: newPartyData.location_name,
    partyFood: newPartyData.food_description,
    maxMembers: newPartyData.max_members,
    hostName: newPartyData.host_name,
    fee: newPartyData.fee,
    members: [],
    theme: newPartyData.theme,
  };
};

export const joinParty = async (partyId: string, userId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/participants/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ event: partyId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || errorData.error || 'Failed to join party');
  }
  return Promise.resolve();
};

export const leaveParty = async (participantId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/participants/${participantId}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to leave party');
  }
  return Promise.resolve();
};

export const deleteParty = async (partyId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/events/${partyId}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete party');
  }
  return Promise.resolve();
};


export const getFriendships = async (): Promise<Friendship[]> => {
  const response = await fetch(`${API_BASE_URL}/friendships/`, {
    headers: getAuthHeaders(),
  });
  if (response.ok) {
    return response.json();
  }
  return [];
};

export const requestFriend = async (email: string): Promise<Friendship> => {
  const response = await fetch(`${API_BASE_URL}/friendships/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || errorData.message || 'Failed to send friend request');
  }
  return response.json();
};

export const acceptFriend = async (friendshipId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/friendships/${friendshipId}/accept/`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to accept friend request');
  }
};

export const removeFriend = async (friendshipId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/friendships/${friendshipId}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to remove friend');
  }
};
