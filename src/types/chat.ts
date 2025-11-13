export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface User {
  id: string;
  name: string;
  role: 'user' | 'admin';
  isOnline: boolean;
}

export interface ChatSession {
  userId: string;
  userName: string;
  messages: Message[];
  unreadCount: number;
  lastMessage?: Message;
  isOnline?: boolean;
}

export type SocketMessage =
  | { type: 'message'; data: Message }
  | { type: 'typing'; data: { userId: string; isTyping: boolean } }
  | { type: 'online'; data: { userId: string } }
  | { type: 'offline'; data: { userId: string } };
