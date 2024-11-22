import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { useSocket } from '../../context/SocketContext';

interface JoinRoomProps {
  onJoinRoom: (roomId: string, password?: string) => void;
}

export const JoinRoom: React.FC<JoinRoomProps> = ({ onJoinRoom }) => {
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { socket } = useSocket();

  // Check if room requires password
  const checkRoomAccess = async () => {
    if (!roomId.trim()) {
      setError('Please enter a room ID');
      return;
    }

    socket.emit('checkRoom', { roomId }, (response: {
      success: boolean;
      requiresPassword?: boolean;
      error?: string;
    }) => {
      if (!response.success) {
        setError(response.error || 'Unable to join room');
        return;
      }

      if (response.requiresPassword && !password) {
        setError('This room requires a password');
        return;
      }

      // Attempt to join the room
      onJoinRoom(roomId, password);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join Private Room</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="roomId">Room ID</Label>
            <Input
              id="roomId"
              value={roomId}
              onChange={(e) => {
                setRoomId(e.target.value);
                setError(null);
              }}
              placeholder="Enter room ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Room Password (if required)</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              placeholder="Enter room password"
            />
          </div>

          <Button onClick={checkRoomAccess} className="w-full">
            Join Room
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
