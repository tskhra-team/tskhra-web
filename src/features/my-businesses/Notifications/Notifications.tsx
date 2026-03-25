import { minutesToTime } from "@/Booking/mockBusinesses";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useModal } from "@/context/ModalContext";
import NotificationsSkeleton from "@/features/my-businesses/Notifications/NotificationsSceleton";
import useApproveBooking from "@/features/my-businesses/Notifications/hooks/useApproveBooking";
import useGetNotifications from "@/features/my-businesses/Notifications/hooks/useGetNotifications";
import useRejectBooking from "@/features/my-businesses/Notifications/hooks/useRejectBooking";
import queryClient from "@/query/queryClient";
import { Calendar, Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface MyNotificationProps {
  businessId: string | null;
}

export default function Notifications({ businessId }: MyNotificationProps) {
  if (!businessId) return;
  const { t, i18n } = useTranslation(["dashboard", "modal"]);
  const { data: notifications, isLoading } = useGetNotifications(
    businessId,
    i18n.language.toUpperCase(),
  );
  const { mutate: rejectBooking } = useRejectBooking();
  const { mutate: approveBooking } = useApproveBooking();

  const { showModal } = useModal();

  const handleApprove = (bookingId: string) => {
    showModal(
      "warning",
      t("modal:titles.approveBooking"),
      t("modal:messages.confirmApproveBooking"),
      t("modal:buttons.close"),
      () => {},
      t("modal:buttons.approve"),
      () => {
        approveBooking(
          { bookingId },
          {
            onSuccess: () => {
              showModal(
                "success",
                t("modal:titles.successful"),
                t("modal:messages.bookingApprovedSuccess"),
              );

              queryClient.invalidateQueries({
                queryKey: ["getNotifications"],
              });

              queryClient.invalidateQueries({
                queryKey: ["getScheduledBookings"],
              });
            },

            onError: () => {
              showModal(
                "error",
                t("modal:titles.somethingWentWrong"),
                t("modal:messages.cantApproveBooking"),
              );
            },
          },
        );
      },
    );
  };

  const handleReject = (bookingId: string) => {
    showModal(
      "warning",
      t("modal:titles.rejectBooking"),
      t("modal:messages.confirmRejectBooking"),
      t("modal:buttons.close"),
      () => {},
      t("modal:buttons.reject"),
      () => {
        rejectBooking(
          { bookingId },
          {
            onSuccess: () => {
              showModal(
                "success",
                t("modal:titles.successful"),
                t("modal:messages.bookingRejectedSuccess"),
              );

              queryClient.invalidateQueries({
                queryKey: ["getNotifications"],
              });
            },

            onError: () => {
              showModal(
                "error",
                t("modal:titles.somethingWentWrong"),
                t("modal:messages.cantRejectBooking"),
              );
            },
          },
        );
      },
    );
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours + t("dashboard:notifications.labels.h")} ${mins + t("dashboard:notifications.labels.m")}`;
    }
    return `${mins + t("dashboard:notifications.labels.m")}`;
  };

  if (isLoading) {
    return <NotificationsSkeleton />;
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="flex flex-col justify-center h-full items-center">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-lg font-medium text-muted-foreground">
          {t("dashboard:notifications.empty.title")}
        </p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          {t("dashboard:notifications.empty.subtitle")}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="sm:text-3xl font-bold tracking-tight">
          {t("dashboard:notifications.title")}
        </h2>
        <span className="px-3 py-1 bg-muted text-muted-foreground text-xs  font-semibold rounded-full">
          {t("dashboard:notifications.pending", {
            count: notifications.length,
          })}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className="border-border/50 hover:border-border shadow-sm hover:shadow-md transition-all"
          >
            <CardContent className="p-4 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    {t("dashboard:notifications.labels.id")}
                  </p>
                  <p className="font-medium text-sm">{notification.id}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    {t("dashboard:notifications.labels.date")}
                  </p>
                  <p className="font-medium text-sm">{notification.date}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    {t("dashboard:notifications.labels.service")}
                  </p>
                  <p className="font-medium text-sm">
                    {notification.serviceName}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    {t("dashboard:notifications.labels.customer")}
                  </p>
                  <p className="font-medium text-sm">{notification.userName}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    {t("dashboard:notifications.labels.startTime")}
                  </p>
                  <p className="font-medium text-sm">
                    {minutesToTime(notification.startTime)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    {t("dashboard:notifications.labels.duration")}
                  </p>
                  <p className="font-medium text-sm">
                    {formatDuration(notification.duration)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-border/50 md:flex-col flex-row md:h-20">
                <Button
                  onClick={() => handleReject(notification.id)}
                  variant="outline"
                  size="sm"
                  className="flex-1 h-9 gap-1.5 text-xs "
                >
                  <X className="w-3.5 h-3.5" />
                  {t("dashboard:notifications.buttons.reject")}
                </Button>
                <Button
                  onClick={() => handleApprove(notification.id)}
                  size="sm"
                  className="flex-1 h-9 gap-1.5 text-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  {t("dashboard:notifications.buttons.approve")}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
