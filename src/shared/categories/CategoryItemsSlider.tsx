import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import type { CategoryItem } from "./types";

const gradients = [
  "from-pink-400 via-rose-500 to-red-500",
  "from-blue-500 via-purple-500 to-pink-500",
  "from-orange-400 via-red-500 to-pink-500",
  "from-green-400 via-teal-500 to-blue-500",
  "from-yellow-400 via-orange-500 to-red-500",
  "from-indigo-400 via-purple-500 to-pink-500",
  "from-cyan-400 via-blue-500 to-indigo-500",
  "from-rose-400 via-pink-500 to-purple-500",
  "from-amber-400 via-orange-500 to-red-500",
  "from-violet-400 via-purple-500 to-fuchsia-500",
  "from-emerald-400 via-green-500 to-teal-500",
  "from-fuchsia-400 via-pink-500 to-rose-500",
];

const emojis = ["🌸", "⭐", "💖", "✨", "🦋", "🌺", "💫", "🌈", "🎀", "💝"];

interface CategoryItemsSliderProps {
  items: CategoryItem[];
  categoryName: string;
}

export default function CategoryItemsSlider({ items, categoryName }: CategoryItemsSliderProps) {
  const settings = {
    dots: true,
    infinite: items.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: true,
    fade: false,
  };

  return (
    <div className="w-full h-full">
      <Slider {...settings}>
        {items.map((item, index) => {
          const gradient = gradients[index % gradients.length];
          const emoji = emojis[index % emojis.length];

          return (
            <div key={item.name} className="outline-none">
              <a
                href={item.url || "#"}
                className="block relative w-full h-80 md:h-96 overflow-hidden rounded-2xl"
              >
                <div
                  className={`w-full h-full bg-linear-to-br ${gradient} flex items-center justify-center relative overflow-hidden transition-transform hover:scale-105`}
                >
                  {/* Decorative floating elements */}
                  <div className="absolute top-8 right-8 text-4xl opacity-20 animate-bounce">
                    {emoji}
                  </div>
                  <div className="absolute bottom-8 left-8 text-3xl opacity-20 animate-pulse">
                    {emojis[(index + 1) % emojis.length]}
                  </div>
                  <div className="absolute top-1/3 left-1/4 text-2xl opacity-10">
                    {emojis[(index + 2) % emojis.length]}
                  </div>
                  <div className="absolute bottom-1/3 right-1/4 text-2xl opacity-10">
                    {emojis[(index + 3) % emojis.length]}
                  </div>

                  {/* Content */}
                  <div className="relative z-10 text-center px-8">
                    {item.imageUrl && (
                      <div className="mb-4 flex justify-center">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          loading={index === 0 ? "eager" : "lazy"}
                          width={128}
                          height={128}
                          className="h-32 w-32 object-contain drop-shadow-2xl"
                        />
                      </div>
                    )}
                    <h3 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg mb-2">
                      {item.name}
                    </h3>
                    <p className="text-sm md:text-base text-white/90 font-medium drop-shadow">
                      {categoryName}
                    </p>
                  </div>
                </div>
              </a>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}
