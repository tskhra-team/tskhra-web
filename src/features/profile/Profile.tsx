import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HistoryTabSkeleton,
  InfoTabSkeleton,
  ProfileFormSkeleton,
} from "@/features/profile/LoadingSkeletons";
import useGetProfile from "@/features/profile/useGetProfile";
import { History, Settings, UserCircle } from "lucide-react";
import { lazy, memo, Suspense } from "react";
import Avatar from "react-avatar";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

// Lazy load tab components for better performance
const InfoTab = lazy(() => import("@/features/profile/InfoTab"));
const HistoryTab = lazy(() => import("@/features/profile/HistoryTab"));
const ProfileForm = lazy(() => import("@/features/profile/ProfileForm"));

// Memoize Avatar to prevent unnecessary re-renders
const MemoizedAvatar = memo(Avatar);

export default function Profile() {
  const { data: profile } = useGetProfile();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation("profile");
  // const { token } = useAuth();
  const tab = searchParams.get("section") || "info";
  const verificationStatus = profile?.status;
  const isFullnameExist = profile?.firstName && profile?.lastName;
  const fullName = isFullnameExist
    ? profile?.firstName + " " + profile?.lastName
    : profile?.userName;

  const tabs = [
    { value: "info", label: t("tabs.info"), icon: UserCircle },
    { value: "history", label: t("tabs.history"), icon: History },
    { value: "settings", label: t("tabs.settings"), icon: Settings },
  ];

  const tabNames = {
    history: t("tabs.history"),
    info: t("tabs.info"),
    paymentMethods: t("tabs.paymentMethods"),
    settings: t("tabs.settings"),
  };

  return (
    <main className="px-4 sm:px-8 md:px-12 lg:px-20 py-6 md:py-10 ">
      <div className="flex flex-col justify-between md:flex-row gap-4 md:gap-5 items-start md:items-center mb-6 md:mb-8">
        <div
          className={`flex gap-4 items-center transition-all duration-500 ease-in-out ${
            tab !== "settings"
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none absolute"
          }`}
        >
          <MemoizedAvatar
            name={fullName}
            size="60"
            round
            className="md:w-20! md:h-20!"
          />
          <div className="flex flex-col flex-1">
            <p className="text-xl md:text-2xl font-semibold">{fullName}</p>
            <p className="text-sm md:text-base text-gray-600">
              {t("profileHeader.status")}:{" "}
              {verificationStatus
                ? t("infoTab.verified")
                : t("infoTab.notVerified")}
            </p>
            <p className="text-xs md:text-sm text-gray-500">
              {profile?.userEmail}
            </p>
          </div>
        </div>
        <p
          className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold transition-all duration-500 ${
            tab === "settings" ? "md:ml-auto md:pl-0" : "md:pl-8 lg:pl-20"
          }`}
        >
          {tabNames[tab as keyof typeof tabNames]}
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        <Tabs
          value={tab}
          orientation="vertical"
          onValueChange={(value) => {
            setSearchParams((params) => {
              params.set("section", value);
              return params;
            });
          }}
          className="w-full flex flex-col lg:flex-row"
        >
          <TabsList className="flex flex-col items-start w-full lg:w-80 mb-4 lg:mb-0 lg:self-start ">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="w-full justify-start p-4 text-md gap-3"
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/*====== Info Tab ===== */}
          <TabsContent value="info" className="flex-1">
            <Suspense fallback={<InfoTabSkeleton />}>
              <InfoTab
                profile={profile}
                isFullnameExist={isFullnameExist}
                fullName={fullName}
                verificationStatus={verificationStatus}
              />
            </Suspense>
          </TabsContent>

          {/* =====History Tab===== */}
          <TabsContent value="history" className="flex-1">
            <Suspense fallback={<HistoryTabSkeleton />}>
              <HistoryTab />
            </Suspense>
          </TabsContent>

          {/* =====ProfileForm Tab===== */}
          <TabsContent value="settings" className="flex-1">
            {/* <div className="bg-white px-4 md:px-6">
              <div className="space-y-3"> */}
            <Suspense fallback={<ProfileFormSkeleton />}>
              <ProfileForm />
            </Suspense>
            {/* </div>
            </div> */}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
