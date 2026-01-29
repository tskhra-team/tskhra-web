import { Globe, RefreshCw, Users } from "lucide-react";

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
  return (
    <section className="py-24 px-14 bg-linear-to-br from-slate-50 via-red-50/20 to-slate-100 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-red-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-red-100 text-red-700 text-sm font-semibold uppercase tracking-wider mb-4">
            Swapping Platform
          </div>
          <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Trade Smarter, Live Better
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Join the revolution of sustainable exchange and discover endless
            possibilities
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="flex justify-between gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group w-full relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-slate-200/50 hover:border-red-300/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            >
              {/* Icon Container */}
              <div className="mb-6 relative">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <benefit.icon
                    className="w-8 h-8 text-white"
                    strokeWidth={2.5}
                  />
                </div>
                <div className="absolute inset-0 bg-red-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 border-2 border-slate-200/50 shadow-xl">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Popular Swap Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-slate-200 transition-all duration-300 hover:shadow-lg cursor-pointer"
              >
                <div
                  className={`w-12 h-12 bg-linear-to-br ${category.color} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}
                />
                <h4 className="text-lg font-bold text-slate-900 mb-1">
                  {category.name}
                </h4>
                <p className="text-sm text-slate-500 font-medium">
                  {category.count} active swaps
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="group/btn px-10 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <span className="relative z-10 flex items-center gap-2">
              Start Your First Swap
              <RefreshCw className="w-5 h-5 group-hover/btn:rotate-180 transition-transform duration-500" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
