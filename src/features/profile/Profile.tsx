import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileForm from "@/features/profile/ProfileForm";
import useGetUser from "@/features/profile/useGetProfile";
import Avatar from "react-avatar";
import { useSearchParams } from "react-router-dom";

export default function Profile() {
  const { data: user } = useGetUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("section") || "info";
  const verificationStatus = user?.status ? "Verified" : "Not verified";
  const isFullnameExist = user?.firstName && user?.secondName;
  const fullName = isFullnameExist
    ? user?.firstName + " " + user?.secondName
    : user?.userName;
  const tabNames = {
    history: "History",
    info: "Personal Infrormation",
    paymentMethods: "Payment Methods",
    settings: "Account Settings",
  };

  return (
    <main className="px-4 sm:px-8 md:px-12 lg:px-20 py-6 md:py-10">
      <div className="flex flex-col justify-between md:flex-row gap-4 md:gap-5 items-start md:items-center mb-6 md:mb-8">
        <div
          className={`flex gap-4 items-center transition-all duration-500 ease-in-out ${
            tab !== "settings"
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none absolute"
          }`}
        >
          <Avatar
            name={fullName}
            size="60"
            round
            className="md:w-20! md:h-20!"
          />
          <div className="flex flex-col flex-1">
            <p className="text-xl md:text-2xl font-semibold">{fullName}</p>
            <p className="text-sm md:text-base text-gray-600">
              Status: {verificationStatus}
            </p>
            <p className="text-xs md:text-sm text-gray-500">
              {user?.userEmail}
            </p>
          </div>
        </div>
        <p
          className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold transition-all duration-500 ${
            tab === "settings" ? "md:ml-auto md:pl-0" : "md:pl-8 lg:pl-20"
          }`}
        >
          {tabNames[tab as keyof typeof tabNames]}
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        <Tabs
          defaultValue={tab}
          orientation="vertical"
          onValueChange={(value) => {
            setSearchParams((params) => {
              params.set("section", value);
              return params;
            });
          }}
          className="w-full flex flex-col lg:flex-row"
        >
          <TabsList className="flex flex-col items-start w-full lg:w-80 mb-4 lg:mb-0 lg:self-start">
            <TabsTrigger value="info" className="w-full justify-start">
              Personal Information
            </TabsTrigger>
            <TabsTrigger value="history" className="w-full justify-start">
              History
            </TabsTrigger>
            <TabsTrigger value="settings" className="w-full justify-start">
              Account Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="flex-1">
            <div className="bg-white px-4 md:px-6">
              <div className="space-y-3">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600">Username</p>
                  <p className="font-medium">{user?.userName}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{user?.userEmail}</p>
                </div>
                {isFullnameExist && (
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">{fullName}</p>
                  </div>
                )}

                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600">Account Created</p>
                  <p className="font-medium">{user?.createDate}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600">Status</p>
                  <p
                    className={`font-medium ${user?.status ? "text-green-500" : "text-red-500"} `}
                  >
                    {verificationStatus}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="history"
            className="rounded-lg shadow-sm border p-6"
          >
            <Tabs defaultValue="buying" orientation="horizontal">
              <div className="flex justify-center mb-6">
                <TabsList style={{ flexDirection: "row" }}>
                  <TabsTrigger value="buying">Buying</TabsTrigger>
                  <TabsTrigger value="booking">Booking</TabsTrigger>
                  <TabsTrigger value="swapping">Swapping</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="buying">
                <div className="bg-white p-6">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium">Order #12345</p>
                      <p className="text-sm text-gray-600">Date: 2026-01-15</p>
                      <p className="text-sm text-gray-600">
                        Product: Laptop Stand
                      </p>
                      <p className="text-sm text-gray-600">Status: Completed</p>
                      <p className="text-sm font-semibold">Total: $150.00</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium">Order #12344</p>
                      <p className="text-sm text-gray-600">Date: 2026-01-10</p>
                      <p className="text-sm text-gray-600">
                        Product: Wireless Mouse
                      </p>
                      <p className="text-sm text-gray-600">Status: Shipped</p>
                      <p className="text-sm font-semibold">Total: $89.99</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium">Order #12343</p>
                      <p className="text-sm text-gray-600">Date: 2026-01-05</p>
                      <p className="text-sm text-gray-600">
                        Product: USB Cable
                      </p>
                      <p className="text-sm text-gray-600">Status: Delivered</p>
                      <p className="text-sm font-semibold">Total: $12.99</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="booking">
                <div className="bg-white p-6">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium">Booking #BK789</p>
                      <p className="text-sm text-gray-600">Date: 2026-01-20</p>
                      <p className="text-sm text-gray-600">
                        Service: Photography Session
                      </p>
                      <p className="text-sm text-gray-600">Duration: 2 hours</p>
                      <p className="text-sm text-gray-600">Status: Confirmed</p>
                      <p className="text-sm font-semibold">Total: $200.00</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium">Booking #BK788</p>
                      <p className="text-sm text-gray-600">Date: 2026-01-12</p>
                      <p className="text-sm text-gray-600">
                        Service: Business Consultation
                      </p>
                      <p className="text-sm text-gray-600">Duration: 1 hour</p>
                      <p className="text-sm text-gray-600">Status: Completed</p>
                      <p className="text-sm font-semibold">Total: $50.00</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium">Booking #BK787</p>
                      <p className="text-sm text-gray-600">Date: 2026-01-03</p>
                      <p className="text-sm text-gray-600">
                        Service: Dental Checkup
                      </p>
                      <p className="text-sm text-gray-600">
                        Duration: 30 minutes
                      </p>
                      <p className="text-sm text-gray-600">Status: Completed</p>
                      <p className="text-sm font-semibold">Total: $75.00</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="swapping">
                <div className="bg-white p-6">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium">Swap #SW456</p>
                      <p className="text-sm text-gray-600">Date: 2026-01-18</p>
                      <p className="text-sm text-gray-600">
                        Your Item: Gaming Keyboard
                      </p>
                      <p className="text-sm text-gray-600">
                        Received Item: Mechanical Keyboard
                      </p>
                      <p className="text-sm text-gray-600">Status: Completed</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium">Swap #SW455</p>
                      <p className="text-sm text-gray-600">Date: 2026-01-08</p>
                      <p className="text-sm text-gray-600">
                        Your Item: Headphones
                      </p>
                      <p className="text-sm text-gray-600">
                        Received Item: Speakers
                      </p>
                      <p className="text-sm text-gray-600">
                        Status: In Progress
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium">Swap #SW454</p>
                      <p className="text-sm text-gray-600">Date: 2025-12-28</p>
                      <p className="text-sm text-gray-600">
                        Your Item: Monitor 24"
                      </p>
                      <p className="text-sm text-gray-600">
                        Received Item: Monitor 27"
                      </p>
                      <p className="text-sm text-gray-600">Status: Completed</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="paymentMethod" className="flex-1">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg md:text-xl font-semibold mb-4">
                Payment Methods
              </h3>
              <div className="space-y-3 md:space-y-4">
                <div className="p-3 md:p-4 border rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm md:text-base">
                      Visa •••• 4242
                    </p>
                    <p className="text-xs md:text-sm text-gray-600">
                      Expires 12/2026
                    </p>
                  </div>
                  <span className="text-xs md:text-sm bg-green-100 text-green-800 px-2 py-1 rounded whitespace-nowrap">
                    Default
                  </span>
                </div>
                <div className="p-3 md:p-4 border rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm md:text-base">
                      Mastercard •••• 8888
                    </p>
                    <p className="text-xs md:text-sm text-gray-600">
                      Expires 08/2027
                    </p>
                  </div>
                </div>
              </div>
              <Button className="mt-4 px-3 md:px-4 py-2 text-sm md:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto">
                Add New Payment Method
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="settings" className="flex-1">
            <div className="bg-white px-4 md:px-6">
              <div className="space-y-3">
                <ProfileForm />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
