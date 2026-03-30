import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useModal } from "@/context/ModalContext";
import CreateServiceModal from "@/features/my-businesses/Services/CreateServiceModal";
import MyServiceSkeletons from "@/features/my-businesses/Services/MyServiceSceletons";
import UpdateServiceModal from "@/features/my-businesses/Services/UpdateServiceModal";
import useDeleteService from "@/features/my-businesses/Services/hooks/useDeleteService";
import useGetMyServices, {
  type ServiceResponse,
} from "@/features/my-businesses/Services/hooks/useGetMyServices";
import useUpdateStatus from "@/features/my-businesses/Services/hooks/useUpdateStatus";
import queryClient from "@/query/queryClient";
import { Pencil, Plus, Power, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface MyServicesProps {
  businessId: string | null;
}

export interface UpdateBusinessProps {
  id: string;
  nameKa: string;
  name: string | undefined;
  price: number;
  duration: number;
  descriptionKa: string | undefined;
  description: string | undefined;
  status: string;
}

export default function MyServices({ businessId }: MyServicesProps) {
  if (!businessId) return;

  const { t, i18n } = useTranslation(["dashboard", "modal"]);
  const { data: servicesKa, isLoading } = useGetMyServices(businessId, "KA");
  const { data: servicesEn } = useGetMyServices(businessId, "EN");

  const services = i18n.language === "ka" ? servicesKa : servicesEn;

  const servicesUpdate = servicesKa?.map((service, i) => {
    return {
      id: service.id,
      nameKa: service.name,
      name: servicesEn?.at(i)?.name,
      price: service.price,
      duration: service.duration,
      descriptionKa: service?.description,
      description: servicesEn?.at(i)?.description,
      status: service.status,
    };
  });

  const { showModal } = useModal();
  const { mutate: deleteService } = useDeleteService();
  const { mutate: updateStatus } = useUpdateStatus();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUdpateModal, setShowUpdateModal] = useState(false);
  const [selectedService, setSelectedService] =
    useState<UpdateBusinessProps | null>(null);

  const handleUpdate = (service: ServiceResponse) => {
    const updatingService = servicesUpdate?.find(
      (serviceUpd) => serviceUpd.id === service.id,
    );
    setSelectedService(updatingService ?? null);
    setShowUpdateModal(true);
  };

  const handleDelete = (
    serviceId: string,
    serviceName: string,
    serviceStatus: string,
  ) => {
    if (serviceStatus === "ACTIVE") {
      return showModal(
        "warning",
        t("modal:titles.serviceActive"),
        t("modal:messages.cantDeleteActiveService"),
      );
    }

    showModal(
      "error",
      t("modal:titles.deleteService", { serviceName }),
      t("modal:messages.confirmDeleteService"),
      t("modal:buttons.close"),
      () => {},
      t("modal:buttons.delete"),
      () => {
        setTimeout(() => {
          showModal(
            "pending",
            t("modal:titles.deletingService"),
            t("modal:messages.deletingServiceWait"),
          );

          deleteService(
            { serviceId, businessId },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({
                  queryKey: ["getMyServices"],
                });

                showModal(
                  "success",
                  t("modal:titles.successful"),
                  t("modal:messages.serviceDeletedSuccess"),
                );
              },
              onError: () => {
                showModal(
                  "error",
                  t("modal:titles.somethingWentWrong"),
                  t("modal:messages.serviceDidntDeleted"),
                );
              },
            },
          );
        }, 50);
      },
    );
  };

  const handleUpdateStatus = (serviceId: string, serviceStatus: string) => {
    const finalStatus = serviceStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    showModal(
      `${serviceStatus === "ACTIVE" ? "error" : "warning"}`,
      `${serviceStatus === "ACTIVE" ? t("modal:titles.attention") : t("modal:titles.makeServiceActive")}`,
      `${serviceStatus === "ACTIVE" ? t("modal:messages.deactivateServiceWarning") : t("modal:messages.activateServiceConfirm")}`,
      t("modal:buttons.cancel"),
      () => {},
      t("modal:buttons.continue"),
      () => {
        updateStatus(
          { serviceId, businessId, serviceStatus: finalStatus },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: ["getMyServices"],
              });

              queryClient.invalidateQueries({
                queryKey: ["getScheduledBookings"],
              });

              showModal(
                "success",
                t("modal:titles.updatedSuccessfully"),
                t("modal:messages.serviceStatusUpdated"),
              );
            },
          },
        );
      },
    );
  };

  const handleAddService = () => {
    setShowCreateModal((show: boolean) => !show);
  };

  if (isLoading) return <MyServiceSkeletons />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="sm:text-3xl font-bold tracking-tight">
          {t("dashboard:services.title")}
        </h2>
        <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded-full">
          {t("dashboard:services.count", { count: services?.length || 0 })}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          title={t("dashboard:services.addNewService")}
          className="cursor-pointer hover:border-primary transition-colors flex items-center justify-center min-h-37.5"
          onClick={handleAddService}
        >
          <Plus className="h-12 w-12 text-muted-foreground" />
        </Card>
        {services?.map((service) => (
          <Card key={service.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="line-clamp-1 pb-1 leading-snug">
                {service.name.length > 18
                  ? service.name.slice(0, 17) + "..."
                  : service.name}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {service.description.length > 40
                  ? service.description.slice(0, 25) + "..."
                  : service.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("dashboard:services.labels.price")}
                  </span>
                  <span className="font-semibold">₾ {service.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("dashboard:services.labels.duration")}
                  </span>
                  <span className="font-semibold">
                    {service.duration} {t("dashboard:calendar.popover.min")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("dashboard:services.labels.status")}
                  </span>
                  <span
                    title={
                      service.status === "ACTIVE"
                        ? t("dashboard:services.status.activeTooltip")
                        : t("dashboard:services.status.inactiveTooltip")
                    }
                    className={`font-bold text-white px-2 py-0.5 rounded-full text-xs ${service.status === "ACTIVE" ? "bg-green-800" : "bg-red-800"} `}
                  >
                    {service.status === "ACTIVE"
                      ? t("dashboard:services.status.active")
                      : t("dashboard:services.status.inactive")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mt-4 pt-4 border-t">
                <Button
                  title={t("dashboard:services.tooltips.editService")}
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdate(service)}
                  aria-label={t("dashboard:services.tooltips.editService")}
                  className="w-full cursor-pointer"
                >
                  <Pencil className="h-4 w-4" />
                  {/* <span className="sr-only sm:not-sr-only sm:ml-1">
                    {t("dashboard:services.buttons.edit")}
                  </span> */}
                </Button>
                <Button
                  title={t("dashboard:services.tooltips.deleteService")}
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleDelete(service.id, service.name, service.status)
                  }
                  aria-label={t("dashboard:services.tooltips.deleteService")}
                  className="w-full cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                  {/* <span className="sr-only sm:not-sr-only sm:ml-1">{t("dashboard:services.buttons.delete")}</span> */}
                </Button>
                <Button
                  title={
                    service.status === "ACTIVE"
                      ? t("dashboard:services.tooltips.deactivateService")
                      : t("dashboard:services.tooltips.activateService")
                  }
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateStatus(service.id, service.status)}
                  aria-label={
                    service.status === "ACTIVE"
                      ? t("dashboard:services.tooltips.deactivateService")
                      : t("dashboard:services.tooltips.activateService")
                  }
                  className="w-full cursor-pointer"
                >
                  <Power className="h-4 w-4" />
                  {/* <span className="sr-only sm:not-sr-only sm:ml-1">
                    {service.status === "ACTIVE"
                      ? t("dashboard:services.buttons.off")
                      : t("dashboard:services.buttons.on")}
                  </span> */}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showCreateModal && (
        <CreateServiceModal
          businessId={businessId}
          onShowCreateModal={setShowCreateModal}
        />
      )}

      {showUdpateModal && selectedService && (
        <UpdateServiceModal
          businessId={businessId}
          onShowUpdateModal={setShowUpdateModal}
          service={selectedService}
        />
      )}
    </div>
  );
}
