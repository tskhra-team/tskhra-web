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
import MyServiceSkeletons from "@/features/my-businesses/Services/MyServiceSceletons";
import useDeleteService from "@/features/my-businesses/Services/useDeleteService";
import useGetMyServices from "@/features/my-businesses/Services/useGetMyServices";
import { Pencil, Plus, Power, Trash2 } from "lucide-react";

interface MyServicesProps {
  businessId: string | null;
}

export default function MyServices({ businessId }: MyServicesProps) {
  if (!businessId) return;

  const { data: services, isLoading } = useGetMyServices(businessId);
  const { showModal } = useModal();
  const { mutate: deleteService } = useDeleteService();

  const handleEdit = (serviceId: string) => {
    console.log("Edit service:", serviceId);
  };

  const handleDelete = (serviceId: string, serviceName: string) => {
    showModal(
      "error",
      `Delete ${serviceName}`,
      "Are you sure you want to delete this service?",
      "Close",
      () => {},
      "Delete",
      () => {
        deleteService(serviceId, {
          onSuccess: () => {
            showModal(
              "pending",
              `Deleting ${serviceName}`,
              "Please wait, it may take some time...",
            );

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
        });
      },
    );
  };

  const handleToggleStatus = (serviceId: string) => {
    console.log("Toggle service status:", serviceId);
  };

  const handleAddService = () => {
    console.log("Add new service");
  };

  if (isLoading) return <MyServiceSkeletons />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-5 sm:mt-10 gap-6">
      <Card
        className="cursor-pointer hover:border-primary transition-colors flex items-center justify-center min-h-37.5"
        onClick={handleAddService}
      >
        <Plus className="h-12 w-12 text-muted-foreground" />
      </Card>
      {services?.map((service) => (
        <Card key={service.id}>
          <CardHeader>
            <CardTitle className="line-clamp-1">{service.name}</CardTitle>
            <CardDescription className="line-clamp-2">
              {service.description}
            </CardDescription>
            <CardAction>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleEdit(service.id)}
                  aria-label="Edit service"
                  className="cursor-pointer"
                >
                  <Pencil className="h-4 w-4 cursor-pointer" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDelete(service.id, service.name)}
                  className="cursor-pointer"
                  aria-label="Delete service"
                >
                  <Trash2 className="h-4 w-4 " />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleToggleStatus(service.id)}
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
