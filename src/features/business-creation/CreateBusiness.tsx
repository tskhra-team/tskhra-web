import { Button } from "@/components/ui/button";
import CreateBookingBusiness from "@/features/business-creation/booking-business/CreateBookingBusiness";
import { scrollToTop } from "@/utils";
import { Calendar, ShoppingCart } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CreateBusiness() {
  const { t } = useTranslation("common");
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedType = searchParams.get("business");

  if (selectedType === "ecommerce" || selectedType === "booking") {
    return (
      <div className="container mx-auto py-8 px-4">
        {selectedType === "ecommerce" ? (
          <>
            <div>{t("businessTypeSelection.ecommerce.comingSoonMessage")}</div>
          </>
        ) : (
          <>
            <CreateBookingBusiness />
          </>
        )}
      </div>
    );
  }

  const handleClick = (type: string) => {
    setSearchParams({ business: type });
    scrollToTop();
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("businessTypeSelection.title")}
          </h1>
          <p className="text-lg text-gray-600">
            {t("businessTypeSelection.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Booking Business Card */}
          <div className="relative bg-white rounded-xl border border-slate-300 shadow-sm">
            <div className="p-10">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-[#FF6439] rounded-lg flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 text-center mb-3">
                {t("businessTypeSelection.booking.title")}
              </h2>
              <p className="text-slate-600 text-center mb-8 leading-relaxed text-sm">
                {t("businessTypeSelection.booking.description")}
              </p>
              <ul className="space-y-3 mb-10">
                <li className="flex items-start">
                  <span className="text-slate-500 mr-3 text-base">✓</span>
                  <span className="text-slate-700 text-sm">
                    {t("businessTypeSelection.booking.feature1")}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-500 mr-3 text-base">✓</span>
                  <span className="text-slate-700 text-sm">
                    {t("businessTypeSelection.booking.feature2")}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-500 mr-3 text-base">✓</span>
                  <span className="text-slate-700 text-sm">
                    {t("businessTypeSelection.booking.feature3")}
                  </span>
                </li>
              </ul>
              <Button
                onClick={() => handleClick("booking")}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium h-11 cursor-pointer"
              >
                {t("businessTypeSelection.getStarted")}
              </Button>
            </div>
          </div>

          <div className="relative bg-gray-100 rounded-xl border border-gray-300 shadow-sm opacity-60">
            <div className="absolute top-4 right-4 bg-slate-500 text-white px-4 py-1.5 rounded-full text-sm font-medium">
              {t("businessTypeSelection.comingSoon")}
            </div>
            <div className="p-10">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 text-gray-500" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-600 text-center mb-3">
                {t("businessTypeSelection.ecommerce.title")}
              </h2>
              <p className="text-gray-500 text-center mb-8 leading-relaxed text-sm">
                {t("businessTypeSelection.ecommerce.description")}
              </p>
              <ul className="space-y-3 mb-10">
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3 text-base">✓</span>
                  <span className="text-gray-500 text-sm">
                    {t("businessTypeSelection.ecommerce.feature1")}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3 text-base">✓</span>
                  <span className="text-gray-500 text-sm">
                    {t("businessTypeSelection.ecommerce.feature2")}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3 text-base">✓</span>
                  <span className="text-gray-500 text-sm">
                    {t("businessTypeSelection.ecommerce.feature3")}
                  </span>
                </li>
              </ul>
              <Button
                disabled
                className="w-full bg-gray-400 text-white font-medium h-11 cursor-not-allowed"
              >
                {t("businessTypeSelection.getStarted")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
