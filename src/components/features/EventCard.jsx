import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";

export const EventCard = ({ id, title, date, price, image, organizer }) => {
  const navigate = useNavigate();

  // Helper Format Rupiah
  const formatRupiah = (number) => {
    if (number === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  // Helper Format Tanggal
  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <div
      onClick={() => navigate(`/event/${id}`)}
      className="group h-full flex flex-col bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
    >
      {/* 1. IMAGE SECTION (Wide Aspect Ratio 16:9) */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient halus saat hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      {/* 2. CONTENT BODY */}
      <div className="p-4 flex flex-col flex-1">
        <h3
          className="font-['Poppins'] font-bold text-[16px] leading-tight text-[#1D3A6B] truncate mb-2"
          title={title}
        >
          {title}
        </h3>

        {/* --- TANGGAL (Date) --- */}
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-4">
          <Calendar size={18} className="text-[#026DA7]" />
          <span>{formatDate(date)}</span>
        </div>

        {/* --- HARGA (Price) --- */}
        <div className="mt-auto font-['Poppins'] font-bold text-[16px] text-[#026DA7] mb-4">
          {formatRupiah(price)}
        </div>

        {/* --- FOOTER (Organizer) --- */}
        <div className="pt-3 border-t border-dashed border-gray-200 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#026DA7] font-bold text-[10px] shrink-0">
            {organizer ? organizer.substring(0, 2).toUpperCase() : "EO"}
          </div>
          <span className="font-['Poppins'] text-xs text-gray-500 truncate">
            {organizer || "Unknown Organizer"}
          </span>
        </div>
      </div>
    </div>
  );
};
