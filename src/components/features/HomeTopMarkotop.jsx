import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { ArrowUpRight, Sparkles } from "lucide-react";

export const TopMarkotop = ({ events }) => {
  const navigate = useNavigate();

  // 1. Ambil Top 3 Data Saja
  const top3Events = events.slice(0, 3);

  // 2. LOGIKA LOOPING
  const loopedEvents = [...top3Events, ...top3Events, ...top3Events].map(
    (event, index) => ({
      ...event,
      uniqueId: `${event.id}-top-${index}`,
    })
  );

  if (events.length === 0) return null;

  return (
    <div className="w-full py-10">
      <Swiper
        modules={[Autoplay]}
        centeredSlides={true}
        loop={true}
        speed={1000}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          // Mobile
          0: { slidesPerView: 1.25, spaceBetween: 16 },
          // Tablet
          640: { slidesPerView: 2, spaceBetween: 24 },
          // Desktop
          1024: { slidesPerView: 3, spaceBetween: 30 },
        }}
        className="w-full !overflow-visible px-4"
      >
        {loopedEvents.map((event) => (
          <SwiperSlide key={event.uniqueId}>
            {({ isActive }) => (
              <div
                onClick={() => navigate(`/event/${event.id}`)}
                className={`
                  relative group overflow-hidden rounded-[24px] cursor-pointer transition-all duration-500 ease-out
                  h-[320px] md:h-[400px] w-full /* Tinggi fix agar seragam */
                  
                  /* STATE STYLING */
                  ${
                    isActive
                      ? "scale-100 opacity-100 shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-10 ring-1 ring-white/20"
                      : "scale-90 opacity-60 grayscale-[80%] hover:opacity-80 hover:grayscale-[40%]"
                  }
                `}
              >
                {/* 1. FULL BACKGROUND IMAGE */}
                <img
                  src={event.image}
                  alt={event.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* 2. DARK GRADIENT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90"></div>

                {/* 3. HOT BADGE (Top Left) */}
                {isActive && (
                  <div className="absolute top-4 left-4 flex items-center gap-1 bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-red-400/50 animate-pulse">
                    <Sparkles size={12} fill="currentColor" />
                    TOP EVENT
                  </div>
                )}

                {/* 4. CONTENT OVERLAY (Bottom) */}
                <div className="absolute bottom-0 left-0 w-full p-6 flex items-end justify-between">
                  {/* Teks Kiri */}
                  <div className="flex-1 pr-4">
                    <h3
                      className={`font-['Poppins'] font-bold text-white leading-tight mb-1 line-clamp-2 transition-all duration-500 ${
                        isActive ? "text-[22px]" : "text-[18px]"
                      }`}
                    >
                      {event.title}
                    </h3>
                    <p className="text-white/70 text-sm font-medium">
                      {event.organizer}
                    </p>
                  </div>

                  {/* 5. HOVER BUTTON (Bottom Right) */}
                  <div
                    className={`
                        w-10 h-10 rounded-full bg-white text-[#026DA7] flex items-center justify-center shadow-lg
                        transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
                        transition-all duration-300
                    `}
                  >
                    <ArrowUpRight size={20} strokeWidth={2.5} />
                  </div>
                </div>

                {/* Highlight Border saat Active */}
                {isActive && (
                  <div className="absolute inset-0 border-2 border-white/10 rounded-[24px] pointer-events-none"></div>
                )}
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
