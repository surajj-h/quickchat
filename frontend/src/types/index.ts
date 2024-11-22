export interface Message {
  userId: string;
  username: string;
  content: string;
  timestamp: number;
}

export interface Room {
  id: string;
  name: string;
  memberCount: number;
  creator: {
    id: string;
    username: string;
  };
}

export interface Member {
  id: string;
  username: string;
}
