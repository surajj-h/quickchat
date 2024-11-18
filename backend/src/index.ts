import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import crypto from 'crypto';
import cors from 'cors';

const app = express();
const http = createServer(app);

const io = new Server(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

interface User {
  username: string;
  socketId: string;
  roomId: string | null;
  createdRoomId: string | null;
}

interface Room {
  name: string;
  isPublic: boolean;
  password?: string;
  creator: string;
  members: Set<string>;
}

interface PublicRoomInfo {
  id: string;
  name: string;
  memberCount: number;
  creator: {
    id: string;
    username: string;
  };
}

const users = new Map<string, User>();
const rooms = new Map<string, Room>();

const generateId = (): string => crypto.randomBytes(8).toString('hex');

type OptionalCallback<T> = ((response: T) => void) | undefined;

const safeCallback = <T>(callback: OptionalCallback<T>, response: T) => {
  if (typeof callback === 'function') {
    callback(response);
  }
};

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

io.on('connection', (socket: Socket) => {
  console.log('Client connected:', socket.id);
  let userId: string | null = null;

  socket.on('register', (
    { username }: { username: string },
    callback?: OptionalCallback<{ success: boolean; userId?: string; error?: string }>
  ) => {
    try {
      userId = generateId();
      users.set(userId, {
        username,
        socketId: socket.id,
        roomId: null,
        createdRoomId: null
      });
      console.log(`User registered: ${username} (${userId})`);

      const response = { success: true, userId };
      safeCallback(callback, response);
      socket.emit('registerResponse', response);
    } catch (error) {
      console.error('Registration error:', error);
      const response = { success: false, error: 'Registration failed' };
      safeCallback(callback, response);
      socket.emit('registerResponse', response);
    }
  });

  socket.on('createRoom', (
    { roomName, isPublic, password }: { roomName: string; isPublic: boolean; password?: string },
    callback?: OptionalCallback<{ success: boolean; roomId?: string; roomInfo?: any; error?: string }>
  ) => {
    if (!userId) {
      const response = { success: false, error: 'User not found' };
      safeCallback(callback, response);
      socket.emit('createRoomResponse', response);
      return;
    }

    const user = users.get(userId);

    if (!user) {
      const response = { success: false, error: 'User not found' };
      safeCallback(callback, response);
      socket.emit('createRoomResponse', response);
      return;
    }

    if (user.createdRoomId) {
      const response = { success: false, error: 'You have already created a room' };
      safeCallback(callback, response);
      socket.emit('createRoomResponse', response);
      return;
    }

    if (user.roomId) {
      const response = { success: false, error: 'Please leave your current room before creating a new one' };
      safeCallback(callback, response);
      socket.emit('createRoomResponse', response);
      return;
    }

    try {
      const roomId = generateId();
      const room: Room = {
        name: roomName,
        isPublic,
        password,
        creator: userId,
        members: new Set([userId])
      };

      rooms.set(roomId, room);
      user.roomId = roomId;
      user.createdRoomId = roomId;
      socket.join(roomId);

      const response = {
        success: true,
        roomId,
        roomInfo: {
          name: roomName,
          isPublic,
          members: Array.from(room.members).map(id => ({
            id,
            username: users.get(id)!.username
          }))
        }
      };

      safeCallback(callback, response);
      socket.emit('createRoomResponse', response);

      if (isPublic) {
        io.emit('roomListUpdated');
      }
    } catch (error) {
      console.error('Create room error:', error);
      const response = { success: false, error: 'Failed to create room' };
      safeCallback(callback, response);
      socket.emit('createRoomResponse', response);
    }
  });

  socket.on('joinRoom', (
    { roomId, password }: { roomId: string; password?: string },
    callback?: OptionalCallback<{ success: boolean; roomInfo?: any; error?: string }>
  ) => {
    const user = users.get(userId!);
    const room = rooms.get(roomId);

    if (!user || !room) {
      const response = { success: false, error: !user ? 'User not found' : 'Room not found' };
      safeCallback(callback, response);
      socket.emit('joinRoomResponse', response);
      return;
    }

    if (user.roomId && user.roomId !== roomId) {
      const response = { success: false, error: 'You must leave your current room before joining another' };
      safeCallback(callback, response);
      socket.emit('joinRoomResponse', response);
      return;
    }

    if (!room.isPublic && room.password !== password) {
      const response = { success: false, error: 'Invalid password' };
      safeCallback(callback, response);
      socket.emit('joinRoomResponse', response);
      return;
    }

    try {
      room.members.add(userId!);
      user.roomId = roomId;
      socket.join(roomId);

      socket.to(roomId).emit('userJoined', {
        userId,
        username: user.username
      });

      const response = {
        success: true,
        roomInfo: {
          name: room.name,
          isPublic: room.isPublic,
          members: Array.from(room.members).map(id => ({
            id,
            username: users.get(id)!.username
          }))
        }
      };

      safeCallback(callback, response);
      socket.emit('joinRoomResponse', response);

      if (room.isPublic) {
        io.emit('roomListUpdated');
      }
    } catch (error) {
      console.error('Join room error:', error);
      const response = { success: false, error: 'Failed to join room' };
      safeCallback(callback, response);
      socket.emit('joinRoomResponse', response);
    }
  });

  socket.on('leaveRoom', (
    callback?: OptionalCallback<{ success: boolean; message?: string; error?: string }>
  ) => {
    if (!userId) {
      const response = { success: false, error: 'User not found' };
      safeCallback(callback, response);
      socket.emit('leaveRoomResponse', response);
      return;
    }

    const user = users.get(userId);

    if (!user) {
      const response = { success: false, error: 'User not found' };
      safeCallback(callback, response);
      socket.emit('leaveRoomResponse', response);
      return;
    }

    if (!user.roomId) {
      const response = { success: false, error: 'You are not in any room' };
      safeCallback(callback, response);
      socket.emit('leaveRoomResponse', response);
      return;
    }

    try {
      const room = rooms.get(user.roomId);
      if (!room) {
        const response = { success: false, error: 'Room not found' };
        safeCallback(callback, response);
        socket.emit('leaveRoomResponse', response);
        return;
      }

      room.members.delete(userId);

      socket.to(user.roomId).emit('userLeft', { userId });

      socket.leave(user.roomId);

      if (room.members.size === 0) {
        rooms.delete(user.roomId);
        if (room.isPublic) {
          io.emit('roomListUpdated');
        }
      }

      if (user.createdRoomId === user.roomId) {
        user.createdRoomId = null;
      }
      user.roomId = null;

      const response = {
        success: true,
        message: "Successfully left the room"
      };

      safeCallback(callback, response);
      socket.emit('leaveRoomResponse', response);
    } catch (error) {
      console.error('Leave room error:', error);
      const response = { success: false, error: "Failed to leave room" };
      safeCallback(callback, response);
      socket.emit('leaveRoomResponse', response);
    }
  });

  socket.on('getPublicRooms', (
    callback?: OptionalCallback<{ success: boolean; rooms?: PublicRoomInfo[]; error?: string }>
  ) => {
    try {
      const publicRooms: PublicRoomInfo[] = [];

      rooms.forEach((room, roomId) => {
        if (room.isPublic) {
          const creator = users.get(room.creator);
          if (creator) {
            publicRooms.push({
              id: roomId,
              name: room.name,
              memberCount: room.members.size,
              creator: {
                id: room.creator,
                username: creator.username
              }
            });
          }
        }
      });

      publicRooms.sort((a, b) => {
        if (b.memberCount !== a.memberCount) {
          return b.memberCount - a.memberCount;
        }
        return a.name.localeCompare(b.name);
      });

      const response = { success: true, rooms: publicRooms };
      safeCallback(callback, response);
      socket.emit('getPublicRoomsResponse', response);
    } catch (error) {
      console.error('Get public rooms error:', error);
      const response = { success: false, error: 'Failed to get public rooms' };
      safeCallback(callback, response);
      socket.emit('getPublicRoomsResponse', response);
    }
  });

  socket.on('message', (
    { content }: { content: string },
    callback?: OptionalCallback<{ success: boolean; error?: string }>
  ) => {
    const user = users.get(userId!);
    if (!user || !user.roomId) {
      const response = { success: false, error: 'Not in a room' };
      safeCallback(callback, response);
      socket.emit('messageResponse', response);
      return;
    }

    try {
      const messageData = {
        userId: userId!,
        username: user.username,
        content,
        timestamp: Date.now()
      };

      io.to(user.roomId).emit('message', messageData);

      const response = { success: true };
      safeCallback(callback, response);
      socket.emit('messageResponse', response);
    } catch (error) {
      console.error('Message error:', error);
      const response = { success: false, error: 'Failed to send message' };
      safeCallback(callback, response);
      socket.emit('messageResponse', response);
    }
  });


  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    if (!userId) return;

    const user = users.get(userId);
    if (user) {
      if (user.roomId) {
        const room = rooms.get(user.roomId);
        if (room) {
          room.members.delete(userId);
          io.to(user.roomId).emit('userLeft', { userId });

          if (room.creator === userId && room.members.size === 0) {
            rooms.delete(user.roomId);
            if (room.isPublic) {
              io.emit('roomListUpdated');
            }
          }
        }
      }
      users.delete(userId);
    }
  });

});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
