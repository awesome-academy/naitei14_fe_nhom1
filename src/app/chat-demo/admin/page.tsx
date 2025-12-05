'use client';

import AdminChat from '@/src/components/AdminChat';
import SocketInitializer from '@/src/components/SocketInitializer';

export default function AdminPage() {
  return (
    <>
      <SocketInitializer />
      <AdminChat />
    </>
  );
}
