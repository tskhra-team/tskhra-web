import useGetScheduledBookings from "@/features/my-businesses/Calendar/hooks/useGetScheduledBookings";
import useGetNotifications from "@/features/my-businesses/Notifications/hooks/useGetNotifications";

const useGetAllBookings = (businessId: string | null) => {
  const { data: awaitingBookings } = useGetNotifications(businessId || "");
  const { data: scheduledBookings } = useGetScheduledBookings(businessId || "");

  const fullBookings = [
    ...(awaitingBookings || []),
    ...(scheduledBookings || []),
  ];

  return {
    fullBookings,
  };
};

export default useGetAllBookings;
