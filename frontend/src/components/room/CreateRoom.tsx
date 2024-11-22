import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { useSocket } from '../../context/SocketContext';

interface CreateRoomProps {
  onRoomCreated: (roomId: string, roomInfo: any) => void;
}

export const CreateRoom: React.FC<CreateRoomProps> = ({ onRoomCreated }) => {
  const [roomName, setRoomName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [password, setPassword] = useState('');
  const { socket } = useSocket();

  const handleCreateRoom = () => {
    if (!roomName.trim()) return;

    socket.emit('createRoom',
      { roomName, isPublic, password: isPublic ? undefined : password },
      (response: { success: boolean; roomId?: string; roomInfo?: any }) => {
        if (response.success && response.roomId) {
          onRoomCreated(response.roomId, response.roomInfo);
        }
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Room</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roomName">Room Name</Label>
            <Input
              id="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <Label htmlFor="public">Public Room</Label>
          </div>

          {!isPublic && (
            <div className="space-y-2">
              <Label htmlFor="password">Room Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter room password"
              />
            </div>
          )}

          <Button onClick={handleCreateRoom} className="w-full">
            Create Room
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
