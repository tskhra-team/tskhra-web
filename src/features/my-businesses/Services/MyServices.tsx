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

export default function MyServices({ businessId }: MyServicesProps) {
  if (!businessId) return;

  const { t } = useTranslation("modal");
  const { data: services, isLoading } = useGetMyServices(businessId);
  const { showModal } = useModal();
  const { mutate: deleteService } = useDeleteService();
  const { mutate: updateStatus } = useUpdateStatus();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUdpateModal, setShowUpdateModal] = useState(false);
  const [selectedService, setSelectedService] =
    useState<ServiceResponse | null>(null);

  const handleUpdate = (service: ServiceResponse) => {
    setSelectedService(service);
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
        t("titles.serviceActive"),
        t("messages.cantDeleteActiveService"),
      );
    }

    showModal(
      "error",
      t("titles.deleteService", { serviceName }),
      t("messages.confirmDeleteService"),
      t("buttons.close"),
      () => {},
      t("buttons.delete"),
      () => {
        setTimeout(() => {
          showModal(
            "pending",
            t("titles.deletingService"),
            t("messages.deletingServiceWait"),
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
                  t("titles.successful"),
                  t("messages.serviceDeletedSuccess"),
                );
              },
              onError: () => {
                showModal(
                  "error",
                  t("titles.somethingWentWrong"),
                  t("messages.serviceDidntDeleted"),
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
      `${serviceStatus === "ACTIVE" ? t("titles.attention") : t("titles.makeServiceActive")}`,
      `${serviceStatus === "ACTIVE" ? t("messages.deactivateServiceWarning") : t("messages.activateServiceConfirm")}`,
      t("buttons.cancel"),
      () => {},
      t("buttons.continue"),
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
                t("titles.updatedSuccessfully"),
                t("messages.serviceStatusUpdated"),
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
        <h2 className="text-3xl font-bold tracking-tight">My Services</h2>
        <span className="px-3 py-1 bg-muted text-muted-foreground text-sm font-semibold rounded-full">
          {services?.length || 0} services
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          title="Add new service"
          className="cursor-pointer hover:border-primary transition-colors flex items-center justify-center min-h-37.5"
          onClick={handleAddService}
        >
          <Plus className="h-12 w-12 text-muted-foreground" />
        </Card>
        {services?.map((service) => (
          <Card key={service.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="line-clamp-1 pb-2">
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
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-semibold">₾ {service.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-semibold">{service.duration} min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <span
                    title={`${service.status === "ACTIVE" ? "This is active service" : "This is inactive service"}`}
                    className={`font-bold text-white px-2 py-0.5 rounded-full text-xs ${service.status === "ACTIVE" ? "bg-green-800" : "bg-red-800"} `}
                  >
                    {service.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mt-4 pt-4 border-t">
                <Button
                  title="Edit service"
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdate(service)}
                  aria-label="Edit service"
                  className="w-full"
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only sm:ml-1">Edit</span>
                </Button>
                <Button
                  title="Delete service"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleDelete(service.id, service.name, service.status)
                  }
                  aria-label="Delete service"
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only sm:ml-1">Delete</span>
                </Button>
                <Button
                  title={`${service.status === "ACTIVE" ? "Deactivate" : "Activate"} service`}
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateStatus(service.id, service.status)}
                  aria-label="Toggle service status"
                  className="w-full"
                >
                  <Power className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only sm:ml-1">
                    {service.status === "ACTIVE" ? "Off" : "On"}
                  </span>
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
