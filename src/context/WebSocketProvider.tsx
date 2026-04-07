import { useAuth } from "@/context/useAuth";
import { getSingleService } from "@/hooks/useGetSingleService";
import { Client } from "@stomp/stompjs";
import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { playSound, useSound } from "react-sounds";
import { toast } from "sonner";

interface WebSocketContextType {
  client: Client | null;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();
  const { play } = useSound("notification/info");
  const languageRef = useRef(i18n.language);

  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    languageRef.current = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    if (!token) {
      setClient(null);
      return;
    }

    const newClient = new Client({
      brokerURL: `wss://sessile-nettlelike-antoinette.ngrok-free.dev/ws?token=${token}`,
      onConnect: () => {
        newClient.subscribe("/user/queue/messages", async (message) => {
          const data = JSON.parse(message.body);

          try {
            const serviceData = await getSingleService({
              businessId: data.businessId,
              serviceId: data.serviceId,
              lang: languageRef.current.toUpperCase(),
            });

            toast(i18n.t("notifications:newBookingRequest"), {
              description: i18n.t("notifications:userBookedService", {
                bookedBy: data.bookedBy,
                serviceName: serviceData.name,
                date: data.date,
              }),
              action: {
                label: i18n.t("notifications:see"),
                onClick: () => {
                  window.location.href = `/my-businesses?businessId=${data.businessId}&section=notification`;
                },
              },
            });
          } catch (error) {
            play();
            toast(i18n.t("notifications:newBookingRequest"), {
              description: i18n.t("notifications:userBookedServiceNoName", {
                bookedBy: data.bookedBy,
                date: data.date,
              }),
              action: {
                label: i18n.t("notifications:see"),
                onClick: () => {
                  window.location.href = `/my-businesses?businessId=${data.businessId}&section=notification`;
                },
              },
            });
          }

          play();
          queryClient.invalidateQueries({
            queryKey: ["getUserNotifications"],
          });
          queryClient.invalidateQueries({
            queryKey: ["getNotifications"],
          });
        });

        newClient.subscribe("/user/queue/statuschange", async (message) => {
          const data = JSON.parse(message.body);
          const status = data.newStatus || data.status;

          try {
            const serviceData = await getSingleService({
              businessId: data.businessId,
              serviceId: data.serviceId,
              lang: languageRef.current.toUpperCase(),
            });

            switch (status) {
              case "CANCELLED_BY_USER":
                play();
                toast.warning(i18n.t("notifications:bookingCancelledByUser"), {
                  description: i18n.t(
                    "notifications:bookingCancelledByUserDesc",
                    {
                      userName: data.userName || data.bookedBy || "User",
                      serviceName: serviceData.name,
                      date: data.date,
                    },
                  ),
                });

                break;

              case "CANCELLED_BY_BUSINESS":
                play();
                toast.error(
                  i18n.t("notifications:bookingCancelledByBusiness"),
                  {
                    description: i18n.t(
                      "notifications:bookingCancelledByBusinessDesc",
                      {
                        serviceName: serviceData.name,
                        date: data.date,
                      },
                    ),
                    action: {
                      label: i18n.t("notifications:see"),
                      onClick: () => {
                        window.location.href = `/booking/business/${data.businessId}`;
                      },
                    },
                  },
                );

                break;

              case "SCHEDULED":
                playSound("notification/success");
                toast.success(i18n.t("notifications:bookingScheduled"), {
                  description: i18n.t("notifications:bookingScheduledDesc", {
                    serviceName: serviceData.name,
                    date: data.date,
                  }),
                  action: {
                    label: i18n.t("notifications:see"),
                    onClick: () => {
                      window.location.href = `/my-bookings`;
                    },
                  },
                });
                break;

              case "REJECTED":
                playSound("notification/error");
                toast.error(i18n.t("notifications:bookingRejected"), {
                  description: i18n.t("notifications:bookingRejectedDesc", {
                    serviceName: serviceData.name,
                    date: data.date,
                  }),
                });
                break;

              default:
                play();
                toast.info(i18n.t("notifications:bookingConfirmed"), {
                  description: i18n.t(
                    "notifications:statusChangedWithService",
                    {
                      serviceName: serviceData.name,
                      status: status,
                    },
                  ),
                });
            }
          } catch (error) {
            play();
            toast.info(i18n.t("notifications:bookingConfirmed"), {
              description: i18n.t("notifications:statusChangedNoService", {
                status: status,
              }),
            });
          }

          queryClient.invalidateQueries({
            queryKey: ["getUserNotifications"],
          });
          queryClient.invalidateQueries({
            queryKey: ["getUserNotifications"],
          });
        });
      },
    });

    newClient.activate();
    setClient(newClient);

    return () => {
      newClient.deactivate();
      setClient(null);
    };
  }, [token, queryClient]);

  const value = useMemo(
    () => ({
      client,
    }),
    [client],
  );

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) throw new Error("Must be used within Provider");
  return context;
}
