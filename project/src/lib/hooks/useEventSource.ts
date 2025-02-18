import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { queryClient } from '@/lib/queryClient';

interface UseEventSourceOptions {
  onMessage?: (data: any) => void;
  onError?: (error: Event) => void;
  onConnectionChange?: (isConnected: boolean) => void;
}

export function useEventSource(options: UseEventSourceOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Event | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
    const host = window.location.hostname;
    const port = '3001';
    const eventSource = new EventSource(`${protocol}//${host}:${port}/events`);

    eventSource.onopen = () => {
      setIsConnected(true);
      setError(null);
      options.onConnectionChange?.(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'PING':
            // Keep connection alive
            break;
          case 'BOOKING_UPDATED':
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            toast.success('Booking updated');
            break;
          case 'PACKAGE_UPDATED':
            queryClient.invalidateQueries({ queryKey: ['packages'] });
            toast.success('Package updated');
            break;
          case 'PRODUCT_UPDATED':
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product updated');
            break;
          case 'SERVICE_UPDATED':
            queryClient.invalidateQueries({ queryKey: ['services'] });
            toast.success('Service updated');
            break;
          default:
            options.onMessage?.(data);
        }
      } catch (error) {
        console.error('Failed to parse SSE message:', error);
      }
    };

    eventSource.onerror = (event) => {
      setIsConnected(false);
      setError(event);
      options.onConnectionChange?.(false);
      options.onError?.(event);

      // Attempt to reconnect after a delay
      setTimeout(() => {
        eventSource.close();
        // The browser will automatically attempt to reconnect
      }, 5000);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return {
    isConnected,
    error
  };
}