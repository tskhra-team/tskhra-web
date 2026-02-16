import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

type VerifyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function VerifyDialog({
  open,
  onOpenChange,
}: VerifyDialogProps) {
  const navigate = useNavigate();
  const { t } = useTranslation("profile");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <div className="flex flex-col items-center text-center py-4">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative p-4 bg-linear-to-br from-red-500 to-red-600 rounded-full shadow-lg">
              <AlertCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          <DialogHeader className="space-y-4">
            <DialogTitle className="text-xl md:text-2xl font-bold bg-linear-to-r from-red-600 to-red-500 bg-clip-text text-transparent text-center">
              {t("verifyDialog.title")}
            </DialogTitle>
            <DialogDescription className="text-base text-center md:text-lg text-gray-600 leading-relaxed px-2">
              {t("verifyDialog.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl w-full">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-left">
                <p className="text-sm font-semibold text-blue-900 mb-1">
                  {t("verifyDialog.whyTitle")}
                </p>
                <p className="text-xs text-blue-700">
                  {t("verifyDialog.whyDescription")}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-8 w-full flex-col-reverse sm:flex-row gap-3">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto border-gray-300 hover:bg-gray-50"
              >
                {t("verifyDialog.close")}
              </Button>
            </DialogClose>
            <Button
              onClick={() => {
                navigate("/profile?section=settings");
                onOpenChange(false);
              }}
              className="w-full sm:w-auto bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ShieldCheck className="w-4 h-4" />
              {t("verifyDialog.goToVerification")}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
