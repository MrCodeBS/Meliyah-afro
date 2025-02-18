import { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'sonner';

interface WebSocketOptions {
  onMessage?: (data: any) => void;
  onError?: (error: Event) => void;
  reconnectAttempts?: number;
  reconnectDelay?: number;
  onConnectionChange?: (isConnected: boolean) => void;
}

export function useWebSocket(url: string, options: WebSocketOptions = {}) {
  const {
    onMessage,
    onError,
    reconnectAttempts = 5,
    reconnectDelay = 1000,
    onConnectionChange
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Event | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const pingIntervalRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    try {
      if (!url) return;

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        return;
      }

      const wsUrl = new URL(url);
      wsUrl.pathname = '/ws';
      
      const ws = new WebSocket(wsUrl.toString());

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
        reconnectCountRef.current = 0;
        onConnectionChange?.(true);

        // Start ping interval
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'PING' }));
          }
        }, 15000);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'PONG') return;
          onMessage?.(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError(event);
        onError?.(event);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        onConnectionChange?.(false);
        
        // Clear ping interval
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
        }

        if (reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current++;
          console.log(`Reconnecting attempt ${reconnectCountRef.current}...`);
          reconnectTimeoutRef.current = setTimeout(connect, reconnectDelay);
        } else {
          toast.error('Failed to establish WebSocket connection');
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('WebSocket connection error:', error);
      setError(error as Event);
    }
  }, [url, reconnectAttempts, reconnectDelay, onMessage, onError, onConnectionChange]);

  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
    };
  }, [connect]);

  const send = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        ...data,
        timestamp: new Date().toISOString()
      }));
    } else {
      toast.error('No WebSocket connection available');
    }
  }, []);

  return {
    isConnected,
    error,
    send
  };
}