import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useSocket } from '../../context/SocketContext';

interface LoginFormProps {
  onLogin: (userId: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const { socket } = useSocket();

  const handleRegister = () => {
    if (!username.trim()) return;

    socket.emit('register', { username }, (response: { success: boolean; userId?: string }) => {
      if (response.success && response.userId) {
        onLogin(response.userId);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Chat App</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Enter your name</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <Button onClick={handleRegister} className="w-full">
              Join Chat
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
