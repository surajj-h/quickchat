import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Users } from 'lucide-react';
import type { Member } from '../../types';

interface MemberListProps {
  members: Member[];
}

export const MemberList: React.FC<MemberListProps> = ({ members }) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users size={20} />
          Members ({members.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          {members.map((member) => (
            <div key={member.id} className="py-2">
              {member.username}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
