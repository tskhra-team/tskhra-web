import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface LanguageSwitcherProps {
  className?: string;
  style?: object;
}

export default function LanguageSwitcher({
  className,
  style,
}: LanguageSwitcherProps) {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.resolvedLanguage || i18n.language;

  const toggleLanguage = () => {
    const newLang = currentLanguage === "en" ? "ka" : "en";
    i18n.changeLanguage(newLang);
  };

  const currentLangLabel = currentLanguage === "en" ? "EN" : "ქარ";

  return (
    <button
      style={style}
      onClick={toggleLanguage}
      className={cn(
        "text-[#1E1E1E]",
        "px-3 sm:px-4 lg:px-5 h-9 lg:h-10",
        "text-xs sm:text-sm lg:text-base",
        "hover:bg-slate-100 hover:border-slate-300",
        "transition-all duration-300",
        "shadow-sm hover:shadow-md",
        "rounded-md",
        className,
      )}
      aria-label={`Switch to ${currentLanguage === "en" ? "Georgian" : "English"}`}
    >
      {currentLangLabel}
    </button>
  );
}
