'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Message } from '@/src/types/chat';
import { nanoid } from 'nanoid';

interface UserChatProps {
  userId: string;
  userName: string;
}

export default function UserChat({ userId, userName }: UserChatProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const socketInstance = io({
      path: '/api/socket',
    });

    socketInstance.on('connect', () => {
      console.log('✅ Connected to socket server');
      setIsConnected(true);
      
      socketInstance.emit('join', {
        userId,
        userName,
        role: 'user',
      });
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Disconnected from socket server');
      setIsConnected(false);
    });

    socketInstance.on('chatHistory', (history: Message[]) => {
      console.log('📜 Received chat history:', history);
      setMessages(history);
    });

    socketInstance.on('receiveMessage', (message: Message) => {
      console.log('📩 Received message:', message);
      setMessages((prev) => [...prev, message]);
    });

    socketInstance.on('messageSent', (message: Message) => {
      console.log('✅ Message sent confirmed:', message);
    });

    socketInstance.on('userTyping', ({ userId: typingUserId, isTyping: typing }) => {
      if (typingUserId === 'admin') {
        setIsTyping(typing);
      }
    });

    setSocket(socketInstance);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      socketInstance.disconnect();
    };
  }, [userId, userName]);

  const sendMessage = () => {
    if (!socket || !inputMessage.trim()) return;

    const messageData = {
      senderId: userId,
      senderName: userName,
      receiverId: 'admin',
      content: inputMessage.trim(),
    };

    const tempMessage: Message = {
      id: nanoid(),
      ...messageData,
      timestamp: new Date(),
      isRead: false,
    };
    setMessages((prev) => [...prev, tempMessage]);

    socket.emit('sendMessage', messageData);
    setInputMessage('');

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket.emit('typing', { userId, receiverId: 'admin', isTyping: false });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);

    if (!socket) return;

    socket.emit('typing', { userId, receiverId: 'admin', isTyping: true });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', { userId, receiverId: 'admin', isTyping: false });
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 p-4 text-white shadow-lg">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-xl font-bold">{userName}</h1>
          <p className="text-sm">
            {isConnected ? (
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-400"></span>
                Đang kết nối với Admin
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-400"></span>
                Đang kết nối...
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="mx-auto flex-1 w-full max-w-4xl overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs rounded-lg px-4 py-2 ${
                  msg.senderId === userId
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800'
                }`}
              >
                <p className="text-sm font-semibold">
                  {msg.senderId === userId ? 'Bạn' : msg.senderName}
                </p>
                <p>{msg.content}</p>
                <p className="mt-1 text-xs opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString('vi-VN')}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {isTyping && (
          <div className="flex justify-start mt-2">
            <div className="bg-gray-300 rounded-lg px-4 py-2">
              <p className="text-sm text-gray-600">Admin đang nhập...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t bg-white p-4">
        <div className="mx-auto max-w-4xl flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            disabled={!isConnected}
          />
          <button
            onClick={sendMessage}
            disabled={!isConnected || !inputMessage.trim()}
            className="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
