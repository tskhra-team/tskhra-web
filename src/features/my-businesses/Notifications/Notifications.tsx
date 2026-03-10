import { minutesToTime } from "@/Booking/mockBusinesses";
import { Button } from "@/components/ui/button";
import useGetNotifications from "@/features/my-businesses/Notifications/useGetNotifications";

interface MyNotificationProps {
  businessId: string | null;
}

export default function Notifications({ businessId }: MyNotificationProps) {
  if (!businessId) return;
  const { data: notifications, isLoading } = useGetNotifications(businessId);

  const handleApprove = (notificationId: string) => {
    console.log("Approve notification:", notificationId);
    // TODO: Add approve logic
  };

  const handleReject = (notificationId: string) => {
    console.log("Reject notification:", notificationId);
    // TODO: Add reject logic
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
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
    return <div className="p-4">Loading notifications...</div>;
  }

  if (!notifications || notifications.length === 0) {
    return <div className="p-4 text-gray-500">No pending notifications</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Service</p>
              <p className="font-semibold">{notification.serviceName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="font-semibold">{notification.userName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Start Time</p>
              <p className="font-semibold">
                {minutesToTime(notification.startTime)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-semibold">
                {formatDuration(notification.duration)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-semibold capitalize">{notification.status}</p>
            </div>
          </div>
          <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
            <Button
              onClick={() => handleReject(notification.id)}
              variant="outline"
              className="flex-1"
            >
              Reject
            </Button>
            <Button
              onClick={() => handleApprove(notification.id)}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Approve
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
