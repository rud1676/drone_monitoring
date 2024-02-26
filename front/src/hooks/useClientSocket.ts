import { useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { backUrl } from '@/utils/define';

let socket: null | Socket = null;
const useClientSocket = (): [Socket | null, () => void] => {
  const disconnect = useCallback(() => {
    if (socket) socket.disconnect();
    socket = null;
  }, []);

  if (!socket) {
    socket = io(`${backUrl}/web-client`, {
      transports: ['websocket'],
    });
  }

  return [socket, disconnect];
};

export default useClientSocket;
