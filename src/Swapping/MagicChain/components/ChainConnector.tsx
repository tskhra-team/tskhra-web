import { MAGIC_GRADIENT } from "@/Swapping/MagicChain/types";
import { motion } from "motion/react";

export default function ChainConnector({ index }: { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.4, delay: (index ?? 0) * 0.08 + 0.04 }}
      className="flex items-center shrink-0 px-0.5 origin-left"
    >
      <div
        className="w-8 h-0.75 rounded-full"
        style={{ background: MAGIC_GRADIENT }}
      />
      <div
        className="w-0 h-0 -ml-0.5"
        style={{
          borderTop: "5px solid transparent",
          borderBottom: "5px solid transparent",
          borderLeft: "6px solid var(--swap-magic-end)",
        }}
      />
    </motion.div>
  );
}
