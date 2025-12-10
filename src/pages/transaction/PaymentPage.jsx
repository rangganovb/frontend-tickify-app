import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { orderService } from "../../services/orderService";
import { eventService } from "../../services/eventServices";
import { toast } from "react-hot-toast";
import {
  ShieldCheck,
  Clock,
  CheckCircle,
  Smartphone,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800);

  // 1. FETCH DATA
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const dataOrder = await orderService.getOrderById(id);
        setOrder(dataOrder);

        if (dataOrder.items && dataOrder.items.length > 0) {
          const eventId = dataOrder.items[0].event_id;
          const dataEvent = await eventService.getEventById(eventId);
          setEventData(dataEvent);
        }
      } catch (error) {
        console.error("Gagal load order:", error);
        toast.error("Pesanan tidak ditemukan");
        navigate("/home");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id, navigate]);

  // 2. TIMER LOGIC
  useEffect(() => {
    if (order?.status === "paid") return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [order]);

  const formatTime = (seconds) => {
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatRupiah = (val) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);

  // 3. LOGIC BAYAR
  const handlePaymentAction = async () => {
    setPaying(true);
    setTimeout(async () => {
      try {
        await orderService.payOrder(id);
        setOrder((prev) => ({
          ...prev,
          status: "paid",
          paid_at: new Date().toISOString(),
        }));
        toast.success("Pembayaran Berhasil Dikonfirmasi!");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error(error);
        toast.error("Gagal memproses pembayaran");
      } finally {
        setPaying(false);
      }
    }, 2000);
  };

  // --- 4. SKELETON LOADING UI ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] font-['Poppins']">
        <Navbar />
        <main className="pt-28 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Skeleton */}
            <div className="flex flex-col items-center gap-2 mb-10 mt-8">
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-7 h-[450px] bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="md:col-span-5 h-[300px] bg-gray-200 rounded-2xl animate-pulse"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!order) return null;

  const isPaid = order.status === "paid";

  // FIX HARGA: Jika harga < 1000, dikali 1000
  const displayPrice =
    order.total_price < 1000 ? order.total_price * 1000 : order.total_price;

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-['Poppins']">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* HEADER STATUS & TIMER */}
          <div className="text-center mb-10 mt-8">
            {" "}
            {/* Diturunkan (mt-8) */}
            {isPaid ? (
              <div className="animate-fade-in-up">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm ring-4 ring-green-50">
                  <CheckCircle size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Pembayaran Berhasil!
                </h2>
                <p className="text-gray-500 mt-1">
                  E-Ticket telah dikirim ke email Anda.
                </p>
              </div>
            ) : (
              <div className="animate-fade-in">
                <p className="text-gray-500 text-sm mb-3 font-medium">
                  Selesaikan pembayaran dalam
                </p>
                {/* Timer Warna Biru */}
                <div className="inline-flex items-center gap-2 bg-blue-50 text-[#026DA7] px-6 py-2.5 rounded-full font-mono text-xl font-bold border border-blue-100 shadow-sm">
                  <Clock size={20} />
                  {formatTime(timeLeft)}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* --- KIRI: QRIS / STATUS --- */}
            <div className="md:col-span-7 space-y-4">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden transition-all">
                {/* Pita Status */}
                <div
                  className={`absolute top-0 right-0 px-4 py-1 rounded-bl-xl text-[10px] md:text-xs font-bold uppercase tracking-wider shadow-sm ${
                    isPaid
                      ? "bg-green-100 text-green-700"
                      : "bg-[#026DA7]/10 text-[#026DA7]"
                  }`}
                >
                  {isPaid ? "LUNAS" : "MENUNGGU PEMBAYARAN"}
                </div>

                {/* Title Section */}
                <div className="flex items-center gap-3 mb-8">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_QRIS.svg/1200px-Logo_QRIS.svg.png"
                    alt="QRIS"
                    className="h-8 w-auto"
                  />
                  <div className="h-6 w-px bg-gray-200"></div>
                  <span className="text-sm font-semibold text-gray-500">
                    National Payment Standard
                  </span>
                </div>

                {/* CONTENT: QR CODE vs SUCCESS INFO */}
                <div className="flex flex-col items-center justify-center min-h-[300px]">
                  {isPaid ? (
                    // TAMPILAN SUKSES
                    <div className="text-center animate-fade-in w-full">
                      <div className="p-5 bg-gray-50 rounded-xl border border-dashed border-gray-200 mb-6 w-full max-w-sm mx-auto">
                        <div className="flex justify-between text-sm mb-3">
                          <span className="text-gray-500">Metode</span>
                          <span className="font-bold text-gray-800">
                            QRIS Instant
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mb-3">
                          <span className="text-gray-500">Waktu Bayar</span>
                          <span className="font-bold text-gray-800">
                            {new Date(order.paid_at).toLocaleTimeString(
                              "id-ID",
                              { hour: "2-digit", minute: "2-digit" }
                            )}{" "}
                            WIB
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Ref. ID</span>
                          <span className="font-mono text-xs text-gray-600 bg-gray-200 px-2 py-0.5 rounded">
                            {order.id.split("-")[0].toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          navigate("/profile", {
                            state: { defaultTab: "tickets" },
                          })
                        }
                        className="w-full md:w-auto px-8 py-3 bg-[#026DA7] text-white font-bold rounded-xl shadow-lg hover:shadow-[#026DA7]/30 hover:-translate-y-1 transition-all"
                      >
                        Lihat Tiket Saya
                      </button>
                    </div>
                  ) : (
                    // TAMPILAN BELUM BAYAR (QR CODE)
                    <div className="text-center w-full animate-fade-in">
                      <div className="relative inline-block group mb-6">
                        {/* Container QR */}
                        <div className="p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-sm relative z-10">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=PAY-${order.id}`}
                            alt="Scan QRIS"
                            className="w-48 h-48 md:w-56 md:h-56 mix-blend-multiply"
                          />
                        </div>
                        {/* Efek Glow Halus */}
                        <div className="absolute -inset-2 bg-gradient-to-tr from-[#026DA7]/20 to-transparent rounded-3xl blur-xl opacity-50"></div>
                      </div>

                      <div className="space-y-6 max-w-sm mx-auto">
                        <div className="text-sm text-gray-500 bg-gray-50 py-2 px-4 rounded-full inline-flex items-center gap-2">
                          <Smartphone size={16} />
                          Scan QR dengan aplikasi pembayaran
                        </div>

                        {/* TOMBOL KONFIRMASI */}
                        <button
                          onClick={handlePaymentAction}
                          disabled={paying}
                          className="w-full py-3.5 bg-[#1D3A6B] text-white font-bold rounded-xl shadow-md hover:bg-[#152C52] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {paying ? (
                            <>
                              <Loader2 size={18} className="animate-spin" />
                              Memverifikasi Pembayaran...
                            </>
                          ) : (
                            "Konfirmasi Pembayaran"
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* --- KANAN: RINGKASAN ORDER --- */}
            <div className="md:col-span-5">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#026DA7]" /> Ringkasan
                  Pesanan
                </h3>

                {/* Event Info */}
                <div className="flex gap-4 mb-6 pb-6 border-b border-dashed border-gray-200">
                  {eventData ? (
                    <img
                      src={eventData.image}
                      alt="Event"
                      className="w-16 h-16 rounded-lg object-cover bg-gray-100 border border-gray-100"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm line-clamp-2 leading-snug">
                      {eventData?.title || "Memuat..."}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
                      <Clock size={12} /> {eventData?.date}
                    </p>
                  </div>
                </div>

                {/* Price Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Order ID</span>
                    <span className="font-mono font-medium text-gray-700 text-xs bg-gray-100 px-2 py-0.5 rounded">
                      {order.id.slice(0, 13)}...
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Tiket</span>
                    <span className="font-medium text-gray-700">
                      {order.items?.reduce(
                        (acc, item) => acc + item.quantity,
                        0
                      ) || 0}{" "}
                      Tiket
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Biaya Layanan</span>
                    <span className="font-medium text-green-600">Gratis</span>
                  </div>
                </div>

                {/* Total Payment */}
                <div className="bg-[#F8F9FA] p-4 rounded-xl flex justify-between items-center border border-gray-200">
                  <span className="text-sm font-bold text-gray-600">
                    Total Tagihan
                  </span>
                  <span className="text-xl font-bold text-[#026DA7]">
                    {formatRupiah(displayPrice)}
                  </span>
                </div>

                {/* Warning Box */}
                {!isPaid && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-xl border border-gray-200">
                    <div className="flex gap-3 items-start">
                      <AlertCircle
                        size={18}
                        className="text-gray-600 shrink-0 mt-0.5"
                      />
                      <p className="text-xs text-gray-600 leading-relaxed font-medium">
                        Pesanan akan otomatis dibatalkan jika pembayaran tidak
                        diselesaikan dalam batas waktu.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
