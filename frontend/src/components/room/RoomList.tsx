import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import type { Room } from '../../types';

interface RoomListProps {
  rooms: Room[];
  onJoinRoom: (roomId: string) => void;
}

export const RoomList: React.FC<RoomListProps> = ({ rooms, onJoinRoom }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Public Rooms</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="p-4 border rounded-lg flex items-center justify-between hover:bg-gray-50"
            >
              <div>
                <h3 className="font-medium">{room.name}</h3>
                <p className="text-sm text-gray-500">
                  Created by {room.creator.username} • {room.memberCount} members
                </p>
              </div>
              <Button onClick={() => onJoinRoom(room.id)}>
                Join
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
