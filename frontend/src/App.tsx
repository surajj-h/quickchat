import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { LoginForm } from './components/auth/LoginForm';
import { CreateRoom } from './components/room/CreateRoom';
import { RoomList } from './components/room/RoomList';
import { ChatRoom } from './components/chat/ChatRoom';
import { useSocket } from './context/SocketContext';
import { useSocketEvents } from './hooks/useSocket';
import type { Message, Room, Member } from './types';
import { JoinRoom } from './components/room/JoinRoom';

const App = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [publicRooms, setPublicRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomMembers, setRoomMembers] = useState<Member[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [joinUrl, setJoinUrl] = useState('');

  const { socket } = useSocket();

  const handleMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const handleUserJoined = useCallback((member: Member) => {
    setRoomMembers(prev => [...prev, member]);
  }, []);

  const handleUserLeft = useCallback((userId: string) => {
    setRoomMembers(prev => prev.filter(member => member.id !== userId));
  }, []);

  const { sendMessage } = useSocketEvents(
    handleMessage,
    handleUserJoined,
    handleUserLeft
  );

  useEffect(() => {
    if (userId) {
      socket.emit('getPublicRooms', (response: { success: boolean; rooms?: Room[] }) => {
        if (response.success && response.rooms) {
          setPublicRooms(response.rooms);
        }
      });
    }
  }, [userId, socket]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room');
    if (roomId && userId) {
      handleJoinRoom(roomId);
    }
  }, [userId]);

  const handleJoinRoom = (roomId: string, password?: string) => {
    socket.emit('joinRoom',
      { roomId, password },
      (response: { success: boolean; roomInfo?: any }) => {
        if (response.success) {
          setCurrentRoom(roomId);
          setRoomMembers(response.roomInfo.members);
        }
      }
    );
  };

  const handleRoomCreated = (roomId: string, roomInfo: any) => {
    setCurrentRoom(roomId);
    setRoomMembers(roomInfo.members);
    if (!isPublic) {
      const url = new URL(window.location.href);
      url.searchParams.set('room', roomId);
      setJoinUrl(url.toString());
    }
  };

  if (!userId) {
    return <LoginForm onLogin={setUserId} />;
  }

  if (!currentRoom) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <Tabs defaultValue="join">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="join">Join Room</TabsTrigger>
              <TabsTrigger value="create">Create Room</TabsTrigger>
            </TabsList>

            <TabsContent value="join">
              <RoomList
                rooms={publicRooms}
                onJoinRoom={handleJoinRoom}
              />
              <JoinRoom onJoinRoom={handleJoinRoom} />
            </TabsContent>

            <TabsContent value="create">
              <CreateRoom onRoomCreated={handleRoomCreated} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <ChatRoom
      messages={messages}
      members={roomMembers}
      currentUserId={userId}
      isPublic={isPublic}
      joinUrl={joinUrl}
      onSendMessage={sendMessage}
    />
  );
};

export default App;
