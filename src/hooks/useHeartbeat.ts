import { useEffect } from 'react';
import { sendHeartbeatApi } from '../services/authApi';

const HEARTBEAT_INTERVAL = 30_000;

export const useHeartbeat = (isAuthenticated: boolean) => {
  useEffect(() => {
    if (!isAuthenticated) return;

    const send = () => {
      sendHeartbeatApi().catch(() => {});
    };

    send();
    const id = setInterval(send, HEARTBEAT_INTERVAL);

    return () => clearInterval(id);
  }, [isAuthenticated]);
};
