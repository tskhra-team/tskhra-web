import type { ChatTheme } from "./ChatbotPanel";
import type { ChatMessage } from "@/Booking/types/chatbot.types";
import useGetChatSessions from "@/Booking/hooks/useGetChatSessions";
import useGetChatHistory from "@/Booking/hooks/useGetChatHistory";
import { MessageSquarePlus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type ChatbotHistoryProps = {
  theme: ChatTheme;
  customerId: number;
  chatApiKey: string;
  onLoadSession: (sessionId: string, messages: ChatMessage[]) => void;
  onNewChat: () => void;
};

export default function ChatbotHistory({
  theme,
  customerId,
  chatApiKey,
  onLoadSession,
  onNewChat,
}: ChatbotHistoryProps) {
  const { t } = useTranslation("chatbot");
  const isDark = theme === "dark";
  const [loadingSessionId, setLoadingSessionId] = useState<string | null>(null);

  const { data: sessionsData, isLoading } = useGetChatSessions(
    customerId,
    chatApiKey,
  );

  const { data: historyData } = useGetChatHistory(
    loadingSessionId,
    chatApiKey,
  );

  if (historyData?.messages && loadingSessionId) {
    const mapped: ChatMessage[] = historyData.messages.map((msg, i) => ({
      id: `${loadingSessionId}-${i}`,
      role: msg.role as "user" | "assistant",
      content: msg.content,
      timestamp: new Date(msg.created_at),
    }));
    onLoadSession(loadingSessionId, mapped);
    setLoadingSessionId(null);
  }

  const sessions = sessionsData?.sessions ?? [];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={onNewChat}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
            isDark
              ? "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
              : "bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <MessageSquarePlus className="size-4" />
          {t("history.newChat")}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 scrollbar-thin">
        {isLoading ? (
          <div className="space-y-2 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`rounded-xl p-3.5 space-y-2 ${
                  isDark ? "bg-white/5" : "bg-gray-50"
                }`}
              >
                <div
                  className={`h-3.5 w-3/4 rounded animate-pulse ${
                    isDark ? "bg-white/10" : "bg-gray-200"
                  }`}
                />
                <div
                  className={`h-3 w-1/3 rounded animate-pulse ${
                    isDark ? "bg-white/5" : "bg-gray-100"
                  }`}
                />
              </div>
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex-1 flex items-center justify-center pt-16">
            <p
              className={`text-sm ${
                isDark ? "text-white/30" : "text-gray-400"
              }`}
            >
              {t("history.empty")}
            </p>
          </div>
        ) : (
          sessions.map((session) => (
            <button
              key={session.session_id}
              onClick={() => setLoadingSessionId(session.session_id)}
              disabled={loadingSessionId === session.session_id}
              className={`w-full text-left rounded-xl p-3.5 transition-colors cursor-pointer ${
                isDark
                  ? "bg-white/5 border border-white/10 hover:bg-white/10"
                  : "bg-gray-50 border border-gray-100 hover:bg-gray-100"
              } ${loadingSessionId === session.session_id ? "opacity-50" : ""}`}
            >
              <p
                className={`text-sm truncate ${
                  isDark ? "text-white/80" : "text-gray-800"
                }`}
              >
                {session.preview}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className={`text-xs ${
                    isDark ? "text-white/30" : "text-gray-400"
                  }`}
                >
                  {session.message_count} {t("history.messages")}
                </span>
                <span
                  className={`text-xs ${
                    isDark ? "text-white/20" : "text-gray-300"
                  }`}
                >
                  ·
                </span>
                <span
                  className={`text-xs ${
                    isDark ? "text-white/30" : "text-gray-400"
                  }`}
                >
                  {new Date(session.last_message_at).toLocaleDateString()}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
