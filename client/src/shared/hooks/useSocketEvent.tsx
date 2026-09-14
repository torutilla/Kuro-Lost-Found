import { useSocket } from "@shared/context/IOSocketProvider.tsx";
import { useEffect, useRef } from "react";
import type { ServerToClientEvents } from "@shared/types/socket.ts";

type EventKey = keyof ServerToClientEvents;
type Props<K extends EventKey> = {
  event: K;
  callback: (...args: Parameters<ServerToClientEvents[K]>) => void;
};
export default function useSocketEvent<K extends EventKey>({
  event,
  callback,
}: Props<K>) {
  const socket = useSocket();
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!socket) return;

    const handler = (...args: Parameters<ServerToClientEvents[K]>) => {
      callbackRef.current(...args);
    };

    socket.on(event as any, handler);

    return () => {
      socket.off(event as any, handler);
    };
  }, [socket, event]);

  return { socket };
}
