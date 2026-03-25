import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useModal } from "@/context/ModalContext";
import { useAuth } from "@/context/useAuth";
import { cn } from "@/lib/utils";
import type { ProfileType } from "@/types";
import {
  Building2,
  Check,
  Heart,
  History,
  LayoutDashboard,
  LogOut,
  Shield,
  UserCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type ProfileSidebarProps = {
  currentSection: string;
  onSectionChange: (section: string) => void;
  profile: ProfileType | undefined;
};

export default function ProfileSidebar({
  currentSection,
  onSectionChange,
  profile,
}: ProfileSidebarProps) {
  const { t } = useTranslation(["profile", "common", "modal"]);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showModal } = useModal();

  const verificationStatus = profile?.status;
  const isFullnameExist = profile?.firstName && profile?.lastName;
  const fullName = isFullnameExist
    ? profile?.firstName + " " + profile?.lastName
    : profile?.userName;

  const navItems = [
    { value: "profile", label: t("tabs.profile"), icon: UserCircle },
    { value: "history", label: t("tabs.history"), icon: History },
    { value: "favorites", label: t("tabs.favorites"), icon: Heart },
    { value: "add-business", label: t("tabs.addBusiness"), icon: Building2 },
    { value: "security", label: t("tabs.security"), icon: Shield },
  ];

  const handleLogout = () => {
    navigate("/");
    logout();
  };

  return (
    <aside className="hidden lg:block fixed left-0 top-0 h-screen w-70 bg-white border-r border-slate-200 z-30 overflow-y-auto">
      <div className="p-6 pt-34.5 flex flex-col h-full">
        {/* Avatar Section */}

        <div className="mb-8 pb-6 border-b border-slate-200">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 border-2 border-indigo-200 ring-4 ring-indigo-50 mb-4">
              <AvatarImage src={profile?.avatar} alt={fullName} />
              <AvatarFallback className="text-3xl bg-linear-to-br from-indigo-50 to-indigo-100 text-indigo-700">
                {fullName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <h3 className="text-lg font-semibold text-slate-900 tracking-tight mb-1">
              {fullName}
            </h3>
            <p className="text-sm text-slate-500 mb-3">@{profile?.userName}</p>

            {/* Verification Badge */}
            {verificationStatus ? (
              <span className="inline-flex items-center gap-1 bg-linear-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1 text-xs rounded-full font-medium mb-4">
                <Check className="w-3 h-3" />
                {t("infoTab.verified")}
              </span>
            ) : (
              <Button
                variant="link"
                className="inline-flex items-center gap-1 text-slate-500 px-3 py-1 text-xs mb-4 cursor-pointer"
                onClick={() => navigate("/verification")}
              >
                {t("infoTab.goToVerification")}
              </Button>
            )}

            {/* Dashboard Button */}
            <Button
              variant="outline"
              onClick={() => {
                if (!profile?.status) {
                  showModal(
                    "error",
                    t("modal:titles.notVerified"),
                    t("modal:messages.goToDashboardError"),
                    t("modal:buttons.close"),
                    () => {},
                    t("modal:buttons.goToVerify"),
                    () => {
                      navigate("/verification");
                    },
                  );
                } else {
                  navigate("/my-businesses");
                }
              }}
              className="w-full hover:border-indigo-400 hover:text-indigo-700 transition-all"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              {t("common:auth.dashboard")}
            </Button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1 flex-1 mb-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.value}
                onClick={() => onSectionChange(item.value)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  currentSection === item.value
                    ? "bg-linear-to-r from-indigo-600 to-indigo-700 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-50 hover:text-indigo-700",
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="mt-auto pt-4 border-t border-slate-200">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">
              {t("common:auth.singOut")}
            </span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
