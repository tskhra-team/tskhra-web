import type { ChatTheme } from "./ChatbotPanel";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

type ChatbotWelcomeProps = {
  onSuggestionClick: (message: string) => void;
  theme: ChatTheme;
};

const suggestionKeys = ["services", "hours", "booking", "pricing"] as const;

export default function ChatbotWelcome({
  onSuggestionClick,
  theme,
}: ChatbotWelcomeProps) {
  const { t } = useTranslation("chatbot");
  const isDark = theme === "dark";

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
      <motion.div
        animate={{
          scale: [0.95, 1.05, 0.98, 1],
          opacity: [0.6, 0.85, 0.65, 0.75],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut",
        }}
        className="size-20 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, #c084fc, #a855f7, #7c3aed)",
          boxShadow: isDark
            ? "0 0 60px rgba(124, 58, 237, 0.3), 0 0 120px rgba(168, 85, 247, 0.15)"
            : "0 0 40px rgba(124, 58, 237, 0.2), 0 0 80px rgba(168, 85, 247, 0.1)",
        }}
      />

      <div className="text-center space-y-2">
        <h3
          className={`text-lg font-semibold ${
            isDark ? "text-white/90" : "text-gray-900"
          }`}
        >
          {t("welcome.greeting")}
        </h3>
        <p className={`text-sm ${isDark ? "text-white/40" : "text-gray-400"}`}>
          {t("welcome.subtitle")}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 max-w-xs">
        {suggestionKeys.map((key, i) => (
          <motion.button
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3 + i * 0.1,
              type: "spring",
              stiffness: 300,
              damping: 24,
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSuggestionClick(t(`suggestions.${key}`))}
            className={`px-3.5 py-2 text-xs rounded-full transition-colors cursor-pointer ${
              isDark
                ? "text-white/70 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white/90"
                : "text-gray-600 bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:text-gray-900"
            }`}
          >
            {t(`suggestions.${key}`)}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
