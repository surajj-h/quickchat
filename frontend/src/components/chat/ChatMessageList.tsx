import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import type { Message } from '../../types';

interface ChatMessageListProps {
  messages: Message[];
  currentUserId: string;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, currentUserId }) => {
  return (
    <ScrollArea className="h-[400px] mb-4">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            isOwnMessage={message.userId === currentUserId}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
