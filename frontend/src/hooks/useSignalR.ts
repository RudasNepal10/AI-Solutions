"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import {
  HubConnectionBuilder,
  HubConnection,
  HubConnectionState,
  HttpTransportType,
  LogLevel,
} from "@microsoft/signalr";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store";
import { HUB_URL } from "@/lib/api";

export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "reconnecting";

interface UseSignalROptions {
  onReceiveChunk?: (chunk: string) => void;
  onStreamStarted?: () => void;
  onStreamCompleted?: (result: unknown) => void;
  onTyping?: (isTyping: boolean) => void;
  onError?: (error: string) => void;
}

interface UseSignalRReturn {
  status: ConnectionStatus;
  sendMessage: (sessionId: number, message: string) => Promise<void>;
  connectionId: string | null;
}

export function useSignalR(options: UseSignalROptions): UseSignalRReturn {
  const connectionRef = useRef<HubConnection | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const { user } = useAuthStore();

  const getToken = useCallback(() => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("accessToken") ?? "";
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    if (!user) return;

    // Prevent duplicate connections
    if (
      connectionRef.current &&
      connectionRef.current.state !== HubConnectionState.Disconnected
    ) {
      return;
    }

    const connection = new HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: getToken,
        withCredentials: true,
        transport:
          HttpTransportType.WebSockets | HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(LogLevel.Warning)
      .build();

    // Register all event handlers
    connection.on("ReceiveMessageChunk", (chunk: string) => {
      optionsRef.current.onReceiveChunk?.(chunk);
    });

    connection.on("ReceiveMessageStreamStarted", () => {
      optionsRef.current.onStreamStarted?.();
    });

    connection.on("ReceiveMessageStreamCompleted", (result: unknown) => {
      optionsRef.current.onStreamCompleted?.(result);
    });

    connection.on("ReceiveTyping", (isTyping: boolean) => {
      optionsRef.current.onTyping?.(isTyping);
    });

    connection.on("ReceiveError", (error: string) => {
      optionsRef.current.onError?.(error);
      toast.error(error, { duration: 4000 });
    });

    // Connection lifecycle
    connection.onreconnecting(() => {
      if (!mountedRef.current) return;
      setStatus("reconnecting");
      toast.loading("Reconnecting to AI chat…", { id: "signalr-reconnect" });
    });

    connection.onreconnected(() => {
      if (!mountedRef.current) return;
      setStatus("connected");
      setConnectionId(connection.connectionId);
      toast.success("AI chat reconnected", { id: "signalr-reconnect" });
    });

    connection.onclose(() => {
      if (!mountedRef.current) return;
      setStatus("disconnected");
      setConnectionId(null);
    });

    connectionRef.current = connection;

    const start = async () => {
      try {
        if (!mountedRef.current) return;
        setStatus("connecting");
        await connection.start();
        if (!mountedRef.current) {
          await connection.stop();
          return;
        }
        setStatus("connected");
        setConnectionId(connection.connectionId);
      } catch {
        if (mountedRef.current) {
          setStatus("disconnected");
        }
      }
    };

    start();

    return () => {
      mountedRef.current = false;
      if (connectionRef.current) {
        connectionRef.current.stop().catch(() => null);
        connectionRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId]);

  const sendMessage = useCallback(
    async (sessionId: number, message: string) => {
      const conn = connectionRef.current;
      if (!conn || conn.state !== HubConnectionState.Connected) {
        toast.error("Not connected to AI chat. Please wait…");
        return;
      }
      await conn.invoke("SendMessage", sessionId, message);
    },
    []
  );

  return { status, sendMessage, connectionId };
}
