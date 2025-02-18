'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useEventSource } from '@/lib/hooks/useEventSource';

interface SyncContextType {
  isConnected: boolean;
  error: Event | null;
}

const SyncContext = createContext<SyncContextType | null>(null);

export function SyncProvider({ children }: { children: ReactNode }) {
  const { isConnected, error } = useEventSource({
    onConnectionChange: (connected) => {
      if (connected) {
        console.log('SSE connected');
      } else {
        console.log('SSE disconnected');
      }
    }
  });

  return (
    <SyncContext.Provider 
      value={{ 
        isConnected, 
        error
      }}
    >
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
}