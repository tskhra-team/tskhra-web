import type { ChatMessage } from "@/Booking/types/chatbot.types";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "radix-ui";
import { useState } from "react";
import ChatbotHeader from "./ChatbotHeader";
import ChatbotHistory from "./ChatbotHistory";
import ChatbotInput from "./ChatbotInput";
import ChatbotMessageList from "./ChatbotMessageList";
import ChatbotWelcome from "./ChatbotWelcome";

export type ChatTheme = "light" | "dark";

type ChatbotPanelProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  messages: ChatMessage[];
  isTyping: boolean;
  onSendMessage: (content: string) => void;
  onLoadSession: (sessionId: string, messages: ChatMessage[]) => void;
  onNewChat: () => void;
  businessName: string;
  customerId?: number;
  chatApiKey?: string;
};

export default function ChatbotPanel({
  isOpen,
  onOpenChange,
  messages,
  isTyping,
  onSendMessage,
  onLoadSession,
  onNewChat,
  businessName,
  customerId,
  chatApiKey,
}: ChatbotPanelProps) {
  const [theme, setTheme] = useState<ChatTheme>("light");
  const [view, setView] = useState<"chat" | "history">("chat");

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const isDark = theme === "dark";
  const isAuthenticated = !!customerId && !!chatApiKey;

  const handleToggleHistory = () =>
    setView((prev) => (prev === "chat" ? "history" : "chat"));

  const handleLoadSession = (sessionId: string, msgs: ChatMessage[]) => {
    onLoadSession(sessionId, msgs);
    setView("chat");
  };

  const handleNewChat = () => {
    onNewChat();
    setView("chat");
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className={`w-full sm:max-w-md p-0 gap-0 border-l ${
          isDark ? "border-white/5" : "border-gray-200"
        }`}
        style={{
          background: isDark ? "#0a0a0f" : "#ffffff",
        }}
      >
        <VisuallyHidden.Root>
          <SheetTitle>AI Chat Bot</SheetTitle>
        </VisuallyHidden.Root>

        <ChatbotHeader
          businessName={businessName}
          theme={theme}
          onToggleTheme={toggleTheme}
          showHistory={isAuthenticated}
          onToggleHistory={handleToggleHistory}
          isHistoryView={view === "history"}
        />

        {view === "history" && isAuthenticated ? (
          <ChatbotHistory
            theme={theme}
            customerId={customerId}
            chatApiKey={chatApiKey}
            onLoadSession={handleLoadSession}
            onNewChat={handleNewChat}
          />
        ) : messages.length === 0 ? (
          <ChatbotWelcome onSuggestionClick={onSendMessage} theme={theme} />
        ) : (
          <ChatbotMessageList messages={messages} theme={theme} />
        )}

        {view !== "history" && (
          <ChatbotInput
            onSend={onSendMessage}
            disabled={isTyping}
            theme={theme}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
