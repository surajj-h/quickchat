import { useEffect } from 'react';
import { socket } from '../lib/socket';
import { Message, Member } from '../types';

export const useSocket = (
  onMessage: (message: Message) => void,
  onUserJoined: (member: Member) => void,
  onUserLeft: (userId: string) => void
) => {
  useEffect(() => {
    socket.on('message', onMessage);
    socket.on('userJoined', onUserJoined);
    socket.on('userLeft', ({ userId }) => onUserLeft(userId));
    socket.on('roomListUpdated', () => socket.emit('getPublicRooms'));

    return () => {
      socket.off('message');
      socket.off('userJoined');
      socket.off('userLeft');
      socket.off('roomListUpdated');
    };
  }, [onMessage, onUserJoined, onUserLeft]);

  return socket;
};
