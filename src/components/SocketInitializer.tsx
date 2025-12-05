'use client';

import { useEffect } from 'react';

export default function SocketInitializer() {
  useEffect(() => {
    // Initialize socket server
    fetch('/api/socket').catch((err) => {
      console.error('Failed to initialize socket:', err);
    });
  }, []);

  return null;
}
