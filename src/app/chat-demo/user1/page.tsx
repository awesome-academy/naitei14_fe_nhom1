'use client';

import UserChat from '@/src/components/UserChat';
import SocketInitializer from '@/src/components/SocketInitializer';

export default function User1Page() {
  return (
    <>
      <SocketInitializer />
      <UserChat userId="user1" userName="User 1" />
    </>
  );
}
