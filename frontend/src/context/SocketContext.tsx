import { SOCKET_URL } from '@/config';
import React, { createContext, useContext } from 'react';
import { Socket, io } from 'socket.io-client';

interface SocketContextType {
  socket: Socket;
}

const socket = io(SOCKET_URL);
const SocketContext = createContext<SocketContextType>({ socket });

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
