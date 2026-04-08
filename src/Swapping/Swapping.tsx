import CategoriesLayout from "@/shared/categories/Categories";
import { Outlet, useLocation } from "react-router-dom";
import Slider from "./../shared/slider/slider";

export default function Swapping() {
  const location = useLocation();

  const isRoot =
    location.pathname === "/swapping" || location.pathname === "/swapping/";

  return (
    <div className="relative min-h-screen bg-linear-to-br from-slate-50 via-red-50/30 to-rose-50/20">
      {/* Фон */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-red-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-rose-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-7xl mx-auto">
        {isRoot ? (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="w-full lg:w-72 xl:w-80 lg:shrink-0">
              <div className="sticky top-24">
                <CategoriesLayout platform="swapping" />
              </div>
            </div>
            <div className="flex-1 w-full max-w-5xl">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-6 sm:p-8">
                <Slider />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full animate-in fade-in duration-500">
            <Outlet />
          </div>
        )}
      </div>
    </div>
  );
}
