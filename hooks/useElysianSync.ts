'use client';

import { useEffect, useRef, useState } from 'react';

export function useElysianSync() {
  const [status, setStatus] = useState<'DISCONNECTED' | 'CONNECTING' | 'CONNECTED'>('DISCONNECTED');
  const [messages, setMessages] = useState<{ role: 'USER' | 'AI'; text: string }[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:3001');
    setStatus('CONNECTING');

    ws.current.onopen = () => setStatus('CONNECTED');
    ws.current.onclose = () => setStatus('DISCONNECTED');
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'AI_RESPONSE') {
        setMessages((prev) => [...prev, { role: 'AI', text: data.text }]);
      }
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const sendMessage = (text: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      setMessages((prev) => [...prev, { role: 'USER', text }]);
      ws.current.send(JSON.stringify({ text }));
    }
  };

  return { status, messages, sendMessage };
}
