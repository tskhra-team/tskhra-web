import ServiceForm from "@/Booking/ServiceForm";

export default function CreateServicePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">შექმენი ახალი სერვისი</h1>
        <p className="text-gray-600">
          შეავსე ფორმა და გამოაქვეყნე შენი სერვისი
        </p>
      </div>
      <ServiceForm />
    </div>
  );
}
