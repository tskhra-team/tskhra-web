"use client";

import { ChevronsUpDown, Plus } from "lucide-react";
import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useGetMyBusinesses, {
  type MyBusinessResponse,
} from "@/features/my-businesses/useGetMyBusinesses";
import { useNavigate, useSearchParams } from "react-router-dom";

function BusinessSwitcherComponent() {
  const { isMobile } = useSidebar();
  const [activeBusiness, setActiveBusiness] = React.useState<
    MyBusinessResponse | string
  >("Select Business");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: businesses } = useGetMyBusinesses();
  const businessId = searchParams.get("businessId");

  const handleBusinessSelect = React.useCallback(
    (business: MyBusinessResponse) => {
      setActiveBusiness(business);
      const newParams = new URLSearchParams(searchParams);
      newParams.set("businessId", business.businessId);
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams],
  );

  const businessIds = React.useMemo(
    () => businesses?.map((b) => b.businessId) ?? [],
    [businesses],
  );

  React.useEffect(() => {
    if (businessId && businesses && businesses.length > 0) {
      const isMineBusiness = businessIds.includes(businessId);

      if (!isMineBusiness) {
        const lastBusiness = businesses[businesses.length - 1];
        setActiveBusiness(lastBusiness);
        const newParams = new URLSearchParams(searchParams);
        newParams.set("businessId", lastBusiness.businessId);
        setSearchParams(newParams);
      } else {
        const filtered = businesses.find((b) => b.businessId === businessId);
        if (filtered) {
          setActiveBusiness(filtered);
        }
      }
    }
  }, [businessId, businesses, businessIds, searchParams, setSearchParams]);

  if (!activeBusiness) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {typeof activeBusiness !== "object" ? (
                <div className="grid flex-1 text-left text-lg leading-tight">
                  <span className="truncate font-medium">{activeBusiness}</span>
                </div>
              ) : (
                <>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden">
                    <img
                      src={activeBusiness.mainImage}
                      alt={activeBusiness.businessName}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {activeBusiness.businessName}
                    </span>
                    <span className="truncate text-xs">
                      {activeBusiness.callType.toLowerCase()}
                    </span>
                  </div>
                </>
              )}

              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Businesses
            </DropdownMenuLabel>
            {businesses?.map((business, _index) => (
              <DropdownMenuItem
                key={business.businessId}
                onClick={() => handleBusinessSelect(business)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border overflow-hidden">
                  <img
                    src={business.mainImage}
                    alt={business.businessName}
                    className="size-full object-cover"
                  />
                </div>
                {business.businessName}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div
                className="text-muted-foreground font-medium"
                onClick={() => navigate("/create-business")}
              >
                Add business
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export const BusinessSwitcher = React.memo(BusinessSwitcherComponent);
