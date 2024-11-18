import { useState, useCallback } from 'react';
import { socket } from '../lib/socket';

export const useAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');

  const login = useCallback(async (username: string) => {
    socket.emit(
      'register',
      { username },
      (response: { success: boolean; userId?: string }) => {
        if (response.success && response.userId) {
          setUserId(response.userId);
          setUsername(username);
        }
      }
    );
  }, []);

  return {
    userId,
    username,
    login,
  };
};
