import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { eventService } from "../../services/eventServices";
import {
  Calendar,
  MapPin,
  Clock,
  Share2,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  Info,
  Ticket,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State Data
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]); // State untuk list tiket (VIP, Regular)
  const [loading, setLoading] = useState(true);

  // State Transaksi
  const [selectedTicketId, setSelectedTicketId] = useState(null); // Tiket mana yang dipilih?
  const [ticketQty, setTicketQty] = useState(1);

  // 1. Fetch Data (Event + Tiket)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Jalan paralel biar cepat
        const [eventData, ticketData] = await Promise.all([
          eventService.getEventById(id),
          eventService.getEventTickets(id),
        ]);

        setEvent(eventData);
        setTickets(ticketData);

        // Otomatis pilih tiket pertama jika ada
        if (ticketData.length > 0) {
          setSelectedTicketId(ticketData[0].id);
        }
      } catch (error) {
        console.error(error);
        toast.error("Gagal memuat data event");
        navigate("/home");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  // Helper: Cari data tiket yang sedang dipilih
  const selectedTicketData = tickets.find((t) => t.id === selectedTicketId);

  // Handle Qty
  const handleQty = (type) => {
    if (!selectedTicketData) return;

    // Cek Quota Real
    const maxStock = selectedTicketData.quota - selectedTicketData.sold;

    if (type === "inc" && ticketQty < maxStock) setTicketQty(ticketQty + 1);
    if (type === "dec" && ticketQty > 1) setTicketQty(ticketQty - 1);
  };

  // Format Rupiah
  const formatRupiah = (price) => {
    // Karena data dummy "100.00", kali 1000 buat visualisasi harga asli
    const realPrice = parseFloat(price); // * 1000;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(realPrice);
  };

  // Format Tanggal
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

  // Handle Beli
  const handleBuy = () => {
    if (!selectedTicketData) return toast.error("Pilih tiket dulu!");

    //Disini nanti arahkan ke halaman Checkout / Payment
    toast.success(`Checkout: ${selectedTicketData.name} x ${ticketQty}`);
  };

  if (loading)
    return (
      <div className="min-h-screen pt-32 text-center font-['Poppins']">
        Memuat Event Seru...
      </div>
    );
  if (!event) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-28 flex flex-col font-['Poppins']">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-24">
        {/* --- 1. HERO IMAGE --- */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span
              className="cursor-pointer hover:text-[#026DA7]"
              onClick={() => navigate("/home")}
            >
              Beranda
            </span>
            <span>/</span>
            <span
              className="cursor-pointer hover:text-[#026DA7]"
              onClick={() => navigate("/explore")}
            >
              Event
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
              {event.category || "Event"}
            </div>
          </div>
        </div>

        {/* --- 2. GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* KIRI: Deskripsi Event */}
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

            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 flex gap-4">
              <Info className="text-[#026DA7] shrink-0" size={24} />
              <div className="text-sm text-gray-700">
                <p className="font-bold mb-1">Syarat & Ketentuan</p>
                <ul className="list-disc pl-4 space-y-1 text-gray-600">
                  <li>E-Ticket wajib ditunjukkan saat registrasi ulang.</li>
                  <li>
                    Dilarang membawa senjata tajam atau obat-obatan terlarang.
                  </li>
                  <li>
                    Tiket yang sudah dibeli tidak dapat diuangkan kembali.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* KANAN: Booking Card (STICKY) */}
          <div className="lg:col-span-4 animate-fade-in-right">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-28">
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Harga Mulai Dari</p>
                <h3 className="text-3xl font-bold text-[#026DA7]">
                  {/* Tampilkan harga tiket termurah dari list */}
                  {
                    tickets.length > 0
                      ? formatRupiah(
                          Math.min(...tickets.map((t) => parseFloat(t.price)))
                        )
                      : formatRupiah(event.price) // Fallback ke harga random event
                  }
                </h3>
              </div>

              {/* --- PILIHAN TIKET --- */}
              <div className="space-y-3 mb-6">
                <p className="text-sm font-bold text-gray-800">
                  Pilih Kategori Tiket
                </p>

                {tickets.length > 0 ? (
                  tickets.map((ticket) => {
                    const isSelected = selectedTicketId === ticket.id;
                    const available = ticket.quota - ticket.sold;
                    const isSoldOut = available <= 0;

                    return (
                      <div
                        key={ticket.id}
                        onClick={() =>
                          !isSoldOut && setSelectedTicketId(ticket.id)
                        }
                        className={`
                                            border rounded-xl p-3 cursor-pointer transition-all relative overflow-hidden
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
                              Sisa: {available} tiket
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
                            {isSelected && (
                              <div className="text-[10px] text-[#026DA7] font-medium">
                                Terpilih
                              </div>
                            )}
                          </div>
                        </div>
                        {isSoldOut && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 backdrop-blur-[1px]">
                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                              HABIS
                            </span>
                          </div>
                        )}
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
                <div className="space-y-4 mb-6 animate-fade-in">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
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
                </div>
              )}

              {/* --- TOTAL & TOMBOL --- */}
              <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-bold text-[#026DA7] text-xl">
                  {selectedTicketData
                    ? formatRupiah(
                        parseFloat(selectedTicketData.price) * ticketQty
                      )
                    : "Rp 0"}
                </span>
              </div>

              <button
                onClick={handleBuy}
                disabled={!selectedTicketData || tickets.length === 0}
                className="w-full py-3.5 bg-[#026DA7] text-white font-bold rounded-xl shadow-md hover:bg-[#025a8a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Beli Tiket Sekarang
              </button>

              <div className="mt-4 flex items-center justify-center gap-6">
                <button className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-800 transition-colors">
                  <Share2 size={14} /> Bagikan
                </button>
                <button className="flex items-center gap-2 text-xs text-gray-500 hover:text-red-500 transition-colors">
                  <Heart size={14} /> Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
