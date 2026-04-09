import { Search, ShoppingCart, PackageCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

const STEPS = [
  { key: "browse", icon: Search },
  { key: "order", icon: ShoppingCart },
  { key: "receive", icon: PackageCheck },
];

export default function HowItWorks() {
  const { t } = useTranslation("ecommerce");

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-14 bg-[#f8f8fa]">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#0f0f2d] text-white text-xs font-semibold uppercase tracking-wider mb-3">
            {t("howItWorks.badge")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0f0f2d] tracking-tight">
            {t("howItWorks.title")}
          </h2>
          <p className="text-[#0f0f2d]/50 mt-2 max-w-md mx-auto text-sm">
            {t("howItWorks.description")}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-[#0f0f2d]/10" />

          {STEPS.map((step, index) => (
            <div key={step.key} className="relative text-center">
              {/* Icon */}
              <div className="relative inline-flex mb-5">
                <div className="w-20 h-20 rounded-full bg-[#0f0f2d] flex items-center justify-center">
                  <step.icon
                    className="w-8 h-8 text-white"
                    strokeWidth={1.5}
                  />
                </div>
                <span className="absolute -top-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center text-xs font-bold text-[#0f0f2d] border border-[#0f0f2d]/10">
                  {index + 1}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#0f0f2d] mb-1.5">
                {t(`howItWorks.steps.${step.key}.title`)}
              </h3>
              <p className="text-[#0f0f2d]/50 text-sm leading-relaxed max-w-65 mx-auto">
                {t(`howItWorks.steps.${step.key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
