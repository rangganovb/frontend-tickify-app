import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Pagination,
  Navigation,
  EffectCoverflow,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

import { ChevronLeft, ChevronRight } from "lucide-react";

import banner1 from "../../assets/images/banner-1.png";
import banner2 from "../../assets/images/banner-2.png";
import banner3 from "../../assets/images/banner-3.png";

const rawSlides = [
  { id: 1, image: banner1, alt: "Banner 1" },
  { id: 2, image: banner2, alt: "Banner 2" },
  { id: 3, image: banner3, alt: "Banner 3" },
];

const slides = [...rawSlides, ...rawSlides].map((slide, index) => ({
  ...slide,
  uniqueId: `${slide.id}-${index}`,
}));

export const HomeCarousel = () => {
  const swiperRef = useRef(null);

  return (
    <div className="relative group w-full">
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        modules={[Autoplay, Pagination, Navigation, EffectCoverflow]}
        effect={"coverflow"}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 150,
          modifier: 1,
          slideShadows: false,
        }}
        spaceBetween={0}
        slidesPerView={1.15}
        centeredSlides={true}
        loop={true}
        speed={800}
        breakpoints={{
          640: { slidesPerView: 1.3 },
          1024: { slidesPerView: 1.5 }, // Desktop view
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
          dynamicBullets: true,
        }}
        className="w-full py-4"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.uniqueId} className="relative px-2 md:px-4">
            {({ isActive }) => (
              <div
                className={`
                  relative overflow-hidden 
                  rounded-[12px] md:rounded-[20px] 
                  // Shadow agak dipertegas agar tumpukannya terlihat
                  shadow-lg
                  transition-all duration-500 ease-out
                  
                  /* === 5. HAPUS SKALA MANUAL === */
                  /* Kita hapus 'scale' dan 'ring' manual, biarkan Coverflow yang mengurusnya. */
                  /* Kita hanya mainkan Opacity dan Z-Index agar yang tengah paling jelas dan di depan. */
                  ${isActive ? "opacity-100 z-20" : "opacity-60 z-10"}
                  
                  w-full
                  aspect-[3.11/1]
                `}
              >
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* --- NAVIGASI HOVER --- */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className={`
          absolute top-1/2 z-30 -translate-y-1/2
          flex items-center justify-center
          rounded-full bg-white/30 backdrop-blur-md border border-white/40 text-white shadow-lg
          transition-all duration-300 hover:bg-[#026DA7]
          left-2 p-1.5 md:left-52 md:p-3
          opacity-0 group-hover:opacity-100
        `}
      >
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
      </button>

      <button
        onClick={() => swiperRef.current?.slideNext()}
        className={`
          absolute top-1/2 z-30 -translate-y-1/2
          flex items-center justify-center
          rounded-full bg-white/30 backdrop-blur-md border border-white/40 text-white shadow-lg
          transition-all duration-300 hover:bg-[#026DA7]
          right-2 p-1.5 md:right-52 md:p-3
          opacity-0 group-hover:opacity-100
        `}
      >
        <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
      </button>

      <div className="custom-pagination absolute !bottom-0 left-0 right-0 z-30 flex justify-center gap-1.5 pointer-events-none"></div>

      <style jsx>{`
        .swiper-pagination-bullet {
          background: #d1d5db;
          opacity: 1;
          width: 6px;
          height: 6px;
          transition: all 0.3s;
        }
        .swiper-pagination-bullet-active {
          background: #026da7;
          width: 18px;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};
