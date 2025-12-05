import { Server as NetServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { nanoid } from 'nanoid';
import type { Message } from '../../types/chat';

type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

const chatHistory: { [sessionKey: string]: Message[] } = {};
const onlineUsers: { [userId: string]: Set<string> } = {};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO,
) {
  if (!res.socket.server.io) {
    console.log('🚀 Initializing Socket.IO server...');

    const io = new SocketIOServer(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: process.env.ALLOWED_ORIGINS
          ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
          : 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      socket.on('join', ({ userId, userName, role }) => {
        if (!userId || !userName || !['user', 'admin'].includes(role)) {
          socket.emit('error', { message: 'Invalid join parameters' });
          return;
        }
        console.log(`${userName} (${role}) joined with ID: ${userId}`);
        
        socket.data.userId = userId;
        socket.data.userName = userName;
        socket.data.role = role;
        
        if (!onlineUsers[userId]) {
          onlineUsers[userId] = new Set();
        }
        onlineUsers[userId].add(socket.id);

        if (role === 'admin') {
          const sessions: any[] = [];
          
          ['user1', 'user2'].forEach((uid) => {
            const sessionKey = `${uid}-admin`;
            const messages = chatHistory[sessionKey] || [];
            
            sessions.push({
              userId: uid,
              userName: uid === 'user1' ? 'User 1' : 'User 2',
              messages,
              unreadCount: 0,
              isOnline: !!onlineUsers[uid],
            });
          });

          socket.emit('sessions', sessions);
        } else {
          const sessionKey = `${userId}-admin`;
          const messages = chatHistory[sessionKey] || [];
          socket.emit('chatHistory', messages);
        }

        io.emit('userOnline', { userId, userName, role });
      });

      socket.on('sendMessage', ({ senderId, senderName, receiverId, content }) => {
        if (!senderId || !senderName || !receiverId || !content || typeof content !== 'string') {
          return;
        }
        const sanitizedContent = content.trim();
        if (!sanitizedContent || sanitizedContent.length > 5000) {
          return;
        }
        const message: Message = {
          id: nanoid(),
          senderId,
          senderName,
          receiverId,
          content,
          timestamp: new Date(),
          isRead: false,
        };

        let sessionKey: string;
        if (senderId === 'admin') {
          sessionKey = `${receiverId}-admin`;
        } else {
          sessionKey = `${senderId}-admin`;
        }

        if (!chatHistory[sessionKey]) {
          chatHistory[sessionKey] = [];
        }
        chatHistory[sessionKey].push(message);

        console.log(`Message from ${senderName} to ${receiverId}:`, content);

        const receiverSocketId = onlineUsers[receiverId];
        if (receiverSocketId) {
          receiverSocketId.forEach(socketId => {
            io.to(socketId).emit('receiveMessage', message);
          });
        }

        socket.emit('messageSent', message);

        if (senderId === 'admin') {
          socket.emit('updateSession', {
            userId: receiverId,
            message,
          });
        }
        else {
          const adminSocketId = onlineUsers['admin'];
          if (adminSocketId) {
            adminSocketId.forEach(socketId => {
              io.to(socketId).emit('newMessageNotification', {
                userId: senderId,
                userName: senderName,
                message,
              });
            });
          }
        }
      });

      socket.on('typing', ({ userId, receiverId, isTyping }) => {
        const receiverSocketId = onlineUsers[receiverId];
        if (receiverSocketId) {
          receiverSocketId.forEach(socketId => {
            io.to(socketId).emit('userTyping', { userId, isTyping });
          });
        }
      });

      socket.on('disconnect', () => {
        const userId = socket.data.userId;
        const userName = socket.data.userName;
        
        if (userId) {
          delete onlineUsers[userId];
          io.emit('userOffline', { userId, userName });
          console.log(`👋 ${userName} disconnected`);
        }
      });
    });

    console.log('✅ Socket.IO server initialized');
  } else {
    console.log('Socket.IO server already running');
  }

  res.end();
}
