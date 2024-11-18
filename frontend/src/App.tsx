import { useCallback, useEffect, useState } from "react";
import { LoginForm } from "./components/auth/LoginForm"
import { useAuth } from "./hooks/useAuth";
import { Member, Message } from "./types";
import { useRoom } from "./hooks/useRoom";
import { useSocket } from "./hooks/useSocket";
import { SocketProvider } from "./context/SocketContext";
import { AuthProvider } from "./context/AuthContext";

const ChatApp = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { userId, username, login } = useAuth();
  const {
    currentRoom,
    members,
    isPublic,
    joinUrl,
    createRoom,
    joinRoom,
    setMembers
  } = useRoom();

  const handleMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const handleUserJoined = useCallback((member: Member) => {
    setMembers(prev => [...prev, { id: member.id, username: member.username }]);
  }, [setMembers]);

  const handleUserLeft = useCallback((userId: string) => {
    setMembers(prev => prev.filter(member => member.id !== userId));
  }, [setMembers]);

  const socket = useSocket(handleMessage, handleUserJoined, handleUserLeft);

  const handleSendMessage = useCallback((content: string) => {
    if (!content.trim()) return;

    socket.emit('message', { content }, (response: { success: boolean }) => {
      if (!response.success) {
        // Handle error
        console.error('Failed to send message');
      }
    });
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room');
    if (roomId && userId) {
      joinRoom(roomId);
    }
  }, [userId, joinRoom]);

  if (!userId) {
    return <LoginForm onLogin={login} />;
  }
}

function App() {

  return (
    <SocketProvider>
      <AuthProvider>
        <ChatApp />
      </AuthProvider>
    </SocketProvider>
  )
}

export default App
