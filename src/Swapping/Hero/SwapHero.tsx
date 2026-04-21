import { MagicSwap, SwapCards } from "@/Swapping/Hero/SwapCards";
import { ArrowRight, ArrowRightLeft, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const tabs = [
  { id: "basic", label: "Basic Swap", icon: ArrowRightLeft },
  { id: "magic", label: "Magic Chain", icon: Sparkles },
] as const;

type TabId = (typeof tabs)[number]["id"];

const handleScroll = () => {
  const element = document.getElementById("target-section");

  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

export default function SwapHero() {
  const [activeTab, setActiveTab] = useState<TabId>("basic");

  return (
    // <section className="my-20 flex items-center justify-center">
    <div className="px-8 md:px-20 my-10 w-full">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: "clamp(3rem, 8vw, 6rem)",
                lineHeight: "1.1",
                color: "var(--swap-text)",
                marginBottom: "1.5rem",
              }}
            >
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="block"
              >
                Trade
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="block"
                style={{ color: "var(--swap-primary)" }}
              >
                Anything
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="block"
              >
                With Anyone
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mb-8 max-w-lg"
              style={{
                fontSize: "1.25rem",
                color: "var(--swap-text2)",
                lineHeight: "1.6",
              }}
            >
              The modern platform for trading goods, skills, and services. No
              money needed, just swap what you have for what you want.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="flex gap-4"
            >
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 40px var(--swap-shadow-primary-md)",
                }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full text-white flex items-center gap-2 shadow-lg"
                style={{
                  background: "var(--swap-primary)",
                  fontSize: "1.125rem",
                }}
                onClick={() => handleScroll()}
              >
                Start Swapping
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>

              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full border-2 hover:bg-white/50 transition-colors"
                style={{
                  borderColor: "var(--swap-text)",
                  color: "var(--swap-text)",
                  fontSize: "1.125rem",
                }}
              >
                Learn More
              </motion.button> */}
            </motion.div>
          </motion.div>
        </div>

        {/* Right - Tabs + Animated Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative"
        >
          {/* Tab switcher */}
          <div className="flex justify-center gap-2 mb-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border-0 cursor-pointer"
                style={{
                  background:
                    activeTab === tab.id
                      ? "var(--swap-primary)"
                      : "var(--swap-overlay-light)",
                  color: activeTab === tab.id ? "white" : "var(--swap-text2)",
                  boxShadow:
                    activeTab === tab.id
                      ? "0 4px 15px var(--swap-shadow-primary-sm)"
                      : "0 2px 8px var(--swap-shadow-soft)",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {activeTab === "basic" ? (
              <motion.div
                key="basic"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.3 }}
              >
                <SwapCards />
              </motion.div>
            ) : (
              <motion.div
                key="magic"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <MagicSwap />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
    // </section>
  );
}
