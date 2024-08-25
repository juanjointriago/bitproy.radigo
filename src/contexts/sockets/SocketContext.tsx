import { useContext, useEffect } from "react";
import { createContext } from "react";
import { useSocket } from "../../service/hooks/useSockets";
import { API_HOST } from "../../service/helpers/constants";
import { AuthContext } from "../Auth/AuthContext";

export const SocketContext = createContext({} as any);

export const SocketProvider = ({ children }: any) => {
  const { socket, online, conectarSocket, desconectarSocket } =
    useSocket(API_HOST);

  const { token } = useContext(AuthContext);
  useEffect(() => {
    if (token) {
      conectarSocket();
    }
  }, [token, conectarSocket]);

  useEffect(() => {
    if (!token) {
      desconectarSocket();
    }
  }, [token, desconectarSocket]);

  return (
    <SocketContext.Provider value={{ socket, online }}>
      {children}
    </SocketContext.Provider>
  );
};
