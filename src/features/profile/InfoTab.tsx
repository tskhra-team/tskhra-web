import { Button } from "@/components/ui/button";
import VerifyDialog from "@/features/profile/VerifyDialog";
import type { ProfileType } from "@/types";
import { scrollToTop } from "@/utils";
import {
  AtSign,
  Building2,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
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
                  : "bg-linear-to-br from-red-700 to-red-800"
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
                    verificationStatus ? "text-emerald-700" : "text-red-700"
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
              className=" cursor-pointer text-md bg-linear-to-r from-green-700 to-emerald-800 hover:from-green-800 hover:to-emerald-800 gap-4 p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-0 group rounded-4xl"
              onClick={() => {
                scrollToTop();
                navigate("/verification");
              }}
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

      <Button
        type="button"
        className="relative w-full overflow-hidden cursor-pointer p-10 text-lg font-bold bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl text-white shadow-2xl hover:shadow-blue-500/50 transition-all duration-500 hover:scale-[1.02] group border-2 border-blue-400/30"
        onClick={() => {
          if (!verificationStatus) {
            setIsDialogOpen(true);
          } else {
            scrollToTop();
            navigate("/create-business");
          }
        }}
      >
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

        {/* Content */}
        <div className="relative flex items-center justify-center gap-4">
          <div className="p-3 bg-white/20 rounded-2xl group-hover:bg-white/30 transition-all duration-300 group-hover:rotate-12">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <span className="font-bold text-white tracking-wide">
            {t("infoTab.addBusinessButton")}
          </span>
          <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
        </div>
      </Button>

      <VerifyDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
