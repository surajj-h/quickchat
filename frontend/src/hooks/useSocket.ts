import { useEffect, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import type { Message, Member } from '../types';

export const useSocketEvents = (
  onMessage: (message: Message) => void,
  onUserJoined: (member: Member) => void,
  onUserLeft: (userId: string) => void
) => {
  const { socket } = useSocket();

  useEffect(() => {
    socket.on('message', onMessage);
    socket.on('userJoined', onUserJoined);
    socket.on('userLeft', ({ userId }) => onUserLeft(userId));

    return () => {
      socket.off('message');
      socket.off('userJoined');
      socket.off('userLeft');
    };
  }, [socket, onMessage, onUserJoined, onUserLeft]);

  const sendMessage = useCallback((content: string) => {
    return new Promise((resolve) => {
      socket.emit('message', { content }, (response: { success: boolean }) => {
        resolve(response.success);
      });
    });
  }, [socket]);

  return { sendMessage };
};
