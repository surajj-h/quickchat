import React from 'react';
import type { Message } from '../../types';

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwnMessage }) => {
  return (
    <div
      className={`p-2 rounded-lg ${isOwnMessage
          ? 'bg-blue-500 text-white ml-auto'
          : 'bg-gray-100'
        } max-w-[80%]`}
    >
      <div className="font-medium text-sm">
        {message.username}
      </div>
      <div>{message.content}</div>
    </div>
  );
};
