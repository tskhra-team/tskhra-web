import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Calendar,
    title: "Instant Booking",
    description: "Reserve your spot in seconds with real-time availability",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description: "Choose the perfect time that fits your busy schedule",
  },
  {
    icon: Star,
    title: "Top-Rated Services",
    description: "Access verified providers with excellent reviews",
  },
  {
    icon: MapPin,
    title: "Neart to you",
    description: "Discover experiences near you",
  },
];

const categories = [
  {
    name: "Restaurants",
    description: "Fine dining & casual spots",
    icon: "🍽️",
    color: "from-orange-500 to-red-500",
  },
  {
    name: "Wellness",
    description: "Spa & health services",
    icon: "💆",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Events",
    description: "Concerts, shows & classes",
    icon: "🎭",
    color: "from-purple-500 to-pink-500",
  },
];

export default function BookSection() {
  const navigate = useNavigate();

  return (
    <section
      id="book-section"
      className="py-24 px-14 bg-linear-to-br from-orange-50/50 via-white to-orange-50/30 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-400/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold uppercase tracking-wider mb-4">
            Booking Platform
          </div>
          <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Book Amazing Experiences
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Reserve unforgettable moments with ease—from dining to adventures,
            all in one place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-orange-100/50 hover:border-orange-300/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            >
              <div className="mb-6 relative">
                <div className="w-16 h-16 bg-linear-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <feature.icon
                    className="w-8 h-8 text-white"
                    strokeWidth={2.5}
                  />
                </div>
                <div className="absolute inset-0 bg-orange-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>

              <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 to-red-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 border-2 border-orange-100/50 shadow-xl mb-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Popular Booking Categories
          </h3>
          <div className="flex justify-between gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group w-full relative bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-orange-200 transition-all duration-300 hover:shadow-lg cursor-pointer overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-linear-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                <div className="relative z-10">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">
                    {category.name}
                  </h4>
                  <p className="text-sm text-slate-500 font-medium">
                    {category.description}
                  </p>
                </div>

                <div
                  className={`absolute -top-10 -right-10 w-20 h-20 bg-linear-to-br ${category.color} rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={() => navigate("booking")}
            className="group/btn px-10 py-4 bg-linear-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Browse All Experiences
              <svg
                className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}
