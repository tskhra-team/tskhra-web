import { Button } from "@/components/ui/button";
import {
  Briefcase,
  CalendarClock,
  ClipboardList,
  ImagePlus,
  Bell,
  Settings,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const featureKeys = [
  { icon: Briefcase, key: "createBusiness" },
  { icon: ClipboardList, key: "manageServices" },
  { icon: CalendarClock, key: "workSchedule" },
  { icon: ImagePlus, key: "photoGallery" },
  { icon: Bell, key: "bookingNotifications" },
  { icon: Settings, key: "fullControl" },
];

export default function ProviderSection() {
  const navigate = useNavigate();
  const { t } = useTranslation("home");

  return (
    <section
      id="provider-section"
      className="py-12 sm:py-16 lg:py-24 px-4 sm:px-8 lg:px-14 bg-linear-to-br from-emerald-50/50 via-white to-teal-50/30 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-400/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-emerald-100 text-emerald-600 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3 sm:mb-4">
            {t("providerSection.badge")}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-3 sm:mb-4 tracking-tight px-4">
            {t("providerSection.title")}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto px-4">
            {t("providerSection.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featureKeys.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-2 border-emerald-100/50 hover:border-emerald-300/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            >
              <div className="mb-5 relative">
                <div className="w-14 h-14 bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <feature.icon
                    className="w-7 h-7 text-white"
                    strokeWidth={2.5}
                  />
                </div>
                <div className="absolute inset-0 bg-emerald-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                {t(`providerSection.features.${feature.key}.title`)}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {t(`providerSection.features.${feature.key}.description`)}
              </p>

              <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={() => navigate("/create-business")}
            className="group/btn px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm sm:text-base font-bold rounded-xl lg:rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t("providerSection.button")}
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform duration-300"
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
