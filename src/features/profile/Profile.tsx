import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/useAuth";
import { useState } from "react";
import Avatar from "react-avatar";

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("info");

  const tabNames = {
    history: "History",
    info: "Info",
    "payment-methods": "Payment Methods",
  };

  return (
    <main className="px-20 py-10">
      <div className="flex gap-5 items-center mb-8">
        <Avatar name={user.userName} size="80" round />
        <div className="flex flex-col">
          <p className="text-2xl font-semibold">{user.userName}</p>
          <p className="text-gray-600">Status: {user.status}</p>
          <p className="text-sm text-gray-500">{user.userEmail}</p>
        </div>
        <p className="text-5xl pl-20 font-bold">
          {tabNames[activeTab as keyof typeof tabNames]}
        </p>
      </div>
      <div className="flex gap-8">
        <Tabs
          defaultValue="info"
          orientation="vertical"
          onValueChange={(value) => setActiveTab(value)}
          className="w-full"
        >
          <TabsList className="flex flex-col items-start w-80">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="flex-1">
            <div className="bg-white px-6">
              <h3 className="text-xl font-semibold mb-4">
                Personal Information
              </h3>
              <div className="space-y-3">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium">{user.userName}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{user.userEmail}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600">Account Created</p>
                  <p className="font-medium">{user.createDate}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium">{user.status}</p>
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
                <div className="bg-white p-6 ">
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
                <div className="bg-white p-6 ">
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
                <div className="bg-white p-6 ">
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

          <TabsContent value="payment-methods" className="flex-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold mb-4">Payment Methods</h3>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium">Visa •••• 4242</p>
                    <p className="text-sm text-gray-600">Expires 12/2026</p>
                  </div>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    Default
                  </span>
                </div>
                <div className="p-4 border rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mastercard •••• 8888</p>
                    <p className="text-sm text-gray-600">Expires 08/2027</p>
                  </div>
                </div>
              </div>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add New Payment Method
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
