import { Button } from "@/components/ui/button";
import { Globe, RefreshCw, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const benefits = [
  {
    icon: RefreshCw,
    title: "Smart Matching",
    description: "AI-powered algorithm finds perfect swap partners for you",
  },
  {
    icon: Users,
    title: "Verified Community",
    description: "Connect with trusted members through our rating system",
  },
  {
    icon: Globe,
    title: "Diversity",
    description: "Access thousands of swap opportunities",
  },
];

const categories = [
  { name: "Books", count: "12.5K", color: "from-amber-500 to-orange-500" },
  { name: "Electronics", count: "8.2K", color: "from-blue-500 to-indigo-500" },
  { name: "Furniture", count: "5.8K", color: "from-green-500 to-emerald-500" },
  { name: "Services", count: "15.3K", color: "from-purple-500 to-pink-500" },
];

export default function SwapSection() {
  const navigate = useNavigate();

  return (
    <section
      id="swap-section"
      className="py-12 sm:py-16 lg:py-24 px-4 sm:px-8 lg:px-14 bg-linear-to-br from-slate-50 via-red-50/20 to-slate-100 relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-red-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-red-100 text-red-700 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3 sm:mb-4">
            Swapping Platform
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-3 sm:mb-4 tracking-tight px-4">
            Trade Smarter, Live Better
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto px-4">
            Join the revolution of sustainable exchange and discover endless
            possibilities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group relative bg-white/90 backdrop-blur-sm rounded-xl lg:rounded-2xl p-6 sm:p-8 border-2 border-slate-200/50 hover:border-red-300/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            >
              <div className="mb-4 sm:mb-6 relative">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-br from-red-600 to-red-700 rounded-xl lg:rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <benefit.icon
                    className="w-7 h-7 sm:w-8 sm:h-8 text-white"
                    strokeWidth={2.5}
                  />
                </div>
                <div className="absolute inset-0 bg-red-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-slate-200/50 shadow-xl">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 sm:mb-8 text-center">
            Popular Swap Categories
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-xl lg:rounded-2xl p-5 sm:p-6 border-2 border-slate-100 hover:border-slate-200 transition-all duration-300 hover:shadow-lg cursor-pointer"
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br ${category.color} rounded-lg sm:rounded-xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}
                />
                <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                  {category.name}
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {category.count} active swaps
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <Button
            onClick={() => navigate("swapping")}
            className="group/btn px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm sm:text-base font-bold rounded-xl lg:rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Your First Swap
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:rotate-180 transition-transform duration-500" />
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}
