import type { ChatMessage } from "@/Booking/types/chatbot.types";
import type { CredResponse } from "@/Booking/useGetAIChatCreds";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

const AI_CHAT_BASE_URL = "http://10.3.12.144:8001";

type ChatAuth = {
  customer_id: number;
  customer_name: string;
  auth_token: string;
} | null;

export function useChatbot(
  aiCreds: CredResponse | undefined,
  language: string,
  auth?: ChatAuth,
) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || !aiCreds) return;

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      };

      const aiMessageId = crypto.randomUUID();

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      abortRef.current = new AbortController();

      try {
        const payload: Record<string, unknown> = {
          message: trimmed,
          provider_id: aiCreds.aiProviderId,
          session_id: sessionIdRef.current,
          language,
        };

        if (auth) {
          payload.customer_id = auth.customer_id;
          payload.customer_name = auth.customer_name;
          payload.auth_token = auth.auth_token;
        }

        const response = await fetch(`${AI_CHAT_BASE_URL}/api/chat/stream`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": aiCreds.chatApiKey,
          },
          body: JSON.stringify(payload),
          signal: abortRef.current.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error("Stream failed");
        }

        setMessages((prev) => [
          ...prev,
          {
            id: aiMessageId,
            role: "assistant",
            content: "",
            timestamp: new Date(),
          },
        ]);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");

          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || !trimmedLine.startsWith("data: ")) continue;

            const data = trimmedLine.slice(6).trim();

            try {
              const parsed = JSON.parse(data);

              if (parsed.done) break;

              if (parsed.session_id && !sessionIdRef.current) {
                sessionIdRef.current = parsed.session_id;
              }

              const chunk = parsed.token ?? "";

              if (chunk) {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === aiMessageId
                      ? { ...msg, content: msg.content + chunk }
                      : msg,
                  ),
                );
              }
            } catch (err) {
              console.error("Failed to parse stream payload:", data, err);
            }
          }
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;

        setMessages((prev) => {
          const messageExists = prev.some((m) => m.id === aiMessageId);
          if (messageExists) {
            return prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, content: msg.content + "\n\n*[Connection error]*" }
                : msg,
            );
          }
          return [
            ...prev,
            {
              id: aiMessageId,
              role: "assistant",
              content: "Sorry, something went wrong. Please try again.",
              timestamp: new Date(),
            },
          ];
        });
      } finally {
        setIsTyping(false);
        abortRef.current = null;
        if (sessionIdRef.current) {
          queryClient.invalidateQueries({
            queryKey: ["getChatHistory", sessionIdRef.current],
          });
          queryClient.invalidateQueries({
            queryKey: ["getChatSessions"],
          });
        }
      }
    },
    [aiCreds, language, auth, queryClient],
  );

  const loadSession = useCallback(
    (sessionId: string, historyMessages: ChatMessage[]) => {
      if (abortRef.current) abortRef.current.abort();
      setIsTyping(false);
      sessionIdRef.current = sessionId;
      setMessages(historyMessages);
    },
    [],
  );

  const startNewChat = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setIsTyping(false);
    sessionIdRef.current = null;
    setMessages([]);
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (!open) {
      if (abortRef.current) abortRef.current.abort();
      setIsTyping(false);
    }
  }, []);

  return {
    isOpen,
    setIsOpen,
    messages,
    isTyping,
    sendMessage,
    loadSession,
    startNewChat,
    handleOpenChange,
  };
}
