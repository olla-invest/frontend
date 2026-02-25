import { io, Socket } from "socket.io-client";

const WS_URL = import.meta.env.VITE_API_BASE_URL;

let socket: Socket | null = null;

export function getChartSocket() {
  if (!socket) {
    socket = io(`${WS_URL}/chart`, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
  }
  return socket;
}
