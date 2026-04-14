import {
  Book,
  Camera,
  Car,
  Check,
  Coffee,
  Gamepad2,
  Headphones,
  Laptop,
  Music,
  Pen,
  Wand2,
  Watch,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Fragment, useEffect, useRef, useState } from "react";

/* ─── Basic Swap data ─── */
const items = [
  { icon: Camera, name: "Vintage Camera", color: "#a31621", user: "Sarah M." },
  { icon: Book, name: "Design Books", color: "#c7522a", user: "Mike R." },
  { icon: Gamepad2, name: "Gaming Console", color: "#e5c185", user: "Alex K." },
  { icon: Music, name: "Guitar Lessons", color: "#74a892", user: "Jamie L." },
  { icon: Coffee, name: "Coffee Maker", color: "#8b7e74", user: "Chris P." },
  { icon: Watch, name: "Smart Watch", color: "#a31621", user: "Taylor W." },
];

/* ─── Magic Swap chain data ─── */
const chainMiddle = [
  { icon: Book, name: "Book", color: "#c7522a" },
  { icon: Headphones, name: "Headphones", color: "#74a892" },
  { icon: Camera, name: "Camera", color: "#a31621" },
  { icon: Laptop, name: "Laptop", color: "#4a6fa5" },
];

const startItem = { icon: Pen, name: "Pen", color: "#8b7e74" };
const endItem = { icon: Car, name: "Car", color: "#e5c185" };

