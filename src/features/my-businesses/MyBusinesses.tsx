import BusinessPicker from "@/features/my-businesses/BusinessPicker";
import BusinessPickerSkeleton from "@/features/my-businesses/BusinessPickerSkeleton";
import BusinessSidebarProvider from "@/features/my-businesses/BusinessSidebarProvider";
import useGetAllBookings from "@/features/my-businesses/Calendar/hooks/useGetAllBookings";
import ReadOnlyCalendar from "@/features/my-businesses/Calendar/ReadOnlyCalendar";
import type { WorkSchedule } from "@/features/my-businesses/Calendar/types/calendar.types";
import Notifications from "@/features/my-businesses/Notifications/Notifications";
import MyServices from "@/features/my-businesses/Services/MyServices";
import type { MyBusinessResponse } from "@/features/my-businesses/useGetMyBusinesses";
import useGetMyBusinesses from "@/features/my-businesses/useGetMyBusinesses";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

// Функция для объединения workTimes и restTimes в формат WorkSchedule[]
const combineSchedule = (
  business: MyBusinessResponse | undefined,
): WorkSchedule[] => {
  if (!business) return [];

  const scheduleMap = new Map<string, WorkSchedule>();

  // Добавляем workTimes
  business.workTimes.forEach((workTime) => {
    scheduleMap.set(workTime.weekDay, {
      weekDay: workTime.weekDay as WorkSchedule["weekDay"],
      startTime: workTime.startTime,
      endTime: workTime.endTime,
    });
  });

  // Добавляем restTimes к соответствующим дням
  business.restTimes.forEach((restTime) => {
    const existing = scheduleMap.get(restTime.weekDay);
    if (existing) {
      existing.restStart = restTime.startTime;
      existing.restEnd = restTime.endTime;
    }
  });

  return Array.from(scheduleMap.values());
};

export default function MyBusinesses() {
  const { t } = useTranslation("dashboard");
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section");
  const businessId = searchParams.get("businessId");

  const { fullBookings } = useGetAllBookings(businessId);

  const { data: businesses, isLoading } = useGetMyBusinesses();

  // Получаем текущий бизнес по businessId
  const currentBusiness = useMemo(() => {
    if (!businessId || !businesses) return undefined;
    return businesses.find((business) => business.businessId === businessId);
  }, [businessId, businesses]);

  // Cpmbine workTimes and restTimes to needed format
  const schedule = useMemo(() => {
    return combineSchedule(currentBusiness);
  }, [currentBusiness]);

  const renderContent = () => {
    switch (section) {
      case "chart":
        return (
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{t("pages.chart.title")}</h1>
            <p className="text-muted-foreground">
              {t("pages.chart.description")}
            </p>
            {/* Chart content will go here */}
          </div>
        );
      case "calendar":
        return (
          <>
            <ReadOnlyCalendar
              schedule={schedule}
              bookings={fullBookings || []}
            />
          </>
        );
      case "manage":
        return (
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{t("pages.manage.title")}</h1>
            <p className="text-muted-foreground">
              {t("pages.manage.description")}
            </p>
            {/* Management content will go here */}
          </div>
        );
      case "notification":
        return <Notifications businessId={businessId} />;
      case "services":
        return <MyServices businessId={businessId} />;
      default:
        return businesses?.length ? (
          <BusinessPicker businesses={businesses} isLoading={isLoading} />
        ) : isLoading ? (
          <BusinessPickerSkeleton />
        ) : (
          <div className="flex items-center text-center justify-center h-full">
            <p className="text-2xl font-semibold text-muted-foreground">
              {t("businessPicker.noBusiness")}
            </p>
          </div>
        );
    }
  };

  return <BusinessSidebarProvider>{renderContent()}</BusinessSidebarProvider>;
}
