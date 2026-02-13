import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/useAuth";
import HistoryTab from "@/features/profile/HistoryTab";
import InfoTab from "@/features/profile/InfoTab";
import ProfileForm from "@/features/profile/ProfileForm";
import useGetProfile from "@/features/profile/useGetProfile";
import Avatar from "react-avatar";
import { useSearchParams } from "react-router-dom";

export default function Profile() {
  const { data: profile } = useGetProfile();
  const [searchParams, setSearchParams] = useSearchParams();
  const { token } = useAuth();
  const tab = searchParams.get("section") || "info";
  const verificationStatus = profile?.status;
  const isFullnameExist = profile?.firstName && profile?.lastName;
  const fullName = isFullnameExist
    ? profile?.firstName + " " + profile?.lastName
    : profile?.userName;

  const tabs = [
    { value: "info", label: "Personal Information" },
    { value: "history", label: "History" },
    { value: "settings", label: "Account Settings" },
  ];

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
              Status: {verificationStatus ? "Verified" : "Not Verified"}
            </p>
            <p className="text-xs md:text-sm text-gray-500">
              {profile?.userEmail}
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
          <TabsList className="flex flex-col items-start w-full lg:w-80 mb-4 lg:mb-0 lg:self-start ">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="w-full justify-start p-4 text-md"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/*====== Info Tab ===== */}
          <TabsContent value="info" className="flex-1">
            <InfoTab
              profile={profile}
              isFullnameExist={isFullnameExist}
              fullName={fullName}
              verificationStatus={verificationStatus}
            />
          </TabsContent>

          {/* =====History Tab===== */}
          <TabsContent
            value="history"
            className="bg-linear-to-br from-gray-50 to-blue-50/30 px-4 md:px-6 py-8 rounded-2xl"
          >
            <HistoryTab />
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
