import { Button } from "@/components/ui/button";
import VerifyDialog from "@/features/profile/VerifyDialog";
import type { ProfileType } from "@/types";
import {
  AtSign,
  Calendar,
  CheckCircle2,
  Plus,
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
        <div className="flex items-center gap-4 p-5 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl hover:shadow-md transition-shadow duration-200">
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
        <div className="flex items-center gap-4 p-5 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl hover:shadow-md transition-shadow duration-200">
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
          <div className="flex items-center gap-4 p-5 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl hover:shadow-md transition-shadow duration-200">
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
        <div className="flex items-center gap-4 p-5 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl hover:shadow-md transition-shadow duration-200">
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
        <div className="flex items-center gap-4 p-5 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl hover:shadow-md transition-shadow duration-200 md:col-span-2">
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
              {verificationStatus && (
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200/50 shadow-sm">
                  {t("infoTab.active")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Service Provider CTA */}

      <div className="relative overflow-hidden bg-linear-to-br from-blue-600 via-blue-700 to-purple-700 p-6 md:p-8 rounded-3xl shadow-2xl shadow-blue-500/30">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
              <h3 className="text-xl md:text-2xl font-bold text-white">
                {t("infoTab.becomeProvider.title")}
              </h3>
            </div>
            <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-2xl">
              {t("infoTab.becomeProvider.description")}
            </p>
          </div>
          <Button
            onClick={() => {
              if (!verificationStatus) {
                setIsDialogOpen(true);
              } else {
                navigate("/create-service");
              }
            }}
            className="flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800 font-semibold px-6 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 whitespace-nowrap border-2 border-white/20"
          >
            <Plus className="w-5 h-5" />
            {t("infoTab.becomeProvider.button")}
          </Button>
        </div>
      </div>

      <VerifyDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
