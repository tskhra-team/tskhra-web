import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  HistoryTabSkeleton,
  InfoTabSkeleton,
  ProfileFormSkeleton,
} from "@/features/profile/LoadingSkeletons";
import useGetProfile from "@/features/profile/hooks/useGetProfile";
import { Menu } from "lucide-react";
import { lazy, Suspense, useState } from "react";

import ProfileMobileNav from "@/features/profile/ProfileMobileNav";
import ProfileSidebar from "@/features/profile/ProfileSidebar";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

// Lazy load tab components for better performance
const ProfileSettings = lazy(
  () => import("@/features/profile/ProfileSettings"),
);
const HistoryTab = lazy(() => import("@/features/profile/HistoryTab"));
const FavoritesTab = lazy(() => import("@/features/profile/FavoritesTab"));
const AddBusinessTab = lazy(() => import("@/features/profile/AddBusinessTab"));
const SecurityTab = lazy(() => import("@/features/profile/SecurityTab"));

export default function Profile() {
  const { data: profile } = useGetProfile();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation("profile");
  const tab = searchParams.get("section") || "profile";
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleSectionChange = (section: string) => {
    setSearchParams({ section });
  };

  const tabContent = (
    <>
      <Suspense fallback={<ProfileFormSkeleton />}>
        {tab === "profile" && (
          <ProfileSettings
            profile={profile}
            isEditMode={isEditMode}
            onSetIsEditMode={setIsEditMode}
          />
        )}
      </Suspense>
      <Suspense fallback={<HistoryTabSkeleton />}>
        {tab === "history" && <HistoryTab />}
      </Suspense>
      <Suspense fallback={<InfoTabSkeleton />}>
        {tab === "favorites" && <FavoritesTab />}
      </Suspense>
      <Suspense fallback={<InfoTabSkeleton />}>
        {tab === "add-business" && <AddBusinessTab />}
      </Suspense>
      <Suspense fallback={<InfoTabSkeleton />}>
        {tab === "security" && <SecurityTab />}
      </Suspense>
    </>
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Sidebar */}
        <ProfileSidebar
          currentSection={tab}
          onSectionChange={handleSectionChange}
          profile={profile}
        />

        {/* Content Area */}
        <div className="flex-1 lg:ml-70">
          {/* Tab Content */}
          <div className="p-8 lg:p-12">{tabContent}</div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 backdrop-blur-md bg-background/95 border-b border-slate-200">
          <div className="flex items-center gap-4 p-4">
            <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-70">
                <ProfileMobileNav
                  currentSection={tab}
                  onSectionChange={handleSectionChange}
                  onClose={() => setIsMobileNavOpen(false)}
                  profile={profile}
                />
              </SheetContent>
            </Sheet>

            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
              {t("tabs.profile")}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">{tabContent}</div>
      </div>
    </main>
  );
}
