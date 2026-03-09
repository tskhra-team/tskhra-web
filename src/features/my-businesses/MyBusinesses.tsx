import BusinessSidebarProvider from "@/features/my-businesses/BusinessSidebarProvider";
import ReadOnlyCalendar from "@/features/my-businesses/Calendar/ReadOnlyCalendar";
import type { WorkSchedule } from "@/features/my-businesses/Calendar/types/calendar.types";
import MyServices from "@/features/my-businesses/Services/MyServices";
import type { MyBusinessResponse } from "@/features/my-businesses/useGetMyBusinesses";
import useGetMyBusinesses from "@/features/my-businesses/useGetMyBusinesses";
import { useMemo } from "react";
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
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section");
  const businessId = searchParams.get("businessId");

  const { data: businesses } = useGetMyBusinesses();

  // Получаем текущий бизнес по businessId
  const currentBusiness = useMemo(() => {
    if (!businessId || !businesses) return undefined;
    return businesses.find((business) => business.businessId === businessId);
  }, [businessId, businesses]);

  // Объединяем workTimes и restTimes в нужный формат
  const schedule = useMemo(() => {
    return combineSchedule(currentBusiness);
  }, [currentBusiness]);

  const renderContent = () => {
    switch (section) {
      case "chart":
        return (
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Chart</h1>
            <p className="text-muted-foreground">
              View your business analytics and performance metrics.
            </p>
            {/* Chart content will go here */}
          </div>
        );
      case "calendar":
        return (
          <>
            <ReadOnlyCalendar schedule={schedule} />
          </>
        );
      case "manage":
        return (
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Manage</h1>
            <p className="text-muted-foreground">
              Manage your business settings and configurations.
            </p>
            {/* Management content will go here */}
          </div>
        );
      case "notification":
        return (
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">
              View and manage your notifications.
            </p>
            {/* Notification content will go here */}
          </div>
        );
      case "services":
        return <MyServices businessId={businessId} />;
      default:
        return (
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">My Businesses</h1>
            <p className="text-muted-foreground">
              Manage your businesses, calendar and notifications!
            </p>
          </div>
        );
    }
  };

  return <BusinessSidebarProvider>{renderContent()}</BusinessSidebarProvider>;
}
