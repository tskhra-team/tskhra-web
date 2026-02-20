import { Button } from "@/components/ui/button";
import VerifyDialog from "@/features/profile/VerifyDialog";
import type { ProfileType } from "@/types";
import {
  AtSign,
  Calendar,
  CalendarClock,
  CheckCircle2,
  Plus,
  ShieldCheck,
  ShoppingBag,
  User,
  UserCircle,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type InfoTabType = {
  profile: ProfileType | undefined;
  isFullnameExist: string | undefined;
  fullName: string | undefined;
  verificationStatus: boolean | undefined;
};

export default function InfoTab({
  profile,
  isFullnameExist,
  fullName,
  verificationStatus,
}: InfoTabType) {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { t } = useTranslation("profile");

  return (
    <div className="bg-linear-to-br from-gray-50 to-blue-50/30 px-4 md:px-6 py-8 rounded-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Username Card */}
        <div className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-shadow duration-200">
          <div className="p-3 bg-linear-to-br from-blue-600 to-blue-700 rounded-xl shadow-md">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
              {t("infoTab.username")}
            </p>
            <p className="font-semibold text-gray-900 text-lg wrap-break-word">
              {profile?.userName}
            </p>
          </div>
        </div>

        {/* Email Card */}
        <div className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-shadow duration-200">
          <div className="p-3 bg-linear-to-br from-indigo-600 to-indigo-700 rounded-xl shadow-md">
            <AtSign className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
              {t("infoTab.email")}
            </p>
            <p className="font-semibold text-gray-900 text-lg wrap-break-word">
              {profile?.userEmail}
            </p>
          </div>
        </div>

        {/* Full Name Card */}
        {isFullnameExist && (
          <div className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-shadow duration-200">
            <div className="p-3 bg-linear-to-br from-cyan-600 to-cyan-700 rounded-xl shadow-md">
              <UserCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
                {t("infoTab.fullName")}
              </p>
              <p className="font-semibold text-gray-900 text-lg wrap-break-word">
                {fullName}
              </p>
            </div>
          </div>
        )}

        {/* Account Created Card */}
        <div className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-shadow duration-200">
          <div className="p-3 bg-linear-to-br from-orange-600 to-orange-700 rounded-xl shadow-md">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
              {t("infoTab.accountCreated")}
            </p>
            <p className="font-semibold text-gray-900 text-lg">
              {profile?.createDate}
            </p>
          </div>
        </div>

        {/* Status Card */}
        <div className="flex flex-col md:items-center md:justify-between xl:flex-row  gap-4 p-5 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-shadow duration-200 md:col-span-2">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl shadow-md ${
                verificationStatus
                  ? "bg-linear-to-br from-emerald-600 to-emerald-700"
                  : "bg-linear-to-br from-red-500 to-red-600"
              }`}
            >
              {verificationStatus ? (
                <CheckCircle2 className="w-5 h-5 text-white" />
              ) : (
                <XCircle className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
                {t("infoTab.accountStatus")}
              </p>
              <div className="flex items-center gap-2">
                <p
                  className={`font-semibold text-lg ${
                    verificationStatus ? "text-emerald-700" : "text-red-600"
                  }`}
                >
                  {verificationStatus
                    ? t("infoTab.verified")
                    : t("infoTab.notVerified")}
                </p>
              </div>
            </div>
          </div>

          {!verificationStatus && (
            <Button
              className=" cursor-pointer text-md bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 gap-4 p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-0 group rounded-4xl"
              onClick={() => navigate("/verification")}
            >
              <div className="p-2 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="font-semibold text-white">
                {t("infoTab.goToVerification")}
              </span>
            </Button>
          )}
        </div>
      </div>

      {/* Service Provider CTA Cards */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Booking Services Card */}
        <div className="flex-1 bg-linear-to-br from-orange-400 via-orange-500 to-orange-600 p-6 md:p-8 rounded-3xl">
          <div className="flex flex-col items-start justify-between h-50">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-8 h-8 text-white" />
              <h3 className="text-xl md:text-2xl font-bold text-white">
                {t("infoTab.becomeBookingProvider.title")}
              </h3>
            </div>
            <p className="text-orange-50 text-sm md:text-base leading-relaxed">
              {t("infoTab.becomeBookingProvider.description")}
            </p>
            <Button
              onClick={() => {
                if (!verificationStatus) {
                  setIsDialogOpen(true);
                } else {
                  navigate("/create-service");
                }
              }}
              className="flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-semibold px-6 py-3 rounded-xl"
            >
              <Plus className="w-5 h-5" />
              {t("infoTab.becomeBookingProvider.button")}
            </Button>
          </div>
        </div>

        {/* E-commerce Services Card */}
        <div className="flex-1 bg-linear-to-br from-blue-400 via-blue-500 to-blue-600 p-6 md:p-8 rounded-3xl">
          <div className="flex flex-col items-start justify-between h-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-8 h-8 text-white" />
              <h3 className="text-xl md:text-2xl font-bold text-white">
                {t("infoTab.becomeProductProvider.title")}
              </h3>
            </div>
            <p className="text-blue-50 text-sm md:text-base leading-relaxed">
              {t("infoTab.becomeProductProvider.description")}
            </p>
            <Button
              onClick={() => {
                if (!verificationStatus) {
                  setIsDialogOpen(true);
                } else {
                  navigate("/create-product");
                }
              }}
              className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold px-6 py-3 rounded-xl"
            >
              <Plus className="w-5 h-5" />
              {t("infoTab.becomeProductProvider.button")}
            </Button>
          </div>
        </div>
      </div>

      <VerifyDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
