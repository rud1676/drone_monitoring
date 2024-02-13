import { useCallback } from 'react';
import io from 'socket.io-client';
import { backUrl } from '../define';

let socket = null;
const useClientSocket = () => {
  const disconnect = useCallback(() => {
    socket.disconnect();
    socket = {};
  }, []);

  if (!socket) {
    socket = io(`${backUrl}/web-client`, {
      transports: ['websocket'],
    });
  }

  return [socket, disconnect];
};

export default useClientSocket;
