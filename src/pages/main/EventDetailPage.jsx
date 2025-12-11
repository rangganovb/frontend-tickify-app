import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { eventService } from "../../services/eventServices";
import {
  Calendar,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- STATE UTAMA ---
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATE TRANSAKSI ---
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [ticketQty, setTicketQty] = useState(1);

  // --- 1. PENGAMBILAN DATA (API) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Eksekusi request secara paralel untuk performa
        const [eventData, ticketData] = await Promise.all([
          eventService.getEventById(id), // Detail Event
          eventService.getTicketsByEvent(id), // List Tiket (PERBAIKAN NAMA FUNGSI)
        ]);

        setEvent(eventData);
        setTickets(ticketData);

        // Otomatis pilih tiket pertama yang stoknya tersedia
        if (ticketData && ticketData.length > 0) {
          const availableTicket = ticketData.find(
            (t) => t.quota - (t.sold || 0) > 0
          );
          setSelectedTicketId(
            availableTicket ? availableTicket.id : ticketData[0].id
          );
        }
      } catch (error) {
        console.error("Gagal memuat data:", error);
        toast.error("Detail event tidak ditemukan");
        navigate("/explore");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  // Helper: Ambil data tiket yang sedang dipilih
  const selectedTicketData = tickets.find((t) => t.id === selectedTicketId);

  // --- 2. HANDLER JUMLAH TIKET ---
  const handleQty = (type) => {
    if (!selectedTicketData) return;

    const availableStock =
      selectedTicketData.quota - (selectedTicketData.sold || 0);
    const maxLimit = Math.min(availableStock, 5); // Batasi maks 5 tiket per transaksi

    if (type === "inc" && ticketQty < maxLimit) setTicketQty(ticketQty + 1);
    if (type === "dec" && ticketQty > 1) setTicketQty(ticketQty - 1);
  };

  // --- 3. FORMATTER & UTILS ---
  const formatRupiah = (price) => {
    let numericPrice = parseFloat(price);
    if (numericPrice < 1000) numericPrice *= 1000; // Normalisasi harga

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericPrice);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // --- 4. PROSES CHECKOUT ---
  const handleBuy = () => {
    // Validasi input
    if (!selectedTicketData) return toast.error("Mohon pilih jenis tiket");

    // Validasi login
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Silakan login untuk melanjutkan");
      navigate("/login");
      return;
    }

    // Kalkulasi total harga
    const numericPrice =
      parseFloat(selectedTicketData.price) < 1000
        ? parseFloat(selectedTicketData.price) * 1000
        : parseFloat(selectedTicketData.price);

    const totalPrice = numericPrice * ticketQty;

    // Redirect ke halaman checkout dengan membawa data
    navigate("/checkout", {
      state: {
        event: {
          title: event.title,
          date: formatDate(event.date),
          time: event.time,
          venue: event.venue,
          location: event.location,
          image: event.image,
        },
        ticket: selectedTicketData,
        qty: ticketQty,
        totalPrice: totalPrice,
      },
    });
  };

  // --- TAMPILAN LOADING ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 flex flex-col font-['Poppins']">
        <Navbar />
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-24">
          <div className="mb-8">
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="w-full h-[250px] md:h-[400px] bg-gray-200 rounded-2xl animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-8 space-y-8">
              <div className="h-8 md:h-10 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-[400px] animate-pulse"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!event) return null;

  // --- TAMPILAN UTAMA ---
  return (
    <div className="min-h-screen bg-gray-50 pt-28 flex flex-col font-['Poppins']">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-24">
        {/* Breadcrumb & Hero Image */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span
              className="cursor-pointer hover:text-[#026DA7]"
              onClick={() => navigate("/home")}
            >
              Beranda
            </span>
            <span>/</span>
            <span className="text-[#026DA7] font-medium truncate max-w-[200px]">
              {event.title}
            </span>
          </div>

          <div className="relative w-full h-[250px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg group">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[#026DA7] text-xs font-bold uppercase tracking-wider shadow-sm">
              {event.category}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* KOLOM KIRI: Detail Event */}
          <div className="lg:col-span-8 space-y-8 animate-fade-in-left">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                {event.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                <span>Diselenggarakan oleh</span>
                <span className="font-bold text-[#026DA7] flex items-center gap-1">
                  <ShieldCheck size={14} /> {event.organizer}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 py-4 border-y border-gray-100">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#026DA7] shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wide">
                      Tanggal
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {formatDate(event.date)}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                      <Clock size={10} /> {event.time} WIB
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#026DA7] shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wide">
                      Lokasi
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {event.venue}
                    </p>
                    <p className="text-xs text-gray-500">{event.location}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="prose max-w-none text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Deskripsi Event
              </h3>
              {event.description}
            </div>
          </div>

          {/* KOLOM KANAN: Kartu Pembelian (Sticky) */}
          <div className="lg:col-span-4 animate-fade-in-right">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-28">
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Total Harga</p>
                <h3 className="text-3xl font-bold text-[#026DA7]">
                  {selectedTicketData
                    ? formatRupiah(
                        parseFloat(selectedTicketData.price) * ticketQty
                      )
                    : "Rp 0"}
                </h3>
              </div>

              {/* List Pilihan Tiket */}
              <div className="space-y-3 mb-6">
                <p className="text-sm font-bold text-gray-800">Pilih Tiket</p>

                {tickets.length > 0 ? (
                  tickets.map((ticket) => {
                    const isSelected = selectedTicketId === ticket.id;
                    const available = ticket.quota - (ticket.sold || 0);
                    const isSoldOut = available <= 0;

                    return (
                      <div
                        key={ticket.id}
                        onClick={() =>
                          !isSoldOut && setSelectedTicketId(ticket.id)
                        }
                        className={`
                            border rounded-xl p-3 cursor-pointer transition-all relative
                            ${
                              isSelected
                                ? "border-[#026DA7] bg-blue-50 ring-1 ring-[#026DA7]"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                            }
                            ${
                              isSoldOut
                                ? "opacity-50 cursor-not-allowed bg-gray-50"
                                : ""
                            }
                        `}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p
                              className={`font-bold text-sm ${
                                isSelected ? "text-[#026DA7]" : "text-gray-700"
                              }`}
                            >
                              {ticket.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Sisa: {available}
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-bold text-sm ${
                                isSelected ? "text-[#026DA7]" : "text-gray-800"
                              }`}
                            >
                              {formatRupiah(ticket.price)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center border border-dashed rounded-xl text-gray-400 text-sm">
                    Tiket belum tersedia
                  </div>
                )}
              </div>

              {/* Kontrol Jumlah */}
              {selectedTicketData && (
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl mb-6">
                  <span className="text-sm font-medium text-gray-700">
                    Jumlah
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQty("dec")}
                      disabled={ticketQty <= 1}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-bold w-6 text-center">
                      {ticketQty}
                    </span>
                    <button
                      onClick={() => handleQty("inc")}
                      className="w-8 h-8 rounded-full border border-[#026DA7] flex items-center justify-center text-[#026DA7] hover:bg-blue-50"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Tombol Beli */}
              <button
                onClick={handleBuy}
                disabled={!selectedTicketData || tickets.length === 0}
                className="w-full py-3.5 bg-[#026DA7] text-white font-bold rounded-xl shadow-md hover:bg-[#025a8a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Beli Tiket Sekarang
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
