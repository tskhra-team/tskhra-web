import CategoriesLayout from "@/shared/categories/Categories";
import Slider from "./../shared/slider/slider";

export default function Ecommerce() {
  return (
    <div className="w-full ">
      <div className="flex  flex-col lg:flex-row gap-4 px-4 py-8">
        <div className="w-full  lg:w-auto lg:shrink-0">
          <CategoriesLayout platform="ecommerce" />
        </div>
        <div className="w-full lg:flex-1 lg:max-w-4xl lg:mx-auto">
          <Slider />
        </div>
      </div>
    </div>
  );
}
