import { io } from 'socket.io-client';

export const socket = io('http://localhost:3000', {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});

export const SocketEvents = {
  REGISTER: 'register',
  CREATE_ROOM: 'createRoom',
  JOIN_ROOM: 'joinRoom',
  MESSAGE: 'message',
  USER_JOINED: 'userJoined',
  USER_LEFT: 'userLeft',
  ROOM_LIST_UPDATED: 'roomListUpdated',
  GET_PUBLIC_ROOMS: 'getPublicRooms',
} as const;
