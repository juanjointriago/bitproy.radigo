import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io,Socket } from 'socket.io-client';

export const useSocket = (serverPath: string) => {
  
  // const socket = useMemo(() => io.connect(serverPath, { transports: ['websocket'] }), [serverPath]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [online, setOnline] = useState(false);

  const conectarSocket = useCallback(async () => {
    const token = await AsyncStorage.getItem('token');


    const socketTemp = io(serverPath, {
      transports: ['websocket'],
      autoConnect: true,
      forceNew: true,
      query: {
        Authorization: token,
      },
    });

    setSocket(socketTemp);
  }, [serverPath]);

  const desconectarSocket = useCallback(() => {
    socket?.disconnect();
  }, [socket]);

  useEffect(() => {
    if (socket) setOnline(socket.connected);
  }, [socket]);

  useEffect(() => {
    socket?.on('connect', () => setOnline(true));
  }, [socket]);

  useEffect(() => {
    socket?.on('disconnect', () => setOnline(false));
  }, [socket]);

  return {
    socket,
    online,
    conectarSocket,
    desconectarSocket,
  };
};

