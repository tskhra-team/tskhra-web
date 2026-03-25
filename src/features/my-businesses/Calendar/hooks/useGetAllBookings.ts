import useGetScheduledBookings from "@/features/my-businesses/Calendar/hooks/useGetScheduledBookings";
import useGetNotifications from "@/features/my-businesses/Notifications/hooks/useGetNotifications";
import { useTranslation } from "react-i18next";

const useGetAllBookings = (businessId: string | null) => {
  const { i18n } = useTranslation();
  const { data: awaitingBookings } = useGetNotifications(
    businessId || "",
    i18n.language.toUpperCase(),
  );
  const { data: scheduledBookings } = useGetScheduledBookings(
    businessId || "",
    i18n.language.toUpperCase(),
  );

  const fullBookings = [
    ...(awaitingBookings || []),
    ...(scheduledBookings || []),
  ];

  return {
    fullBookings,
  };
};

export default useGetAllBookings;
