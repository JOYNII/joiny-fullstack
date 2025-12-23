import socketio

# create a Socket.IO server
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins=[
    "http://localhost:3000",
    "https://localhost:3000",
    "http://127.0.0.1:3000",
    "https://127.0.0.1:3000",
    # Add other origins as needed
])

@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

@sio.event
async def join_party(sid, data):
    """
    data expectation: { 'party_id': '123' }
    """
    party_id = data.get('party_id')
    if party_id:
        sio.enter_room(sid, f"party_{party_id}")
        await sio.emit('response', {'message': f'Joined party {party_id}'}, room=sid)
        print(f"Client {sid} joined party_{party_id}")

@sio.event
async def leave_party(sid, data):
    party_id = data.get('party_id')
    if party_id:
        sio.leave_room(sid, f"party_{party_id}")
        await sio.emit('response', {'message': f'Left party {party_id}'}, room=sid)

@sio.event
async def location_update(sid, data):
    """
    data expectation: 
    { 
      'party_id': '123',
      'user_id': 'user_1',
      'lat': 37.5665, 
      'lng': 126.9780 
    }
    """
    party_id = data.get('party_id')
    if party_id:
        # Broadcast to everyone in the party room EXCEPT the sender
        await sio.emit('location_update', data, room=f"party_{party_id}", skip_sid=sid)
