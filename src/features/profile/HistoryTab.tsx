import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  ArrowLeftRight,
  CalendarCheck,
  Search,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";
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
    id: "12346",
    date: "2026-01-15",
    product: "Laptop Stand",
    status: "Completed",
    total: "$150.00",
  },
  {
    id: "12348",
    date: "2026-01-10",
    product: "Wireless Mouse",
    status: "Shipped",
    total: "$89.99",
  },
  {
    id: "12342",
    date: "2026-01-05",
    product: "USB Cable",
    status: "Delivered",
    total: "$12.99",
  },
  {
    id: "12347",
    date: "2026-01-15",
    product: "Laptop Stand",
    status: "Completed",
    total: "$150.00",
  },
  {
    id: "12349",
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
    id: "BK786",
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

type ServiceType = "buying" | "booking" | "swapping";

type TimelineItem = {
  id: string;
  date: string;
  serviceType: ServiceType;
} & (
  | { serviceType: "buying"; product: string; status: string; total: string }
  | {
      serviceType: "booking";
      service: string;
      duration: string;
      status: string;
      total: string;
    }
  | {
      serviceType: "swapping";
      yourItem: string;
      receivedItem: string;
      status: string;
    }
);

export default function HistoryTab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const activeTab = (searchParams.get("type") as ServiceType) || "booking";

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState({ min: "", max: "" });
  const [dateFilter, setDateFilter] = useState<
    "all" | "week" | "month" | "year"
  >("all");

  // Helper to parse price strings like "$150.00"
  const parsePrice = (total: string) => {
    return parseFloat(total.replace(/[^0-9.]/g, "")) || 0;
  };

  // Get history for active tab
  const getTabHistory = (): TimelineItem[] => {
    switch (activeTab) {
      case "booking":
        return bookingHistory.map((item) => ({
          ...item,
          serviceType: "booking" as const,
        }));
      case "buying":
        return buyingHistory.map((item) => ({
          ...item,
          serviceType: "buying" as const,
        }));
      case "swapping":
        return swappingHistory.map((item) => ({
          ...item,
          serviceType: "swapping" as const,
        }));
    }
  };

  // Filter function
  const getFilteredHistory = () => {
    return getTabHistory()
      .filter((item) => {
        // Date filter
        if (dateFilter !== "all") {
          const itemDate = new Date(item.date);
          const now = new Date();
          const diffDays = Math.floor(
            (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24),
          );

          if (dateFilter === "week" && diffDays > 7) return false;
          if (dateFilter === "month" && diffDays > 30) return false;
          if (dateFilter === "year" && diffDays > 365) return false;
        }

        // Price filter (only for booking and buying)
        if ((priceFilter.min || priceFilter.max) && "total" in item) {
          const price = parsePrice(item.total);
          if (priceFilter.min && price < parseFloat(priceFilter.min))
            return false;
          if (priceFilter.max && price > parseFloat(priceFilter.max))
            return false;
        }

        // Search query filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const searchableText = [
            item.id,
            "product" in item ? item.product : "",
            "service" in item ? item.service : "",
            "yourItem" in item ? item.yourItem : "",
            "receivedItem" in item ? item.receivedItem : "",
          ]
            .join(" ")
            .toLowerCase();

          if (!searchableText.includes(query)) return false;
        }

        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const filteredHistory = getFilteredHistory();

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

  const handleTabChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("type", value);
    newParams.set("page", "1");
    setSearchParams(newParams);
    // Reset filters when changing tabs
    setSearchQuery("");
    setPriceFilter({ min: "", max: "" });
    setDateFilter("all");
  };

  // Get current items based on page
  const getCurrentItems = (items: TimelineItem[]) => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return items.slice(startIndex, endIndex);
  };

  const getTotalPages = (items: TimelineItem[]) => {
    return Math.ceil(items.length / ITEMS_PER_PAGE);
  };

  // Helper functions for service icons and labels
  const getServiceIcon = (type: ServiceType) => {
    switch (type) {
      case "booking":
        return <CalendarCheck className="w-5 h-5 text-orange-600" />;
      case "buying":
        return <ShoppingBag className="w-5 h-5 text-blue-600" />;
      case "swapping":
        return <ArrowLeftRight className="w-5 h-5 text-red-600" />;
    }
  };

  const getServiceLabel = (type: ServiceType) => {
    switch (type) {
      case "booking":
        return "Booking";
      case "buying":
        return "Purchase";
      case "swapping":
        return "Swap";
    }
  };

  const renderServiceDetails = (item: TimelineItem) => {
    switch (item.serviceType) {
      case "buying":
        return (
          <div className="space-y-1">
            <p className="font-semibold text-sm text-foreground">
              Order #{item.id}
            </p>
            <p className="text-sm text-muted-foreground">{item.product}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
              <span>Status: {item.status}</span>
              <span className="font-medium text-foreground">{item.total}</span>
            </div>
          </div>
        );
      case "booking":
        return (
          <div className="space-y-1">
            <p className="font-semibold text-sm text-foreground">
              Booking #{item.id}
            </p>
            <p className="text-sm text-muted-foreground">{item.service}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
              <span>{item.duration}</span>
              <span>Status: {item.status}</span>
              <span className="font-medium text-foreground">{item.total}</span>
            </div>
          </div>
        );
      case "swapping":
        return (
          <div className="space-y-1">
            <p className="font-semibold text-sm text-foreground">
              Swap #{item.id}
            </p>
            <p className="text-sm text-muted-foreground">
              {item.yourItem} → {item.receivedItem}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
              <span>Status: {item.status}</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-transparent px-4 md:px-6 py-8">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        {/* Horizontal Tabs */}
        <TabsList
          style={{ padding: "0" }}
          className="w-full bg-white border border-slate-200 rounded-xl p-1 mb-6 grid grid-cols-3"
        >
          <TabsTrigger
            value="booking"
            className="data-[state=active]:bg-linear-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all rounded-xl "
          >
            <CalendarCheck className="w-4 h-4 mr-2" />
            Booking
          </TabsTrigger>
          <TabsTrigger
            value="buying"
            className="data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all rounded-xl"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Ecommerce
          </TabsTrigger>
          <TabsTrigger
            value="swapping"
            className="data-[state=active]:bg-linear-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all rounded-xl"
          >
            <ArrowLeftRight className="w-4 h-4 mr-2" />
            Swapping
          </TabsTrigger>
        </TabsList>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 tracking-tight mb-4">
            Filters
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by ID, product, service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 focus:ring-indigo-600 focus:border-indigo-600 border-slate-300"
              />
            </div>

            {/* Price filter (only for booking and buying) */}
            {activeTab !== "swapping" && (
              <>
                <Input
                  type="number"
                  placeholder="Min Price"
                  value={priceFilter.min}
                  onChange={(e) =>
                    setPriceFilter({ ...priceFilter, min: e.target.value })
                  }
                  className="w-full sm:w-32 focus:ring-indigo-600 focus:border-indigo-600 border-slate-300"
                />
                <Input
                  type="number"
                  placeholder="Max Price"
                  value={priceFilter.max}
                  onChange={(e) =>
                    setPriceFilter({ ...priceFilter, max: e.target.value })
                  }
                  className="w-full sm:w-32 focus:ring-indigo-600 focus:border-indigo-600 border-slate-300"
                />
              </>
            )}

            {/* Date filter */}
            <Select
              value={dateFilter}
              onValueChange={(value) =>
                setDateFilter(value as "all" | "week" | "month" | "year")
              }
            >
              <SelectTrigger
                style={{ height: "44px" }}
                className="w-full sm:w-40 focus:ring-indigo-600 focus:border-indigo-600 border-slate-300"
              >
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear filters button */}
            {(searchQuery ||
              priceFilter.min ||
              priceFilter.max ||
              dateFilter !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setPriceFilter({ min: "", max: "" });
                  setDateFilter("all");
                }}
                className="hover:bg-slate-50 h-11"
              >
                Clear
              </Button>
            )}
          </div>

          {/* Results count */}
          <p className="text-sm text-slate-500 mt-4">
            Showing {filteredHistory.length} of {getTabHistory().length} items
          </p>
        </div>

        {/* Tab Content - Same for all tabs since filtering is done above */}
        <TabsContent value={activeTab} className="mt-0">
          {/* History List */}
          <div className="space-y-3">
            {getCurrentItems(filteredHistory).map((item) => (
              <div
                key={`${item.serviceType}-${item.id}`}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-linear-to-br from-indigo-50 to-indigo-100 rounded-lg group-hover:from-indigo-200 transition-colors">
                      {getServiceIcon(item.serviceType)}
                    </div>
                    <span className="text-sm font-medium text-slate-600">
                      {getServiceLabel(item.serviceType)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">{item.date}</span>
                </div>

                {renderServiceDetails(item)}
              </div>
            ))}

            {filteredHistory.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-500">
                  No items found matching your filters.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {getTotalPages(filteredHistory) > 1 && (
            <Pagination className="mt-6">
              <PaginationContent className="bg-white border border-slate-200 rounded-xl p-3">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer hover:bg-slate-50"
                    }
                  />
                </PaginationItem>
                {Array.from(
                  { length: getTotalPages(filteredHistory) },
                  (_, i) => i + 1,
                ).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className={cn(
                        "cursor-pointer transition-colors duration-200",
                        currentPage === page
                          ? "bg-linear-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800"
                          : "hover:bg-slate-50 hover:text-indigo-700",
                      )}
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
                          getTotalPages(filteredHistory),
                          currentPage + 1,
                        ),
                      )
                    }
                    className={
                      currentPage === getTotalPages(filteredHistory)
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer hover:bg-slate-50"
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