export function SwapCards() {
  const [currentPair, setCurrentPair] = useState([0, 1]);
  const [isSwapping, setIsSwapping] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSwapping(true);
      setTimeout(() => {
        setCurrentPair((prev) => {
          const next = (prev[1] + 1) % items.length;
          const nextNext = (next + 1) % items.length;
          return [next, nextNext];
        });
        setIsSwapping(false);
      }, 600);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const leftItem = items[currentPair[0]];
  const rightItem = items[currentPair[1]];

  return (
    <div className="relative h-125 w-full flex items-center justify-center">
      {/* Connecting Line */}
      <motion.div
        className="absolute top-1/2 left-1/2 h-1 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "var(--swap-primary)" }}
        animate={{
          width: isSwapping ? "60%" : "40%",
          opacity: isSwapping ? 0.3 : 0.1,
        }}
        transition={{ duration: 0.6 }}
      />

      {/* Left Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`left-${currentPair[0]}`}
          initial={{ x: isSwapping ? 200 : -100, opacity: 0, rotate: 15 }}
          animate={{ x: -120, opacity: 1, rotate: -6 }}
          exit={{ x: -50, opacity: 0, rotate: -20 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="absolute p-6 rounded-3xl shadow-2xl backdrop-blur-md bg-white/90 border-2 cursor-pointer"
          style={{ borderColor: leftItem.color }}
          whileHover={{
            scale: 1.05,
            rotate: -8,
            transition: { duration: 0.2 },
          }}
        >
          <div
            className="w-10 h-10 md:w-40 md:h-40 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
            style={{ background: leftItem.color }}
          >
            <leftItem.icon className="w-10 h-10 text-white" />
          </div>
          <h3
            className="mb-2"
            style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: "1.25rem",
              color: "var(--swap-text)",
            }}
          >
            {leftItem.name}
          </h3>
          <p style={{ color: "var(--swap-text2)", fontSize: "0.875rem" }}>
            Offered by {leftItem.user}
          </p>
          <motion.div
            className="mt-4 px-4 py-2 rounded-full text-white text-center"
            style={{ background: leftItem.color, fontSize: "0.875rem" }}
            whileHover={{ scale: 1.05 }}
          >
            View Offer
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Swap Icon */}
      <motion.div
        className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-2xl"
        style={{ background: "var(--swap-primary)" }}
        animate={{
          rotate: isSwapping ? 180 : 0,
          scale: isSwapping ? 1.2 : 1,
        }}
        transition={{ duration: 0.6 }}
      >
        <motion.svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 16V4M7 4L3 8M7 4l4 4" />
          <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
        </motion.svg>
      </motion.div>

      {/* Right Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`right-${currentPair[1]}`}
          initial={{ x: isSwapping ? -200 : 100, opacity: 0, rotate: -15 }}
          animate={{ x: 120, opacity: 1, rotate: 6 }}
          exit={{ x: 50, opacity: 0, rotate: 20 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="absolute p-6 rounded-3xl shadow-2xl backdrop-blur-md bg-white/90 border-2 cursor-pointer"
          style={{ borderColor: rightItem.color }}
          whileHover={{
            scale: 1.05,
            rotate: 8,
            transition: { duration: 0.2 },
          }}
        >
          <div
            className="w-10 h-10 md:w-40 md:h-40 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
            style={{ background: rightItem.color }}
          >
            <rightItem.icon className="w-10 h-10 text-white" />
          </div>
          <h3
            className="mb-2"
            style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: "1.25rem",
              color: "var(--swap-text)",
            }}
          >
            {rightItem.name}
          </h3>
          <p style={{ color: "var(--swap-text2)", fontSize: "0.875rem" }}>
            Offered by {rightItem.user}
          </p>
          <motion.div
            className="mt-4 px-4 py-2 rounded-full text-white text-center"
            style={{ background: rightItem.color, fontSize: "0.875rem" }}
            whileHover={{ scale: 1.05 }}
          >
            View Offer
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MagicSwap — chain discovery animation
   ═══════════════════════════════════════════ */
type MagicPhase = "idle" | "casting" | "building" | "complete";

export function MagicSwap() {
  const [phase, setPhase] = useState<MagicPhase>("idle");
  const [buildStep, setBuildStep] = useState(-1);
  const autoPlayedRef = useRef(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const later = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timeoutsRef.current.push(t);
  };

  const startMagic = () => {
    if (phase !== "idle") return;

    // Casting phase — wand animates
    setPhase("casting");

    later(() => {
      // Building phase — chain items appear one by one
      setPhase("building");
      setBuildStep(-1);

      let step = 0;
      const buildNext = () => {
        setBuildStep(step);
        step++;
        if (step < chainMiddle.length) {
          later(buildNext, 700);
        } else {
          later(() => {
            setPhase("complete");
            later(() => {
              setPhase("idle");
              setBuildStep(-1);
            }, 5000);
          }, 900);
        }
      };
      later(buildNext, 400);
    }, 900);
  };

  // Auto-play first time
  useEffect(() => {
    if (autoPlayedRef.current) return;
    autoPlayedRef.current = true;
    later(() => startMagic(), 2000);
    return clearAllTimeouts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showChain = phase === "building" || phase === "complete";

  const topText = {
    idle: {
      title: "From Pen to Car?",
      sub: "Tap the wand to discover the chain",
    },
    casting: { title: "Searching...", sub: "Looking for the best swap path" },
    building: {
      title: "Building your chain...",
      sub: "Connecting traders along the way",
    },
    complete: {
      title: "Chain Complete!",
      sub: "Our algorithm finds the shortest path for you",
    },
  };

  return (
    <div className="relative h-125 w-full flex flex-col items-center justify-center overflow-hidden gap-6">
      {/* ─── Top text ─── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          className="text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
        >
          <h3
            style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: "1.5rem",
              color:
                phase === "complete"
                  ? "var(--swap-primary)"
                  : "var(--swap-text)",
            }}
          >
            {topText[phase].title}
          </h3>
          {topText[phase].sub && (
            <p
              className="mt-1"
              style={{ color: "var(--swap-text2)", fontSize: "0.9rem" }}
            >
              {topText[phase].sub}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center">
        {/* ─── Pen (start) ─── */}
        <motion.div
          className="flex flex-col items-center gap-2 shrink-0"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
        >
          <motion.div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-lg"
            style={{
              background: startItem.color,
              border: `3px solid ${startItem.color}`,
            }}
            animate={{
              boxShadow:
                showChain || phase === "casting"
                  ? `0 0 20px ${startItem.color}50`
                  : "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            <Pen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </motion.div>
          <span
            className="text-xs sm:text-sm font-semibold"
            style={{ color: startItem.color }}
          >
            {startItem.name}
          </span>
        </motion.div>

        {/* ─── Middle area (fixed width to prevent layout shift) ─── */}
        <div className="relative flex items-center justify-center mx-1 sm:mx-2 min-w-70 sm:min-w-85 h-20">
          {/* Idle: dashed line + magic button */}
          <AnimatePresence>
            {(phase === "idle" || phase === "casting") && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Left dashed line */}
                <motion.div
                  className="h-px flex-1 border-t-2 border-dashed mb-7"
                  style={{ borderColor: `${startItem.color}60` }}
                />

                {/* Magic button */}
                <motion.button
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-xl cursor-pointer mb-7 border-0 mx-3 shrink-0"
                  style={{ background: "var(--swap-primary)" }}
                  animate={
                    phase === "casting"
                      ? {
                          scale: [1, 1.3, 1.3, 0],
                          rotate: [0, 0, 360, 360],
                        }
                      : { scale: [1, 1.08, 1] }
                  }
                  transition={
                    phase === "casting"
                      ? { duration: 0.9, times: [0, 0.3, 0.7, 1] }
                      : { duration: 2, repeat: Infinity, repeatDelay: 1 }
                  }
                  whileHover={
                    phase === "idle"
                      ? {
                          scale: 1.12,
                          boxShadow: "0 0 30px rgba(163,22,33,0.4)",
                        }
                      : {}
                  }
                  whileTap={phase === "idle" ? { scale: 0.9 } : {}}
                  onClick={startMagic}
                >
                  <Wand2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </motion.button>

                {/* Right dashed line */}
                <motion.div
                  className="h-px flex-1 border-t-2 border-dashed mb-7"
                  style={{ borderColor: `${endItem.color}60` }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Building/Complete: chain items */}
          <AnimatePresence>
            {showChain && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Connector from pen */}
                <motion.div
                  className="h-0.5 w-3 sm:w-4 rounded-full mb-5 shrink-0"
                  style={{ background: startItem.color }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />

                {chainMiddle.map((item, i) => (
                  <Fragment key={i}>
                    {/* Chain node */}
                    <motion.div
                      className="flex flex-col items-center gap-0.5 shrink-0"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: i <= buildStep ? 1 : 0,
                        opacity: i <= buildStep ? 1 : 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 15,
                      }}
                    >
                      <motion.div
                        className="w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-md"
                        style={{ background: item.color }}
                        animate={{
                          boxShadow:
                            i === buildStep && phase === "building"
                              ? [
                                  `0 0 0px ${item.color}00`,
                                  `0 0 20px ${item.color}70`,
                                  `0 0 8px ${item.color}30`,
                                ]
                              : `0 2px 8px rgba(0,0,0,0.15)`,
                        }}
                        transition={{
                          duration: 0.8,
                        }}
                      >
                        <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </motion.div>
                      <motion.span
                        className="text-[9px] sm:text-[11px] font-medium whitespace-nowrap"
                        style={{ color: item.color }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: i <= buildStep ? 1 : 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        {item.name}
                      </motion.span>
                    </motion.div>

                    {/* Connector arrow */}
                    <motion.div
                      className="flex items-center mb-4 shrink-0"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: i <= buildStep ? 1 : 0,
                      }}
                      transition={{ delay: 0.25, duration: 0.3 }}
                    >
                      <motion.div
                        className="h-0.5 rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${item.color}, ${
                            i < chainMiddle.length - 1
                              ? chainMiddle[i + 1].color
                              : endItem.color
                          })`,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: i <= buildStep ? 14 : 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      />
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: i <= buildStep ? 1 : 0 }}
                        transition={{ delay: 0.35 }}
                        style={{
                          width: 0,
                          height: 0,
                          borderTop: "3px solid transparent",
                          borderBottom: "3px solid transparent",
                          borderLeft: `5px solid ${
                            i < chainMiddle.length - 1
                              ? chainMiddle[i + 1].color
                              : endItem.color
                          }`,
                        }}
                      />
                    </motion.div>
                  </Fragment>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── Car (end) ─── */}
        <motion.div
          className="flex flex-col items-center gap-2 shrink-0 relative"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 120 }}
        >
          <motion.div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-lg relative"
            style={{
              border: `3px solid ${endItem.color}`,
            }}
            animate={{
              background:
                phase === "complete" ? endItem.color : "rgba(255,255,255,0.9)",
              boxShadow:
                phase === "complete"
                  ? `0 0 30px ${endItem.color}70`
                  : "0 4px 12px rgba(0,0,0,0.15)",
            }}
            transition={{ duration: 0.5 }}
          >
            <Car
              className="w-6 h-6 sm:w-7 sm:h-7"
              style={{
                color: phase === "complete" ? "white" : endItem.color,
              }}
            />

            {/* Checkmark badge */}
            <AnimatePresence>
              {phase === "complete" && (
                <motion.div
                  className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 12 }}
                >
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <span
            className="text-xs sm:text-sm font-semibold"
            style={{ color: endItem.color }}
          >
            {endItem.name}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
