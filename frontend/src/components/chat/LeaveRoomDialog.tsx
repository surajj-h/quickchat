import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';

interface LeaveRoomDialogProps {
  onLeaveRoom: () => void;
}

export const LeaveRoomDialog: React.FC<LeaveRoomDialogProps> = ({ onLeaveRoom }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut size={16} />
          Leave Room
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave Room</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to leave this room? You'll need to be invited again to rejoin if it's a private room.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onLeaveRoom} className="bg-red-500 hover:bg-red-600">
            Leave Room
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
