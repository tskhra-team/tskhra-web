import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import slide1 from "@/assets/img/tskhrabooking.png";
import slide2 from "@/assets/img/tskhraecommerce.png";
import slide3 from "@/assets/img/tskhratrade.png";


export const banners = [
  {
    id: 1,
    image: slide1,
    // title: "აირჩიე ადგილი. დაგეგმე დრო."
  },
  {
    id: 2,
    image: slide2,
    // title: "რაც გინდა — აქ არის."
  },
  {
    id: 3,
    image: slide3,
    // title: "გაცვლა ახალ შესაძლებლობად."
  },
];

function BannerSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    fade: false,
  };

  return (
    <div className="w-full mx-auto lg:w-150 lg:mt-20 xl:mt-0 xl:w-full">
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner.id} className="relative w-full overflow-hidden rounded-2xl">
            <img
              src={banner.image}
            //   alt={banner.title}
              className="w-full h-auto rounded-2xl"
            />
            {/* <div className="absolute top-1/2 left-8 md:left-16 -translate-y-1/2 max-w-lg">
              <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-4">
                {banner.title}
              </h2>
            </div> */}
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default BannerSlider;
