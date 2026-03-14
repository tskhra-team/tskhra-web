import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

type VerifiedUser = {
  children: ReactNode;
  isVerified: boolean | undefined;
};

export default function BlurVerifiedUser({
  children,
  isVerified,
}: VerifiedUser) {
  const { t } = useTranslation("profile");
  if (!isVerified) return <>{children}</>;

  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none select-none">{children}</div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4 bg-white border border-[#ebebeb] rounded-lg p-8 shadow-sm">
          <div className="flex justify-center">
            <div className="p-4 bg-emerald-50/50 rounded-full">
              <Check className="w-12 h-12 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-medium text-foreground tracking-tight">
            {t("form.alreadyVerified.title")}
          </p>
          <p className="text-muted-foreground">
            {t("form.alreadyVerified.description")}
          </p>
        </div>
      </div>
    </div>
  );
}
