import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AlreadyVerified() {
  const { t } = useTranslation("verification");
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
        <div className="relative p-4 bg-linear-to-br from-green-500 to-green-600 rounded-full shadow-lg">
          <Check className="w-16 h-16 text-white" />
        </div>
      </div>

      <h1 className="text-3xl  md:text-4xl font-bold bg-linear-to-r from-green-600 to-green-500 bg-clip-text text-transparent mb-4 pb-5">
        {t("alreadyVerified.title")}
      </h1>

      <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-md mb-8">
        {t("alreadyVerified.description")}
      </p>
    </div>
  );
}
