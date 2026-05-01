import type { ChatTheme } from "./ChatbotPanel";
import { SheetClose } from "@/components/ui/sheet";
import { ArrowLeft, History, Moon, Sun, X } from "lucide-react";
import { useTranslation } from "react-i18next";

type ChatbotHeaderProps = {
  businessName: string;
  theme: ChatTheme;
  onToggleTheme: () => void;
  showHistory?: boolean;
  onToggleHistory?: () => void;
  isHistoryView?: boolean;
};

export default function ChatbotHeader({
  businessName,
  theme,
  onToggleTheme,
  showHistory,
  onToggleHistory,
  isHistoryView,
}: ChatbotHeaderProps) {
  const { t } = useTranslation("chatbot");
  const isDark = theme === "dark";

  const btnClass = isDark
    ? "text-white/40 hover:text-white/80 hover:bg-white/5"
    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100";

  return (
    <div
      className={`flex items-center justify-between px-5 py-4 border-b backdrop-blur-xl ${
        isDark
          ? "border-white/5 bg-[#0a0a0f]/95"
          : "border-gray-100 bg-white/95"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div
            className="size-9 rounded-full"
            style={{
              background:
                "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)",
              boxShadow: "0 0 20px rgba(124, 58, 237, 0.4)",
            }}
          />
          <div
            className={`absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-400 border-2 ${
              isDark ? "border-[#0a0a0f]" : "border-white"
            }`}
          />
        </div>
        <div>
          <h3
            className={`text-sm font-semibold ${
              isDark ? "text-white/90" : "text-gray-900"
            }`}
          >
            {isHistoryView ? t("history.title") : t("header.title")}
          </h3>
          <p
            className={`text-xs truncate max-w-45 ${
              isDark ? "text-white/40" : "text-gray-400"
            }`}
          >
            {isHistoryView
              ? t("history.subtitle")
              : t("header.subtitle", { businessName })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {showHistory && onToggleHistory && (
          <button
            onClick={onToggleHistory}
            className={`rounded-lg p-1.5 transition-colors cursor-pointer ${btnClass}`}
          >
            {isHistoryView ? (
              <ArrowLeft className="size-4" />
            ) : (
              <History className="size-4" />
            )}
          </button>
        )}
        <button
          onClick={onToggleTheme}
          className={`rounded-lg p-1.5 transition-colors cursor-pointer ${btnClass}`}
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
        <SheetClose
          className={`rounded-lg p-1.5 transition-colors ${btnClass}`}
        >
          <X className="size-5" />
        </SheetClose>
      </div>
    </div>
  );
}
