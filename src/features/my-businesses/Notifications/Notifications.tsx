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
  const { t } = useTranslation("modal");
  const { data: notifications, isLoading } = useGetNotifications(businessId);
  const { mutate: rejectBooking } = useRejectBooking();
  const { mutate: approveBooking } = useApproveBooking();

  const { showModal } = useModal();

  const handleApprove = (bookingId: string) => {
    showModal(
      "warning",
      t("titles.approveBooking"),
      t("messages.confirmApproveBooking"),
      t("buttons.close"),
      () => {},
      t("buttons.approve"),
      () => {
        approveBooking(
          { bookingId },
          {
            onSuccess: () => {
              showModal(
                "success",
                t("titles.successful"),
                t("messages.bookingApprovedSuccess"),
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
                t("titles.somethingWentWrong"),
                t("messages.cantApproveBooking"),
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
      t("titles.rejectBooking"),
      t("messages.confirmRejectBooking"),
      t("buttons.close"),
      () => {},
      t("buttons.reject"),
      () => {
        rejectBooking(
          { bookingId },
          {
            onSuccess: () => {
              showModal(
                "success",
                t("titles.successful"),
                t("messages.bookingRejectedSuccess"),
              );

              queryClient.invalidateQueries({
                queryKey: ["getNotifications"],
              });
            },

            onError: () => {
              showModal(
                "error",
                t("titles.somethingWentWrong"),
                t("messages.cantRejectBooking"),
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
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
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
          No pending notifications
        </p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          You're all caught up!
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 ">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
        <span className="px-3 py-1 bg-muted text-muted-foreground text-sm font-semibold rounded-full">
          {notifications.length} pending
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
                  <p className="text-xs text-muted-foreground mb-0.5">ID</p>
                  <p className="font-medium text-sm">{notification.id}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Date</p>
                  <p className="font-medium text-sm">{notification.date}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Service
                  </p>
                  <p className="font-medium text-sm">
                    {notification.serviceName}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Customer
                  </p>
                  <p className="font-medium text-sm">{notification.userName}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Start Time
                  </p>
                  <p className="font-medium text-sm">
                    {minutesToTime(notification.startTime)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Duration
                  </p>
                  <p className="font-medium text-sm">
                    {formatDuration(notification.duration)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-border/50">
                <Button
                  onClick={() => handleReject(notification.id)}
                  variant="outline"
                  size="sm"
                  className="flex-1 h-9 gap-1.5 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleApprove(notification.id)}
                  size="sm"
                  className="flex-1 h-9 gap-1.5 text-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  Approve
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
