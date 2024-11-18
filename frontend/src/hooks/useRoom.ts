import { useState, useCallback } from 'react';
import { socket } from '../lib/socket';
import { Room, Member } from '../types';

export const useRoom = () => {
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [joinUrl, setJoinUrl] = useState('');

  const createRoom = useCallback(async (
    roomName: string,
    isPublic: boolean,
    password?: string
  ) => {
    socket.emit(
      'createRoom',
      { roomName, isPublic, password: isPublic ? undefined : password },
      (response: { success: boolean; roomId?: string; roomInfo?: any }) => {
        if (response.success && response.roomId) {
          setCurrentRoom(response.roomId);
          setMembers(response.roomInfo.members);
          setIsPublic(isPublic);

          if (!isPublic) {
            const url = new URL(window.location.href);
            url.searchParams.set('room', response.roomId);
            setJoinUrl(url.toString());
          }
        }
      }
    );
  }, []);

  const joinRoom = useCallback(async (roomId: string, password?: string) => {
    socket.emit(
      'joinRoom',
      { roomId, password },
      (response: { success: boolean; roomInfo?: any }) => {
        if (response.success) {
          setCurrentRoom(roomId);
          setMembers(response.roomInfo.members);
          setIsPublic(response.roomInfo.isPublic);
        }
      }
    );
  }, []);

  return {
    currentRoom,
    members,
    isPublic,
    joinUrl,
    createRoom,
    joinRoom,
    setMembers,
  };
};
