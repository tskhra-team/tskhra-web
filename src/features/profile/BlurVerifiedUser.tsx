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
        <div className="text-center space-y-4 bg-background/80 backdrop-blur-sm p-8 rounded-lg">
          <div className="flex justify-center">
            <div className="p-4 bg-linear-to-br from-green-500 to-green-600 rounded-full shadow-lg">
              <Check className="w-12 h-12 text-white" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-green-500">
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
