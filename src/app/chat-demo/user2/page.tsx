'use client';

import UserChat from '@/src/components/UserChat';
import SocketInitializer from '@/src/components/SocketInitializer';

export default function User2Page() {
  return (
    <>
      <SocketInitializer />
      <UserChat userId="user2" userName="User 2" />
    </>
  );
}
