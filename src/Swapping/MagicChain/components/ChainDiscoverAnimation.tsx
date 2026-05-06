import { MAGIC_GRADIENT } from "@/Swapping/MagicChain/types";
import { Link2, Sparkles, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

const NODES = [
  { icon: Sparkles, delay: 0 },
  { icon: Link2, delay: 0.35 },
  { icon: Zap, delay: 0.7 },
  { icon: Link2, delay: 1.05 },
  { icon: Sparkles, delay: 1.4 },
];

export default function ChainDiscoverAnimation() {
  const { t } = useTranslation(["swapping"]);

  return (
    <div className="flex flex-col items-center justify-center py-32">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative flex flex-col items-center"
      >
        {/* Glow ring */}
        <div className="relative mb-10">
          <motion.div
            className="absolute -inset-10 rounded-full"
            style={{
              background:
                "radial-gradient(circle, var(--swap-magic-mid) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <div className="relative flex items-center gap-0">
            {NODES.map((node, i) => {
              const Icon = node.icon;
              return (
                <div key={i} className="flex items-center">
                  <motion.div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 relative"
                    style={{
                      background: MAGIC_GRADIENT,
                      boxShadow: "0 4px 24px rgba(124, 58, 237, 0.3)",
                    }}
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: [0, 1.2, 1], rotate: [-90, 0] }}
                    transition={{
                      duration: 0.5,
                      delay: node.delay,
                      ease: "backOut",
                    }}
                  >
                    <Icon className="w-5 h-5" />

                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      style={{ border: "2px solid var(--swap-magic-mid)" }}
                      animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                      transition={{
                        duration: 1.5,
                        delay: node.delay + 0.3,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                    />
                  </motion.div>

                  {i < NODES.length - 1 && (
                    <motion.div
                      className="w-6 h-1 rounded-full shrink-0 mx-0.5"
                      style={{ background: MAGIC_GRADIENT }}
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: node.delay + 0.25,
                        ease: "easeOut",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Scanning bar */}
        <motion.div
          className="w-64 h-0.5 rounded-full mb-8 overflow-hidden"
          style={{ background: "rgba(124, 58, 237, 0.1)" }}
        >
          <motion.div
            className="h-full w-1/3 rounded-full"
            style={{ background: MAGIC_GRADIENT }}
            animate={{ x: ["-100%", "400%"] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="text-xl font-bold text-swap-text mb-2"
        >
          {t("swapping:magicChain.discovering")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="text-swap-text2 text-sm"
        >
          {t("swapping:magicChain.discoveringHint")}
        </motion.p>
      </motion.div>
    </div>
  );
}
