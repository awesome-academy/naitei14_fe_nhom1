'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Message, ChatSession } from '@/src/types/chat';
import { nanoid } from 'nanoid';

export default function AdminChat() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<{ [userId: string]: boolean }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [sessions, selectedUserId]);

  useEffect(() => {
    const socketInstance = io({
      path: '/api/socket',
    });

    socketInstance.on('connect', () => {
      console.log('Admin connected to socket server');
      setIsConnected(true);
      
      socketInstance.emit('join', {
        userId: 'admin',
        userName: 'Admin',
        role: 'admin',
      });
    });

    socketInstance.on('disconnect', () => {
      console.log('Admin disconnected from socket server');
      setIsConnected(false);
    });

    socketInstance.on('sessions', (receivedSessions: ChatSession[]) => {
      console.log('Received sessions:', receivedSessions);
      setSessions(receivedSessions);
      
      if (!selectedUserId && receivedSessions.length > 0) {
        setSelectedUserId(receivedSessions[0].userId);
      }
    });

    socketInstance.on('receiveMessage', (message: Message) => {
      console.log('Admin received message:', message);
      
      setSessions((prev) => {
        return prev.map((session) => {
          if (session.userId === message.senderId) {
            return {
              ...session,
              messages: [...session.messages, message],
              lastMessage: message,
              unreadCount: selectedUserId === message.senderId ? 0 : session.unreadCount + 1,
            };
          }
          return session;
        });
      });
    });

    socketInstance.on('messageSent', (message: Message) => {
      console.log('Admin message sent confirmed:', message);
    });

    socketInstance.on('updateSession', ({ userId, message }: { userId: string; message: Message }) => {
      setSessions((prev) => {
        return prev.map((session) => {
          if (session.userId === userId) {
            const messageExists = session.messages.some((m: Message) => 
              m.content === message.content && 
              m.senderId === message.senderId &&
              Math.abs(new Date(m.timestamp).getTime() - new Date(message.timestamp).getTime()) < 2000
            );
            if (messageExists) {
              return {
                ...session,
                messages: session.messages.map((m: Message) =>
                  m.content === message.content && 
                  m.senderId === message.senderId &&
                  Math.abs(new Date(m.timestamp).getTime() - new Date(message.timestamp).getTime()) < 2000
                    ? { ...m, id: message.id } // update ID từ server
                    : m
                ),
                lastMessage: message,
              };
            }
            
            return {
              ...session,
              messages: [...session.messages, message],
              lastMessage: message,
            };
          }
          return session;
        });
      });
    });

    socketInstance.on('newMessageNotification', ({ userId, message }: { userId: string; userName: string; message: Message }) => {
      console.log('🔔 New message notification from:', userId);
      
      setSessions((prev) => {
        return prev.map((session) => {
          if (session.userId === userId) {
            const messageExists = session.messages.some((m: Message) => m.id === message.id);
            if (messageExists) {
              return session;
            }
            
            return {
              ...session,
              messages: [...session.messages, message],
              lastMessage: message,
              unreadCount: selectedUserId === userId ? 0 : session.unreadCount + 1,
            };
          }
          return session;
        });
      });
    });

    socketInstance.on('userTyping', ({ userId, isTyping }: { userId: string; isTyping: boolean }) => {
      setTypingUsers((prev) => ({
        ...prev,
        [userId]: isTyping,
      }));
    });

    socketInstance.on('userOnline', ({ userId }: { userId: string }) => {
      setSessions((prev) =>
        prev.map((session) =>
          session.userId === userId ? { ...session, isOnline: true } : session
        )
      );
    });

    socketInstance.on('userOffline', ({ userId }: { userId: string }) => {
      setSessions((prev) =>
        prev.map((session) =>
          session.userId === userId ? { ...session, isOnline: false } : session
        )
      );
    });

    setSocket(socketInstance);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      setSessions((prev) =>
        prev.map((session) =>
          session.userId === selectedUserId
            ? { ...session, unreadCount: 0 }
            : session
        )
      );
    }
  }, [selectedUserId]);

  const sendMessage = () => {
    if (!socket || !inputMessage.trim() || !selectedUserId) return;

    const messageData = {
      senderId: 'admin',
      senderName: 'Admin',
      receiverId: selectedUserId,
      content: inputMessage.trim(),
    };

    const tempMessage: Message = {
      id: nanoid(),
      ...messageData,
      timestamp: new Date(),
      isRead: false,
    };

    setSessions((prev) => {
      return prev.map((session) => {
        if (session.userId === selectedUserId) {
          return {
            ...session,
            messages: [...session.messages, tempMessage],
            lastMessage: tempMessage,
          };
        }
        return session;
      });
    });

    socket.emit('sendMessage', messageData);
    setInputMessage('');

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket.emit('typing', { userId: 'admin', receiverId: selectedUserId, isTyping: false });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);

    if (!socket || !selectedUserId) return;

    socket.emit('typing', { userId: 'admin', receiverId: selectedUserId, isTyping: true });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', { userId: 'admin', receiverId: selectedUserId, isTyping: false });
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const selectedSession = sessions.find((s) => s.userId === selectedUserId);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - User List */}
      <div className="w-80 border-r bg-white">
        {/* Header */}
        <div className="border-b bg-purple-600 p-4 text-white">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="text-sm">
            {isConnected ? (
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-400"></span>
                Đang kết nối
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-400"></span>
                Đang kết nối...
              </span>
            )}
          </p>
        </div>

        {/* User Sessions */}
        <div className="overflow-y-auto">
          {sessions.map((session) => (
            <div
              key={session.userId}
              onClick={() => setSelectedUserId(session.userId)}
              className={`cursor-pointer border-b p-4 transition-colors ${
                selectedUserId === session.userId
                  ? 'bg-purple-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 text-white font-semibold">
                      {session.userName.charAt(0)}
                    </div>
                    {session.isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{session.userName}</h3>
                    <p className="text-xs text-gray-500">
                      {session.lastMessage
                        ? session.lastMessage.content.substring(0, 30) +
                          (session.lastMessage.content.length > 30 ? '...' : '')
                        : 'Chưa có tin nhắn'}
                    </p>
                  </div>
                </div>
                {session.unreadCount > 0 && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {session.unreadCount}
                  </span>
                )}
              </div>
              {typingUsers[session.userId] && (
                <p className="mt-1 text-xs text-purple-600">Đang nhập...</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col">
        {selectedSession ? (
          <>
            {/* Chat Header */}
            <div className="border-b bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 text-white font-semibold">
                    {selectedSession.userName.charAt(0)}
                  </div>
                  {selectedSession.isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold">{selectedSession.userName}</h2>
                  <p className="text-sm text-gray-500">
                    {selectedSession.isOnline ? 'Đang online' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {selectedSession.messages.map((msg: Message) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs rounded-lg px-4 py-2 ${
                        msg.senderId === 'admin'
                          ? 'bg-purple-500 text-white'
                          : 'bg-white text-gray-800'
                      }`}
                    >
                      <p className="text-sm font-semibold">
                        {msg.senderId === 'admin' ? 'Bạn (Admin)' : msg.senderName}
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

              {typingUsers[selectedSession.userId] && (
                <div className="flex justify-start mt-2">
                  <div className="bg-gray-300 rounded-lg px-4 py-2">
                    <p className="text-sm text-gray-600">
                      {selectedSession.userName} đang nhập...
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t bg-white p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none"
                  disabled={!isConnected}
                />
                <button
                  onClick={sendMessage}
                  disabled={!isConnected || !inputMessage.trim()}
                  className="rounded-lg bg-purple-500 px-6 py-2 text-white hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Gửi
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg">Chọn một user để bắt đầu chat</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
