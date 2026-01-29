import { Button } from "@/components/ui/button";
import { Heart, Target, TrendingUp, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const stats = [
  { number: "+-20", label: "Active Users" },
  { number: "0", label: "Transactions" },
  { number: "1", label: "Countries" },
  { number: "10/5", label: "User Rating" },
];

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To create a unified platform where buying, booking, and swapping converge seamlessly, empowering people to make smarter choices.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Heart,
    title: "Community First",
    description:
      "We believe in building meaningful connections and fostering trust between users through transparency and verified interactions.",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: Zap,
    title: "Innovation",
    description:
      "Leveraging cutting-edge technology to provide intuitive experiences that make every transaction effortless and secure.",
    color: "from-yellow-500 to-orange-600",
  },
  {
    icon: TrendingUp,
    title: "Growth & Opportunity",
    description:
      "Empowering users to unlock new possibilities and maximize value through flexible trading, smart deals, and endless opportunities.",
    color: "from-green-500 to-emerald-600",
  },
];

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <section
      id="about-us"
      className="py-24 px-14 bg-linear-to-br from-slate-50 via-purple-50/20 to-slate-50 relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold uppercase tracking-wider mb-4">
            About Us
          </div>
          <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Redefining How You Exchange Value
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to revolutionize the way people buy, book, and
            swap. Our platform brings together commerce, services, and community
            in one seamless ecosystem.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-100/50 hover:border-purple-300/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 text-center"
            >
              <div className="text-4xl font-black bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-slate-600 font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-10 border-2 border-slate-200/50 hover:border-purple-300/50 transition-all duration-300 hover:shadow-2xl"
            >
              {/* Icon */}
              <div className="mb-6 relative inline-block">
                <div
                  className={`w-16 h-16 bg-linear-to-br ${value.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <value.icon
                    className="w-8 h-8 text-white"
                    strokeWidth={2.5}
                  />
                </div>
                <div
                  className={`absolute inset-0 bg-linear-to-br ${value.color} opacity-20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300`}
                />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-black text-slate-900 mb-4">
                {value.title}
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                {value.description}
              </p>

              {/* Gradient Overlay on Hover */}
              <div
                className={`absolute inset-0 bg-linear-to-br ${value.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300 pointer-events-none`}
              />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-linear-to-r from-purple-600 to-indigo-600 rounded-3xl p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
          <div className="relative z-10">
            <h3 className="text-3xl font-black mb-4">
              Join Our Growing Community
            </h3>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-purple-100">
              Be part of the future of commerce. Start buying, booking, and
              swapping today.
            </p>
            <Button
              onClick={() => navigate("/register")}
              className="px-10 py-4 bg-white text-purple-600 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
