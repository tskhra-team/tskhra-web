import { Grid, Search } from "lucide-react";
import { motion } from "motion/react";

export function HeroSearch() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="mt-10 p-2 rounded-full backdrop-blur-xl bg-white/80 border-2 shadow-2xl flex flex-col md:flex-row items-center gap-2 max-w-3xl"
      style={{ borderColor: "var(--swap-secondary)" }}
    >
      <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full border-b md:border-b-0 md:border-r border-gray-200">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="What do you want?"
          className="w-full bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 font-medium text-lg"
          style={{ fontFamily: "'Work Sans', sans-serif" }}
        />
      </div>

      <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full border-b md:border-b-0 md:border-r border-gray-200 hidden sm:flex">
        <Grid className="w-5 h-5 text-gray-400" />
        <select
          className="w-full bg-transparent border-none outline-none text-gray-600 font-medium text-lg appearance-none cursor-pointer"
          style={{ fontFamily: "'Work Sans', sans-serif" }}
          defaultValue=""
        >
          <option value="" disabled>
            Category
          </option>
          <option value="fashion">Fashion</option>
          <option value="electronics">Electronics</option>
          <option value="home">Home & Garden</option>
          <option value="art">Art & Crafts</option>
          <option value="sports">Sports</option>
        </select>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full md:w-auto px-8 py-4 rounded-full text-white font-medium flex items-center justify-center gap-2"
        style={{
          background: "var(--swap-primary)",
          fontFamily: "'Work Sans', sans-serif",
          fontSize: "1.125rem",
        }}
      >
        Find Swaps
      </motion.button>
    </motion.div>
  );
}
