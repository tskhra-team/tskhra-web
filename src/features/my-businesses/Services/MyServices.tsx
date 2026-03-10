import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useModal } from "@/context/ModalContext";
import CreateServiceModal from "@/features/my-businesses/Services/CreateServiceModal";
import MyServiceSkeletons from "@/features/my-businesses/Services/MyServiceSceletons";
import UpdateServiceModal from "@/features/my-businesses/Services/UpdateServiceModal";
import useDeleteService from "@/features/my-businesses/Services/useDeleteService";
import useGetMyServices, {
  type ServiceResponse,
} from "@/features/my-businesses/Services/useGetMyServices";
import useUpdateStatus from "@/features/my-businesses/Services/useUpdateStatus";
import queryClient from "@/query/queryClient";
import { Pencil, Plus, Power, Trash2 } from "lucide-react";
import { useState } from "react";

interface MyServicesProps {
  businessId: string | null;
}

export default function MyServices({ businessId }: MyServicesProps) {
  if (!businessId) return;

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
        "This Service is aticve!",
        "We can't delete an active service, please make it inacctive to delete it!",
      );
    }

    showModal(
      "error",
      `Delete ${serviceName}`,
      "Are you sure you want to delete this service?",
      "Close",
      () => {},
      "Delete",
      () => {
        setTimeout(() => {
          showModal(
            "pending",
            "Deleting Service",
            "Please wait, deleting your service...",
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
                  "Successfull",
                  "Service deleted successfully!",
                );
              },
              onError: () => {
                showModal(
                  "error",
                  "Something went wrong",
                  "Service didn't deleted",
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

    console.log(finalStatus);

    showModal(
      "warning",
      `Make this service ${serviceStatus === "ACTIVE" ? "inactive" : "active"}?`,
      `Are you sure you want to make this service ${serviceStatus === "ACTIVE" ? "inactive" : "active"}?`,
      "Cancel",
      () => {},
      "Continue",
      () => {
        updateStatus(
          { serviceId, businessId, serviceStatus: finalStatus },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: ["getMyServices"],
              });

              showModal(
                "success",
                "Updated Successfully",
                "Service status was updated successfully",
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-5 sm:mt-10 gap-6">
      <Card
        title="Add new service"
        className="cursor-pointer hover:border-primary transition-colors flex items-center justify-center min-h-37.5"
        onClick={handleAddService}
      >
        <Plus className="h-12 w-12 text-muted-foreground" />
      </Card>
      {services?.map((service) => (
        <Card key={service.id}>
          <CardHeader>
            <CardTitle className="line-clamp-1">
              {service.name.length > 25
                ? service.name.slice(0, 25) + "..."
                : service.name}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {service.description.length > 40
                ? service.description.slice(0, 25) + "..."
                : service.description}
            </CardDescription>
            <CardAction>
              <div className="flex gap-1">
                <Button
                  title="Edit service"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleUpdate(service)}
                  aria-label="Edit service"
                  className="cursor-pointer"
                >
                  <Pencil className="h-4 w-4 cursor-pointer" />
                </Button>
                <Button
                  title="Delete service"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() =>
                    handleDelete(service.id, service.name, service.status)
                  }
                  className="cursor-pointer"
                  aria-label="Delete service"
                >
                  <Trash2 className="h-4 w-4 " />
                </Button>
                <Button
                  title="Activate or diactivate service"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleUpdateStatus(service.id, service.status)}
                  aria-label="Toggle service status"
                  className="cursor-pointer"
                >
                  <Power className="h-4 w-4 " />
                </Button>
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
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
                className={`font-bold text-white w-5 rounded-2xl cursor-pointer text-center  ${service.status === "ACTIVE" ? "bg-green-900" : "bg-red-800"} `}
              ></span>
            </div>
          </CardContent>
        </Card>
      ))}
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
