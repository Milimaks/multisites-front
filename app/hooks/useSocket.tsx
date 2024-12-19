import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

const context = createContext<{ socket: Socket | null }>({ socket: null });

export const useSocket = () => {
  return useContext(context);
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>();
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);
  useEffect(() => {
    const createdSocket = io("ws://localhost:8001");
    setSocket(createdSocket);
    if (!createdSocket) return;
    createdSocket.emit("connection");

    const handleConfirmation = () => {
      setIsSocketConnected(true);
    };

    const handleDisconnect = () => {
      setIsSocketConnected(false);
    };
    createdSocket.on("confirmation", handleConfirmation);

    createdSocket.on("disconnect", handleDisconnect);

    return () => {
      createdSocket.off("confirmation", handleConfirmation);
      createdSocket.off("disconnect", handleDisconnect);
    };
  }, []);
  return (
    <context.Provider
      value={{
        socket: socket ?? null,
      }}
    >
      {/* // Test the socket connection */}
      {/* <span className="fixed top-0 right-0">
        {isSocketConnected ? "🟢" : "🔴"}
      </span> */}
      {children}
    </context.Provider>
  );
};
