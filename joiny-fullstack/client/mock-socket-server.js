const { createServer } = require("http");
const { Server } = require("socket.io");

// --- Mock Data (Moved from mockApi.ts) ---

const MOCK_USERS = [
  { id: 'user1', name: '김조이' },
  { id: 'user2', name: '박개발' },
  { id: 'user3', name: '최디자' },
];

const initialParties = [
  {
    id: '1',
    partyName: '주말 풋살 모임',
    partyDescription: '매주 토요일 즐거운 풋살!',
    members: [MOCK_USERS[0]],
    maxMembers: 6,
    theme: 'christmas',
    hostName: '김조이',
    partyDate: '2025-12-20',
    place: '서울 월드컵경기장',
    partyFood: '치킨과 맥주',
    fee: 10000,
  },
  {
    id: '2',
    partyName: '스터디 그룹: Next.js',
    partyDescription: 'Next.js 딥 다이브 스터디',
    members: [MOCK_USERS[1]],
    maxMembers: 5,
    theme: 'reunion',
    hostName: '박개발',
    partyDate: '2025-11-30',
    place: '강남 스터디룸',
    partyFood: '커피와 샌드위치',
    fee: 5000,
  },
];

// In-memory store for party data
let parties = JSON.parse(JSON.stringify(initialParties));

// --- Socket Server Logic ---

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "https://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const PORT = 3001;

io.on("connection", (socket) => {
  console.log(`[Socket.io] User connected: ${socket.id}`);

  socket.on("join_room", (partyId) => {
    socket.join(partyId);
    console.log(`[Socket.io] User ${socket.id} joined room: ${partyId}`);
  });

  socket.on("send_message", (data) => {
    const { partyId, message } = data;
    io.to(partyId).emit("receive_message", message);
    console.log(`[Socket.io] Message received in room ${partyId}:`, message);
  });

  // NEW: Handle join/leave logic
  socket.on('toggle_join_leave', (data) => {
    const { partyId, userId } = data;
    const partyIndex = parties.findIndex((p) => p.id === partyId);

    if (partyIndex === -1) {
      // Handle error: party not found
      return;
    }

    const party = parties[partyIndex];
    const isMember = party.members.some((member) => member.id === userId);

    if (isMember) {
      // Leave party
      party.members = party.members.filter((member) => member.id !== userId);
      console.log(`[Socket.io] User ${userId} left party ${partyId}`);
    } else {
      // Join party
      if (party.members.length < party.maxMembers) {
        const user = MOCK_USERS.find(u => u.id === userId) || { id: userId, name: `User ${userId}`};
        party.members.push(user);
        console.log(`[Socket.io] User ${userId} joined party ${partyId}`);
      } else {
        // Handle error: party full
        return;
      }
    }
    
    // Notify all clients in the room to refetch data
    io.to(partyId).emit('refetch_party_data');
    console.log(`[Socket.io] Broadcasting refetch signal to room ${partyId} after state change.`);
  });

  // NEW: Handle request for all parties
  socket.on('get_all_parties', () => {
    console.log('[Socket.io] Received get_all_parties request. Sending data.');
    socket.emit('all_parties', parties);
  });


  socket.on("disconnect", () => {
    console.log(`[Socket.io] User disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`[Socket.io] Mock server is running on http://localhost:${PORT}`);
});