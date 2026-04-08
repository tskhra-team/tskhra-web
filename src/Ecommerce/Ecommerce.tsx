import { Button } from "@/components/ui/button";
import CategoriesLayout from "@/shared/categories/Categories";
import { Filter } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Slider from "./../shared/slider/slider";

export default function Ecommerce() {
  const catalogRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const [hideCategoriesOnMobile, setHideCategoriesOnMobile] = useState(false);

  // Scroll to content when category/subcategory is selected on mobile
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const subcategoryParam = searchParams.get("subcategory");

    if (categoryParam || subcategoryParam) {
      const isMobile = window.innerWidth < 1280;

      if (isMobile) {
        setHideCategoriesOnMobile(true);

        setTimeout(() => {
          catalogRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    } else {
      setHideCategoriesOnMobile(false);
    }
  }, [searchParams]);

  return (
    <div className="relative min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-orange-50/20">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Hero Section with Categories and Slider */}
        <div className="flex flex-col xl:flex-row xl:items-center gap-6 xl:gap-16 px-4 sm:px-4 xl:px-0 pt-0 xl:pt-12 pb-8 container mx-auto">
          {/* Categories Sidebar */}
          <div
            className={`w-full xl:w-72 xl:shrink-0 relative z-100 ${hideCategoriesOnMobile ? "hidden xl:block" : ""}`}
          >
            <div className="w-full">
              <CategoriesLayout platform="ecommerce" />
            </div>
          </div>

          {/* Slider Area */}
          <div className="flex-1 w-full max-w-full xl:max-w-none mx-auto xl:mx-0 relative z-0 min-w-0 overflow-hidden">
            {/* Show Categories Button - only visible on mobile when categories are hidden */}
            {hideCategoriesOnMobile && (
              <Button
                onClick={() => setHideCategoriesOnMobile(false)}
                className="mb-4 xl:hidden flex items-center gap-2"
                variant="outline"
              >
                <Filter className="w-4 h-4" />
                Show Categories
              </Button>
            )}

            <Slider />
          </div>
        </div>

        {/* Content Section */}
        <div
          className="px-4 sm:px-6 xl:px-0 pb-8 container mx-auto"
          ref={catalogRef}
        >
          {/* Ecommerce catalog/content goes here */}
        </div>
      </div>
    </div>
  );
}
