import type { ChatTheme } from "./ChatbotPanel";
import { Send } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type ChatbotInputProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
  theme: ChatTheme;
};

export default function ChatbotInput({ onSend, disabled, theme }: ChatbotInputProps) {
  const { t } = useTranslation("chatbot");
  const [value, setValue] = useState("");
  const isDark = theme === "dark";

  const handleSubmit = () => {
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue("");
  };

  return (
    <div
      className={`px-4 py-3 border-t backdrop-blur-xl ${
        isDark
          ? "border-white/5 bg-[#0a0a0f]/95"
          : "border-gray-100 bg-white/95"
      }`}
    >
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder={t("input.placeholder")}
          disabled={disabled}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#7c3aed]/50 focus:ring-1 focus:ring-[#7c3aed]/20 disabled:opacity-50 ${
            isDark
              ? "bg-white/5 border border-white/10 text-white placeholder:text-white/25"
              : "bg-gray-100 border border-gray-200 text-gray-900 placeholder:text-gray-400"
          }`}
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          className="size-10 rounded-xl flex items-center justify-center text-white transition-opacity disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          style={{
            background:
              "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
          }}
        >
          <Send className="size-4" />
        </motion.button>
      </div>
    </div>
  );
}
