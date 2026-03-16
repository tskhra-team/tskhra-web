import BusinessCatalog from "@/Booking/BusinessCatalog";
import CategoriesLayout from "@/shared/categories/Categories";
import Slider from "./../shared/slider/slider";
import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

export default function Booking() {
  const catalogRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const [hideCategoriesOnMobile, setHideCategoriesOnMobile] = useState(false);

  // Scroll to catalog when category/subcategory is selected on mobile
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const subcategoryParam = searchParams.get('subcategory');

    if (categoryParam || subcategoryParam) {
      // Check if we're on mobile (< 1024px which is the lg breakpoint)
      const isMobile = window.innerWidth < 1024;

      if (isMobile) {
        setHideCategoriesOnMobile(true);

        // Scroll to catalog with a slight delay to ensure rendering
        setTimeout(() => {
          catalogRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    } else {
      // Reset when filters are cleared
      setHideCategoriesOnMobile(false);
    }
  }, [searchParams]);

  return (
    <div className="relative min-h-screen bg-linear-to-br from-slate-50 via-orange-50/30 to-red-50/20">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8 py-8 lg:py-12 container mx-auto">
        {/* Categories Sidebar */}
        <div className={`w-full lg:w-64 xl:w-72 lg:shrink-0 relative z-50 ${hideCategoriesOnMobile ? 'hidden lg:block' : ''}`}>
          <div className="sticky top-8">
            <CategoriesLayout platform="booking" />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full lg:max-w-none mx-auto lg:mx-0 relative z-0 min-w-0" ref={catalogRef}>
          {/* Show Categories Button - only visible on mobile when categories are hidden */}
          {hideCategoriesOnMobile && (
            <Button
              onClick={() => setHideCategoriesOnMobile(false)}
              className="mb-4 lg:hidden flex items-center gap-2"
              variant="outline"
            >
              <Filter className="w-4 h-4" />
              Show Categories
            </Button>
          )}

          <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-6 sm:p-8 lg:p-10 mb-8">
            <Slider />
          </div>
          <BusinessCatalog />
        </div>
      </div>
    </div>
  );
}
