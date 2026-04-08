import { Button } from "@/components/ui/button";
import { Heart, Target, TrendingUp, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const statKeys = [
  { number: "+-20", key: "activeUsers" },
  { number: "0", key: "transactions" },
  { number: "1", key: "countries" },
  { number: "10/5", key: "userRating" },
];

const valueKeys = [
  { icon: Target, key: "mission", color: "from-blue-500 to-indigo-600" },
  { icon: Heart, key: "community", color: "from-pink-500 to-rose-600" },
  { icon: Zap, key: "innovation", color: "from-yellow-500 to-orange-600" },
  { icon: TrendingUp, key: "growth", color: "from-green-500 to-emerald-600" },
];

export default function AboutUs() {
  const navigate = useNavigate();
  const { t } = useTranslation("home");

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
            {t("aboutUs.badge")}
          </div>
          <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
            {t("aboutUs.title")}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {t("aboutUs.description")}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {statKeys.map((stat, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-100/50 hover:border-purple-300/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 text-center"
            >
              <div className="text-4xl font-black bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-slate-600 font-semibold">
                {t(`aboutUs.stats.${stat.key}`)}
              </div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {valueKeys.map((value, index) => (
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
                {t(`aboutUs.values.${value.key}.title`)}
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                {t(`aboutUs.values.${value.key}.description`)}
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
              {t("aboutUs.cta.title")}
            </h3>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-purple-100">
              {t("aboutUs.cta.description")}
            </p>
            <Button
              onClick={() => navigate("/register")}
              className="px-10 py-4 bg-white text-purple-600 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              {t("aboutUs.cta.button")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
