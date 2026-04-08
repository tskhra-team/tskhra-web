import { Button } from "@/components/ui/button";
import { CreditCard, Shield, ShoppingBag, Truck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const featureKeys = [
  { icon: ShoppingBag, key: "curatedCollection" },
  { icon: Shield, key: "buyerProtection" },
  { icon: Truck, key: "fastDelivery" },
  { icon: CreditCard, key: "securePayments" },
];

export default function BuySection() {
  const navigate = useNavigate();
  const { t } = useTranslation("home");

  return (
    <section
      id="buy-section"
      className="py-24 px-14 bg-linear-to-br from-blue-50/50 via-white to-blue-50/30 relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold uppercase tracking-wider mb-4">
            {t("buySection.badge")}
          </div>
          <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">
            {t("buySection.title")}
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {t("buySection.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureKeys.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-blue-100/50 hover:border-blue-300/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            >
              <div className="mb-6 relative">
                <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <feature.icon
                    className="w-8 h-8 text-white"
                    strokeWidth={2.5}
                  />
                </div>
                <div className="absolute inset-0 bg-blue-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {t(`buySection.features.${feature.key}.title`)}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {t(`buySection.features.${feature.key}.description`)}
              </p>

              <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            onClick={() => navigate("ecommerce")}
            className="group/btn px-10 py-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t("buySection.button")}
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
