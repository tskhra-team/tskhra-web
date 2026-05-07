import { Button } from "@/components/ui/button";
import { MAGIC_GRADIENT } from "@/Swapping/MagicChain/types";
import { Link2, Wand2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";

export default function FixedButtons({
  selectedItemId,
  handleAutoChain,
  handleManualChain,
  isPending,
  step,
}: {
  selectedItemId: string | null;
  handleAutoChain: () => void;
  handleManualChain: () => void;
  isPending: boolean;
  step: "select" | "discovering" | "results";
}) {
  const { t } = useTranslation(["swapping"]);
  return (
    <AnimatePresence>
      {selectedItemId && step === "select" && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 z-40"
        >
          <div className="max-w-5xl mx-auto flex gap-3">
            <Button
              onClick={handleAutoChain}
              disabled={isPending}
              className="flex-1 h-12 text-base font-bold text-white rounded-xl shadow-lg cursor-pointer"
              style={{ background: MAGIC_GRADIENT }}
            >
              <Wand2 className="w-5 h-5 mr-2" />
              {t("swapping:magicChain.autoChain")}
            </Button>
            <Button
              variant="outline"
              onClick={handleManualChain}
              disabled={isPending}
              className="flex-1 h-12 text-base font-bold rounded-xl border-2 border-purple-200 text-purple-600 hover:bg-purple-50 cursor-pointer"
            >
              <Link2 className="w-5 h-5 mr-2" />
              {t("swapping:magicChain.manualChain")}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
