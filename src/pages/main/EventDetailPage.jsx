import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { eventService } from "../../services/eventServices";
import { Calendar, MapPin, Minus, Plus, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [ticketQty, setTicketQty] = useState(1);

  // --- 1. FETCH DATA (Event + Tiket Asli) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Ambil Detail Event DAN Ambil List Tiket (Harga Asli)
        const [eventData, ticketData] = await Promise.all([
          eventService.getEventById(id),
          eventService.getEventTickets(id),
        ]);

        setEvent(eventData);
        setTickets(ticketData);

        // Pilih tiket pertama otomatis
        if (ticketData.length > 0) {
          setSelectedTicketId(ticketData[0].id);
        }
      } catch (error) {
        console.error(error);
        toast.error("Gagal memuat detail event");
        navigate("/home");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  const selectedTicketData = tickets.find((t) => t.id === selectedTicketId);

  const handleQty = (type) => {
    if (!selectedTicketData) return;
    // Gunakan kuota asli dari DB
    const maxStock = selectedTicketData.quota - (selectedTicketData.sold || 0);

    if (type === "inc" && ticketQty < maxStock) setTicketQty(ticketQty + 1);
    if (type === "dec" && ticketQty > 1) setTicketQty(ticketQty - 1);
  };

  // --- 2. LOGIC FORMAT HARGA (PENTING) ---
  const formatRupiah = (price) => {
    let numericPrice = parseFloat(price);

    // Kalau harga di bawah 1000 perak, dikali 1000
    if (numericPrice < 1000) {
      numericPrice = numericPrice * 1000;
    }

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericPrice);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateStr).toLocaleDateString("id-ID", options);
  };

  const handleBuy = () => {
    // 1. Validasi: User harus pilih tiket dulu
    if (!selectedTicketData) return toast.error("Pilih tiket dulu!");

    // 2. Validasi: User harus Login
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Silakan login untuk membeli tiket");
      navigate("/login");
      return;
    }

    // 3. Hitung Harga Total
    const numericPrice =
      parseFloat(selectedTicketData.price) < 1000
        ? parseFloat(selectedTicketData.price) * 1000
        : parseFloat(selectedTicketData.price);

    const totalPrice = numericPrice * ticketQty;

    // 4. PINDAH KE HALAMAN CHECKOUT
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 flex flex-col font-['Poppins']">
        <Navbar /> {/* Navbar tetap muncul agar tidak kedip */}
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-24">
          {/* 1. Breadcrumb Skeleton */}
          <div className="mb-8">
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>

            {/* 2. Hero Image Skeleton */}
            <div className="w-full h-[250px] md:h-[400px] bg-gray-200 rounded-2xl animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* 3. KIRI: Info Event Skeleton */}
            <div className="lg:col-span-8 space-y-8">
              <div>
                {/* Title */}
                <div className="h-8 md:h-10 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>

                {/* Organizer */}
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Info Grid (Date & Location) */}
              <div className="flex gap-4 border-y border-gray-100 py-6">
                <div className="flex-1 flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="space-y-2 w-full">
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="flex-1 flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="space-y-2 w-full">
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* 4. KANAN: Booking Card Skeleton */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-[400px]">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8"></div>

                {/* List Tiket Skeleton */}
                <div className="space-y-3 mb-8">
                  <div className="h-16 w-full bg-gray-200 rounded-xl animate-pulse"></div>
                  <div className="h-16 w-full bg-gray-200 rounded-xl animate-pulse"></div>
                </div>

                <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  if (!event) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-28 flex flex-col font-['Poppins']">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-24">
        {/* Breadcrumb & Hero */}
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
          {/* KIRI: Info Event */}
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
                    <p className="text-xs text-gray-500">{event.time} WIB</p>
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

            <div className="prose max-w-none text-gray-600 text-sm leading-relaxed">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Deskripsi Event
              </h3>
              <p>{event.description}</p>
            </div>
          </div>

          {/* KANAN: Booking Card (Sticky) */}
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

              {/* --- LIST TIKET DARI API --- */}
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

              {/* --- JUMLAH --- */}
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
