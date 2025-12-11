import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import {
  Ticket,
  Calendar,
  MapPin,
  QrCode,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const TicketList = ({ onSelectTicket }) => {
  const navigate = useNavigate();

  // --- STATE DARI LOGIKA BACKEND ---
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // --- FETCHING DATA ---
  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        // Menggunakan endpoint dari backend: /tickets/mine
        const { data } = await api.get("/tickets/mine", {
          params: { page, limit: 5 }, // Limit 5 tiket per halaman
        });

        // Menangani struktur response (data.data atau data)
        const ticketList = data.data || data;
        setTickets(Array.isArray(ticketList) ? ticketList : []);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch tickets", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [page]);

  // --- HELPER FORMATTING ---
  const formatDate = (dateString) => {
    if (!dateString) return "Tanggal -";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "--:--";
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // --- SKELETON LOADING ---
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 bg-gray-200 rounded-2xl animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  // --- EMPTY STATE ---
  if (tickets.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
          <Ticket size={32} />
        </div>
        <h3 className="text-gray-800 font-bold mb-1">Belum ada tiket</h3>
        <p className="text-gray-500 text-sm mb-6">
          Tiket yang sudah dibayar akan muncul di sini.
        </p>
        <button
          onClick={() => navigate("/explore")}
          className="px-6 py-2.5 bg-[#026DA7] text-white font-bold rounded-xl text-sm shadow-md hover:bg-[#025a8a] transition-all"
        >
          Jelajah Event
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* LIST TIKET */}
      <div className="space-y-4">
        {tickets.map((ticket) => {
          // Fallback Image
          const eventImage =
            ticket.event_image ||
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80";

          return (
            <div
              key={ticket.id}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-5 items-center group relative overflow-hidden"
            >
              {/* Garis Status */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  ticket.is_used ? "bg-gray-400" : "bg-[#026DA7]"
                }`}
              ></div>

              {/* 1. GAMBAR EVENT */}
              <div className="w-full md:w-32 h-32 shrink-0 rounded-xl overflow-hidden bg-gray-100 ml-2 relative">
                <img
                  src={eventImage}
                  alt={ticket.event_title}
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    ticket.is_used
                      ? "grayscale opacity-70"
                      : "group-hover:scale-110"
                  }`}
                />
                {/* Badge Status di Gambar */}
                {ticket.is_used && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold uppercase border border-white px-2 py-1 rounded">
                      Terpakai
                    </span>
                  </div>
                )}
              </div>

              {/* 2. INFO DETAIL */}
              <div className="flex-1 w-full text-center md:text-left space-y-2">
                <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
                  {ticket.event_title || "Nama Event"}
                </h3>

                {/* Badge Kategori & Kode */}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="inline-block bg-blue-50 text-[#026DA7] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                    {ticket.category_name}
                  </span>
                  <span className="inline-block bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-mono border border-gray-200">
                    CODE: {ticket.ticket_code}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-sm text-gray-500 justify-center md:justify-start pt-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-[#026DA7]" />
                    {formatDate(ticket.start_time)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-[#026DA7]" />
                    {formatTime(ticket.start_time)} WIB
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-sm text-gray-500 justify-center md:justify-start">
                  <MapPin size={14} className="text-[#026DA7]" />
                  <span className="truncate max-w-[200px]">
                    {ticket.venue_name || "Lokasi Event"}
                  </span>
                </div>
              </div>

              {/* 3. ACTION BUTTON (Lihat QR) */}
              <div className="w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-5 flex justify-center">
                <button
                  onClick={() => onSelectTicket(ticket.id)}
                  disabled={ticket.is_used}
                  className="flex flex-col items-center gap-2 group/btn cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="bg-white p-2.5 rounded-xl border-2 border-dashed border-gray-300 group-hover/btn:border-[#026DA7] group-hover/btn:bg-blue-50 transition-colors">
                    <QrCode
                      size={28}
                      className="text-gray-400 group-hover/btn:text-[#026DA7] transition-colors"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 group-hover/btn:text-[#026DA7] uppercase tracking-wider">
                    Lihat QR
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-full border border-gray-200 hover:bg-white hover:text-[#026DA7] hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-gray-50 text-gray-500"
          >
            <ChevronLeft size={20} />
          </button>

          <span className="text-sm font-medium text-gray-600 bg-white px-4 py-1 rounded-full border border-gray-100 shadow-sm">
            Hal {page} dari {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-full border border-gray-200 hover:bg-white hover:text-[#026DA7] hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-gray-50 text-gray-500"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};
