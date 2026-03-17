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
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    fade: true,
    pauseOnHover: true,
    cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
    dotsClass: "slick-dots !bottom-6",
    customPaging: () => (
      <div className="w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-all duration-300 shadow-lg" />
    ),
  };

  return (
    <div className="w-full mx-auto relative group">
      <style>{`
        .slick-slider {
          position: relative;
        }

        .slick-dots li button:before {
          display: none;
        }

        .slick-dots li {
          margin: 0 4px;
        }

        .slick-dots li.slick-active > div {
          background: white !important;
          transform: scale(1.2);
        }

        .slick-prev,
        .slick-next {
          width: 48px;
          height: 48px;
          z-index: 20 !important;
          transition: all 0.3s ease;
        }

        .slick-prev {
          left: 20px;
        }

        .slick-next {
          right: 20px;
        }

        .slick-prev:before,
        .slick-next:before {
          font-size: 48px;
          opacity: 0.7;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }

        .slick-prev:hover:before,
        .slick-next:hover:before {
          opacity: 1;
          transform: scale(1.1);
        }

        .slick-disabled {
          opacity: 0.3 !important;
        }
      `}</style>

      <div className="relative rounded-3xl overflow-hidden">
        <Slider {...settings}>
          {banners.map((banner, index) => (
            <div key={banner.id} className="relative w-full overflow-hidden focus:outline-none rounded-3xl">
              <div className="relative aspect-video sm:aspect-21/9">
                <img
                  src={banner.image}
                  alt={`E-Commerce Banner ${index + 1}`}
                  loading={index === 0 ? "eager" : "lazy"}
                  className="w-full h-full object-cover rounded-3xl"
                />

                {/* Subtle gradient overlay for depth */}
                <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default BannerSlider;
