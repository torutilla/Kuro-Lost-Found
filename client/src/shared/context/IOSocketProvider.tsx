import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "../config/api.ts";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../types/socket.ts";

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
const SocketContext = createContext<AppSocket | null>(null);
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<AppSocket | null>(null);

  useEffect(() => {
    const newSocket: AppSocket = io(API_BASE_URL, {
      withCredentials: true,
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const socket = useContext(SocketContext);
  if (!socket) throw new Error("Socket not initialized");
  return socket;
}
