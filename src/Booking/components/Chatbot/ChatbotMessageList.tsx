import type { ChatMessage } from "@/Booking/types/chatbot.types";
import type { ChatTheme } from "./ChatbotPanel";
import ChatbotMessage from "./ChatbotMessage";
import { AnimatePresence } from "motion/react";
import { useEffect, useRef } from "react";

type ChatbotMessageListProps = {
  messages: ChatMessage[];
  theme: ChatTheme;
};

export default function ChatbotMessageList({
  messages,
  theme,
}: ChatbotMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;

    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin"
    >
      <AnimatePresence mode="popLayout">
        {messages.map((msg) => (
          <ChatbotMessage key={msg.id} message={msg} theme={theme} />
        ))}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}
