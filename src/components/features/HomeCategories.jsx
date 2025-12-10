import { useNavigate } from "react-router-dom";
import {
  Music,
  Trophy,
  Briefcase,
  Palette,
  Mic,
  Ticket,
  Dumbbell,
} from "lucide-react";

export const HomeCategories = () => {
  const navigate = useNavigate();

  const categories = [
    { label: "Musik", slug: "music", icon: Music },
    { label: "Pameran", slug: "exhibition", icon: Palette },
    { label: "Teater", slug: "theater", icon: Ticket },
    { label: "Talkshow", slug: "talkshow", icon: Mic },
    { label: "Olahraga", slug: "sports", icon: Dumbbell },
    { label: "Workshop", slug: "workshop", icon: Briefcase },
    { label: "Kompetisi", slug: "competition", icon: Trophy },
  ];

  const handleCategoryClick = (slug) => {
    navigate(`/explore?category=${slug}`);
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. JUDUL SECTION */}
        <h2 className="font-['Poppins'] font-bold text-[24px] text-[#1D3A6B] mb-8 text-left">
          Jelajahi Kategori
        </h2>

        {/* 2. CONTAINER ITEMS */}
        <div
          className="
            flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory 
            /* DESKTOP TWEAK: */
            /* md:justify-between -> Agar icon pertama di kiri mentok, terakhir di kanan mentok, sisanya bagi jarak rata */
            md:flex-wrap md:justify-between md:overflow-visible
            scrollbar-hide
          "
        >
          {categories.map((cat, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(cat.slug)}
              className="group flex flex-col items-center gap-3 min-w-[80px] snap-center cursor-pointer"
            >
              {/* LINGKARAN ICON */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:border-[#026DA7]/30 text-[#026DA7]">
                <cat.icon
                  size={32}
                  className="md:w-10 md:h-10 transition-transform duration-300 group-hover:rotate-12"
                  strokeWidth={2}
                  fill="currentColor"
                  fillOpacity={0.2}
                />
              </div>

              {/* LABEL */}
              <span className="font-['Poppins'] text-[14px] font-medium text-gray-600 group-hover:text-[#026DA7] transition-colors whitespace-nowrap">
                {cat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};
