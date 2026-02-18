import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftRight, CalendarCheck, ShoppingBag } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const buyingHistory = [
  {
    id: "12345",
    date: "2026-01-15",
    product: "Laptop Stand",
    status: "Completed",
    total: "$150.00",
  },
  {
    id: "12344",
    date: "2026-01-10",
    product: "Wireless Mouse",
    status: "Shipped",
    total: "$89.99",
  },
  {
    id: "12343",
    date: "2026-01-05",
    product: "USB Cable",
    status: "Delivered",
    total: "$12.99",
  },
  {
    id: "12345",
    date: "2026-01-15",
    product: "Laptop Stand",
    status: "Completed",
    total: "$150.00",
  },
  {
    id: "12344",
    date: "2026-01-10",
    product: "Wireless Mouse",
    status: "Shipped",
    total: "$89.99",
  },
  {
    id: "12343",
    date: "2026-01-05",
    product: "USB Cable",
    status: "Delivered",
    total: "$12.99",
  },
  {
    id: "12345",
    date: "2026-01-15",
    product: "Laptop Stand",
    status: "Completed",
    total: "$150.00",
  },
  {
    id: "12344",
    date: "2026-01-10",
    product: "Wireless Mouse",
    status: "Shipped",
    total: "$89.99",
  },
];

const bookingHistory = [
  {
    id: "BK789",
    date: "2026-01-20",
    service: "Photography Session",
    duration: "2 hours",
    status: "Confirmed",
    total: "$200.00",
  },
  {
    id: "BK788",
    date: "2026-01-12",
    service: "Business Consultation",
    duration: "1 hour",
    status: "Completed",
    total: "$50.00",
  },
  {
    id: "BK787",
    date: "2026-01-03",
    service: "Dental Checkup",
    duration: "30 minutes",
    status: "Completed",
    total: "$75.00",
  },
  {
    id: "BK787",
    date: "2026-01-03",
    service: "Dental Checkup",
    duration: "30 minutes",
    status: "Completed",
    total: "$75.00",
  },
];

const swappingHistory = [
  {
    id: "SW456",
    date: "2026-01-18",
    yourItem: "Gaming Keyboard",
    receivedItem: "Mechanical Keyboard",
    status: "Completed",
  },
  {
    id: "SW455",
    date: "2026-01-08",
    yourItem: "Headphones",
    receivedItem: "Speakers",
    status: "In Progress",
  },
];

const ITEMS_PER_PAGE = 3;

export default function HistoryTab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "buying";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const handleTabChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", value);
    newParams.set("page", "1"); // Reset to page 1 when changing tabs
    setSearchParams(newParams);
  };

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    setSearchParams(newParams);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  // Get current items based on tab and page
  const getCurrentItems = (items: any[]) => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return items.slice(startIndex, endIndex);
  };

  const getTotalPages = (items: any[]) => {
    return Math.ceil(items.length / ITEMS_PER_PAGE);
  };

  return (
    <div className="bg-linear-to-br from-gray-50 to-blue-50/30 px-4 md:px-6 py-8 rounded-2xl">
      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        orientation="horizontal"
      >
        <div className="flex justify-center mb-6">
          <TabsList style={{ flexDirection: "row" }}>
            <TabsTrigger
              value="buying"
              className="px-5 py-4 flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Buying
            </TabsTrigger>
            <TabsTrigger
              value="booking"
              className="px-5 py-4 flex items-center gap-2"
            >
              <CalendarCheck className="w-4 h-4" />
              Booking
            </TabsTrigger>
            <TabsTrigger
              value="swapping"
              className="px-5 py-4 flex items-center gap-2"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Swapping
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="buying">
          <div className="space-y-4 mb-6">
            {getCurrentItems(buyingHistory).map((order) => (
              <div
                key={order.id}
                className="p-5 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-shadow duration-200"
              >
                <p className="font-semibold text-lg text-gray-900 mb-3">
                  Order #{order.id}
                </p>
                <div className="space-y-1.5">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Date:</span> {order.date}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Product:</span>{" "}
                    {order.product}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Status:</span> {order.status}
                  </p>
                  <p className="text-base font-semibold text-gray-900 mt-3">
                    Total: {order.total}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {getTotalPages(buyingHistory) > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                {Array.from(
                  { length: getTotalPages(buyingHistory) },
                  (_, i) => i + 1,
                ).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(
                        Math.min(getTotalPages(buyingHistory), currentPage + 1),
                      )
                    }
                    className={
                      currentPage === getTotalPages(buyingHistory)
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </TabsContent>

        <TabsContent value="booking">
          <div className="space-y-4 mb-6">
            {getCurrentItems(bookingHistory).map((booking) => (
              <div
                key={booking.id}
                className="p-5 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-shadow duration-200"
              >
                <p className="font-semibold text-lg text-gray-900 mb-3">
                  Booking #{booking.id}
                </p>
                <div className="space-y-1.5">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Date:</span> {booking.date}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Service:</span>{" "}
                    {booking.service}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Duration:</span>{" "}
                    {booking.duration}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Status:</span>{" "}
                    {booking.status}
                  </p>
                  <p className="text-base font-semibold text-gray-900 mt-3">
                    Total: {booking.total}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {getTotalPages(bookingHistory) > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                {Array.from(
                  { length: getTotalPages(bookingHistory) },
                  (_, i) => i + 1,
                ).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(
                        Math.min(
                          getTotalPages(bookingHistory),
                          currentPage + 1,
                        ),
                      )
                    }
                    className={
                      currentPage === getTotalPages(bookingHistory)
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </TabsContent>

        <TabsContent value="swapping">
          <div className="space-y-4 mb-6">
            {getCurrentItems(swappingHistory).map((swap) => (
              <div
                key={swap.id}
                className="p-5 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-shadow duration-200"
              >
                <p className="font-semibold text-lg text-gray-900 mb-3">
                  Swap #{swap.id}
                </p>
                <div className="space-y-1.5">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Date:</span> {swap.date}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Your Item:</span>{" "}
                    {swap.yourItem}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Received Item:</span>{" "}
                    {swap.receivedItem}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Status:</span> {swap.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {getTotalPages(swappingHistory) > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                {Array.from(
                  { length: getTotalPages(swappingHistory) },
                  (_, i) => i + 1,
                ).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(
                        Math.min(
                          getTotalPages(swappingHistory),
                          currentPage + 1,
                        ),
                      )
                    }
                    className={
                      currentPage === getTotalPages(swappingHistory)
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
