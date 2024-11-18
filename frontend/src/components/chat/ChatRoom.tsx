import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { MessageSquare, Lock, Globe } from 'lucide-react';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { MemberList } from './MemberList';
import type { Message, Member } from '../../types';
import { LeaveRoomDialog } from './LeaveRoomDialog';

interface ChatRoomProps {
  messages: Message[];
  members: Member[];
  currentUserId: string;
  isPublic: boolean;
  joinUrl?: string;
  onSendMessage: (message: string) => void;
  onLeaveRoom: () => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({
  messages,
  members,
  currentUserId,
  isPublic,
  joinUrl,
  onSendMessage,
  onLeaveRoom,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-4 gap-4">
        <MemberList members={members} />

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={20} />
                Chat
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  {isPublic ? (
                    <Globe size={16} className="text-green-500" />
                  ) : (
                    <Lock size={16} className="text-yellow-500" />
                  )}
                </div>
                <LeaveRoomDialog onLeaveRoom={onLeaveRoom} />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {joinUrl && (
              <Alert className="mb-4">
                <AlertDescription>
                  Share this link to invite others: {joinUrl}
                </AlertDescription>
              </Alert>
            )}
            <ChatMessageList messages={messages} currentUserId={currentUserId} />
            <ChatInput onSendMessage={onSendMessage} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
