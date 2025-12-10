import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EventCard } from "./EventCard";

export const EventCarousel = ({ events }) => {
  const swiperRef = useRef(null);

  if (!events || events.length === 0) return null;

  return (
    <div className="relative group w-full px-2">
      {" "}
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={1.2}
        speed={600}
        loop={true}
        grabCursor={true}
        breakpoints={{
          640: {
            slidesPerView: 2.2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 24,
          },
        }}
        className="w-full py-4"
      >
        {events.map((event) => (
          <SwiperSlide key={event.id} className="h-auto">
            <EventCard {...event} />
          </SwiperSlide>
        ))}
      </Swiper>
      {/* --- TOMBOL NAVIGASI*/}
      {/* Tombol Kiri */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="flex absolute top-1/2 -left-2 z-20 -translate-y-1/2 
                   w-8 h-8 md:w-10 md:h-10 items-center justify-center rounded-full 
                   bg-white border border-gray-200 shadow-lg text-gray-600 
                   hover:bg-[#026DA7] hover:text-white hover:border-[#026DA7] 
                   transition-all duration-300"
      >
        <ChevronLeft size={20} />
      </button>
      {/* Tombol Kanan */}
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="flex absolute top-1/2 -right-2 z-20 -translate-y-1/2 
                   w-8 h-8 md:w-10 md:h-10 items-center justify-center rounded-full 
                   bg-white border border-gray-200 shadow-lg text-gray-600 
                   hover:bg-[#026DA7] hover:text-white hover:border-[#026DA7] 
                   transition-all duration-300"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
