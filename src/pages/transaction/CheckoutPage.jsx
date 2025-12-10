import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { orderService } from "../../services/orderService";
import { toast } from "react-hot-toast";
import {
  ShieldCheck,
  Clock,
  User,
  Mail,
  Phone,
  Pencil,
  Check, // Icon Centang untuk Simpan
  X, // Icon Silang untuk Batal Edit
  ChevronLeft, // Icon Kembali (Mobile)
} from "lucide-react";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // --- STATE ---
  const [timeLeft, setTimeLeft] = useState(900);
  const [isEditing, setIsEditing] = useState(false); // Mode Edit Aktif/Tidak

  // Ambil Data Awal
  const { state } = location;
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // State Form Data (Terpisah dari User Profile agar profile asli aman)
  const [contactForm, setContactForm] = useState({
    fullName: user.full_name || "",
    email: user.email || "",
    phoneNumber: user.phone_number || "",
  });

  // Backup data untuk fitur "Batal Edit"
  const [backupForm, setBackupForm] = useState(contactForm);

  // --- PROTEKSI HALAMAN ---
  useEffect(() => {
    if (!state) navigate("/home");
  }, [state, navigate]);

  // --- LOGIC TIMER ---
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (!state) return null;
  const { event, ticket, qty, totalPrice } = state;

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  // --- HANDLERS EDIT DATA ---
  const startEditing = () => {
    setBackupForm(contactForm); // Simpan backup dulu
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setContactForm(backupForm); // Kembalikan ke data awal
    setIsEditing(false);
  };

  const saveEditing = () => {
    // Validasi sederhana
    if (
      !contactForm.fullName ||
      !contactForm.email ||
      !contactForm.phoneNumber
    ) {
      toast.error("Semua data wajib diisi");
      return;
    }
    setIsEditing(false);
    toast.success("Data pemesan diperbarui untuk pesanan ini");
  };

  // --- LOGIC CREATE ORDER ---
  const handleCreateOrder = async () => {
    setLoading(true);
    try {
      const payload = {
        items: [
          {
            category_id: ticket.id,
            quantity: qty,
          },
        ],
        // MENGIRIM DATA KONTAK TERBARU (Opsional: Tergantung Backend support ini atau tidak)
        // Jika Backend support, pesanan ini akan atas nama "contactForm", bukan "user profile"
        customer_details: {
          name: contactForm.fullName,
          email: contactForm.email,
          phone: contactForm.phoneNumber,
        },
      };

      const response = await orderService.createOrder(payload);
      const newOrderId = response.order.id;

      navigate(`/payment/${newOrderId}`);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Gagal membuat pesanan";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-['Poppins']">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* --- 4. NAVIGASI MOBILE (KHUSUS HP) --- */}
        {/* Hanya muncul di layar kecil (md:hidden) agar user HP punya tombol kembali */}
        <div className="md:hidden px-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-[#026DA7] font-medium text-sm transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
              <ChevronLeft size={18} />
            </div>
            Kembali
          </button>
        </div>

        {/* --- STEPPER HEADER (DESKTOP) --- */}
        <div className="max-w-7xl mx-auto px-4 mb-10 mt-6 hidden md:block">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <div
              className="flex items-center gap-2 text-[#026DA7] font-semibold cursor-pointer hover:underline"
              onClick={() => navigate(-1)}
            >
              <span className="w-6 h-6 rounded-full bg-[#026DA7] text-white flex items-center justify-center text-xs">
                1
              </span>
              Detail Pesanan
            </div>
            <div className="w-12 h-px bg-gray-300"></div>
            <div className="flex items-center gap-2 font-medium text-gray-800">
              <span className="w-6 h-6 rounded-full border-2 border-gray-800 text-gray-800 flex items-center justify-center text-xs font-bold">
                2
              </span>
              Pembayaran
            </div>
            <div className="w-12 h-px bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-xs">
                3
              </span>
              {/* 5. GANTI "SELESAI" JADI "E-TICKET" */}
              E-Ticket
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* EVENT HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#1D3A6B]">
                {event.title}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {event.date} • {event.time}
              </p>
              <p className="text-gray-500 text-sm">
                {event.location} ({event.venue})
              </p>
            </div>

            {/* Timer */}
            <div className="bg-[#FEF3C7] text-[#92400E] px-6 py-3 rounded-lg font-medium text-sm flex items-center gap-3 w-full md:w-auto shadow-sm border border-[#FDE68A]">
              <Clock size={18} />
              <span>{formatTime(timeLeft)} | Batas Waktu Tersisa</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* --- KIRI: DATA PEMESAN --- */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 transition-all">
                {/* Header Card */}
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-full text-[#026DA7]">
                      <User size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">
                      Data Pemesan
                    </h2>
                  </div>

                  {/* 2 & 3. UX TOMBOL PENSIL (EDIT) */}
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button
                        onClick={cancelEditing}
                        className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-all"
                        title="Batal"
                      >
                        <X size={18} />
                      </button>
                      <button
                        onClick={saveEditing}
                        className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-all"
                        title="Simpan"
                      >
                        <Check size={18} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={startEditing}
                      className="p-2 text-[#026DA7] bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg transition-all shadow-sm hover:shadow-md"
                      title="Edit Data Pesanan"
                    >
                      <Pencil size={18} />
                    </button>
                  )}
                </div>

                <form className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Nama Lengkap */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        value={contactForm.fullName}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            fullName: e.target.value,
                          })
                        }
                        readOnly={!isEditing}
                        className={`w-full px-4 py-3 rounded-lg border transition-all ${
                          isEditing
                            ? "bg-white border-[#026DA7] focus:ring-2 focus:ring-[#026DA7]/20"
                            : "bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed"
                        }`}
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Email
                      </label>
                      <div className="relative">
                        <Mail
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              email: e.target.value,
                            })
                          }
                          readOnly={!isEditing}
                          className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all ${
                            isEditing
                              ? "bg-white border-[#026DA7] focus:ring-2 focus:ring-[#026DA7]/20"
                              : "bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed"
                          }`}
                        />
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1.5 ml-1 leading-snug">
                        *E-ticket akan dikirim ke email ini.
                      </p>
                    </div>
                  </div>

                  {/* Nomor Telepon */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Nomor WhatsApp
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        value={contactForm.phoneNumber}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            phoneNumber: e.target.value,
                          })
                        }
                        readOnly={!isEditing}
                        className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all ${
                          isEditing
                            ? "bg-white border-[#026DA7] focus:ring-2 focus:ring-[#026DA7]/20"
                            : "bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed"
                        }`}
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Info Penting */}
              <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 border-dashed">
                <div className="flex items-start gap-3">
                  <div className="bg-[#026DA7] text-white p-1.5 rounded-md mt-0.5">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1D3A6B]">
                      Info Penting
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      Pastikan data pemesan sudah benar. Tiket yang sudah dibeli
                      tidak dapat ditukar atau dikembalikan (Non-refundable).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* --- KANAN: RINCIAN --- */}
            <div className="lg:col-span-4">
              <div className="bg-white p-6 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 sticky top-24">
                <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                  Rincian Pesanan
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-start text-sm">
                    <div>
                      <p className="font-semibold text-gray-700">
                        {ticket.name}
                      </p>
                      <p className="text-xs text-gray-500">x {qty} Tiket</p>
                    </div>
                    <p className="font-medium text-gray-900">
                      {formatRupiah(
                        ticket.price < 1000 ? ticket.price * 1000 : ticket.price
                      )}
                    </p>
                  </div>
                  <div className="border-t border-dashed border-gray-200 my-2"></div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium text-gray-700">
                      {formatRupiah(totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Biaya Layanan</span>
                    <span className="font-medium text-green-600">Gratis</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center mb-6 border border-gray-100">
                  <span className="text-sm font-bold text-gray-600">
                    Total Bayar
                  </span>
                  <span className="text-xl font-bold text-[#026DA7]">
                    {formatRupiah(totalPrice)}
                  </span>
                </div>

                <button
                  onClick={handleCreateOrder}
                  disabled={loading}
                  className="w-full py-3.5 bg-[#026DA7] text-white font-bold rounded-lg hover:bg-[#025a8a] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? "Memproses..." : "Lanjutkan Pembayaran"}
                </button>

                {/* 1. SECURE PAYMENT */}
                <div className="mt-6 flex items-center justify-center gap-2 opacity-70">
                  <ShieldCheck size={16} className="text-gray-400" />
                  <span className="text-[11px] text-gray-500 tracking-wide">
                    Secure Payment by{" "}
                    <span className="font-bold text-[#026DA7]">Tickify</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
