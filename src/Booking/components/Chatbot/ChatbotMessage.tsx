import type { ChatMessage } from "@/Booking/types/chatbot.types";
import type { ChatTheme } from "./ChatbotPanel";
import { motion } from "motion/react";

type ChatbotMessageProps = {
  message: ChatMessage;
  theme: ChatTheme;
};

export default function ChatbotMessage({ message, theme }: ChatbotMessageProps) {
  const isUser = message.role === "user";
  const isLoading = !isUser && message.content.length === 0;
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={isUser ? { opacity: 0, y: 12, scale: 0.95 } : { opacity: 0, x: -12 }}
      animate={isUser ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-2xl rounded-br-md text-white"
            : isDark
              ? "rounded-2xl rounded-bl-md text-white/90 bg-white/5 border border-white/10"
              : "rounded-2xl rounded-bl-md text-gray-800 bg-gray-100 border border-gray-200"
        }`}
        style={
          isUser
            ? {
                background:
                  "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
              }
            : undefined
        }
      >
        {isLoading ? (
          <div className="flex gap-1.5 items-center py-0.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className={`size-1.5 rounded-full ${
                  isDark ? "bg-white/40" : "bg-gray-400"
                }`}
                animate={{ y: [0, -6, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        ) : (
          message.content
        )}
      </div>
    </motion.div>
  );
}
