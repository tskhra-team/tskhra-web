import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
  MessageSquare,
  Package,
  Shield,
  Store,
  UserCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type ProfileMobileNavProps = {
  currentSection: string;
  onSectionChange: (section: string) => void;
  onClose: () => void;
  profile: ProfileType | undefined;
};

export default function ProfileMobileNav({
  currentSection,
  onSectionChange,
  onClose,
  profile,
}: ProfileMobileNavProps) {
  const { t } = useTranslation(["profile", "common"]);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const verificationStatus = profile?.status;
  const isFullnameExist = profile?.firstName && profile?.lastName;
  const fullName = isFullnameExist
    ? profile?.firstName + " " + profile?.lastName
    : profile?.userName;

  const navItems = [
    { value: "profile", label: t("tabs.profile"), icon: UserCircle },
    { value: "history", label: t("tabs.history"), icon: History },
    { value: "favorites", label: t("tabs.favorites"), icon: Heart },
    { value: "reviews", label: t("tabs.reviews"), icon: MessageSquare },
    { value: "add-business", label: t("tabs.addBusiness"), icon: Building2 },
    {
      value: "seller-profiles",
      label: t("tabs.sellerProfiles"),
      icon: Store,
    },
    {
      value: "my-products",
      label: t("tabs.myProducts"),
      icon: Package,
    },
    { value: "security", label: t("tabs.security"), icon: Shield },
  ];

  const handleLogout = () => {
    navigate("/");
    logout();
    onClose();
  };

  return (
    <nav className="space-y-2 p-4">
      {/* Mobile Avatar Section */}
      <div className="mb-6 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-16 w-16 border-2 border-indigo-200">
            <AvatarImage src={profile?.avatar} alt={fullName} />
            <AvatarFallback className="text-xl bg-linear-to-br from-indigo-50 to-indigo-100 text-indigo-700">
              {fullName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-slate-900 tracking-tight">
              {fullName}
            </h3>
            <p className="text-sm text-slate-500">@{profile?.userName}</p>
            {verificationStatus && (
              <span className="inline-flex items-center gap-1 bg-linear-to-r from-emerald-700 to-emerald-800 text-white px-2 py-0.5 text-xs rounded-full font-medium mt-1">
                <Check className="w-3 h-3" />
                {t("infoTab.verified")}
              </span>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => {
            navigate("/my-businesses");
            onClose();
          }}
          className="w-full hover:border-indigo-400 hover:text-indigo-700 transition-all cursor-pointer"
        >
          <LayoutDashboard className="w-4 h-4 mr-2" />
          {t("common:auth.dashboard")}
        </Button>
      </div>

      {/* Navigation Items */}
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.value}
            onClick={() => {
              onSectionChange(item.value);
              onClose();
            }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 min-h-12 cursor-pointer",
              currentSection === item.value
                ? "bg-linear-to-r from-indigo-600 to-indigo-700 text-white shadow-md"
                : "text-slate-600 active:bg-slate-50 active:text-indigo-700",
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        );
      })}

      {/* Logout Button */}
      <div className="pt-4 mt-4 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 active:bg-rose-50 active:text-rose-700 transition-all min-h-12 cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span> {t("common:auth.singOut")}</span>
        </button>
      </div>
    </nav>
  );
}
