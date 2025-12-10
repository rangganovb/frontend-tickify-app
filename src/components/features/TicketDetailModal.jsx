import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { eventService } from "../../services/eventServices";
import {
  X,
  Download,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  Share2,
} from "lucide-react";
import { toast } from "react-hot-toast";

export const TicketDetailModal = ({ ticketId, onClose }) => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ambil nama user dari localstorage buat ditampilkan di tiket (mirip referensi)
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!ticketId) return;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await eventService.getTicketDetail(ticketId);
        setTicket(data);
      } catch (error) {
        toast.error("Gagal memuat detail tiket");
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [ticketId, onClose]);

  const handleDownload = () => {
    // Simulasi Download
    const toastId = toast.loading("Menyiapkan dokumen...");
    setTimeout(() => {
      toast.success("E-Ticket berhasil disimpan ke perangkat!", {
        id: toastId,
      });
    }, 1500);
  };

  if (!ticketId) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-white rounded-3xl w-full max-w-md relative z-10 shadow-2xl overflow-hidden animate-scale-up flex flex-col max-h-[90vh]">
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all backdrop-blur-md"
        >
          <X size={20} />
        </button>

        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#026DA7] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : ticket ? (
          <>
            {/* Bagian Atas: Banner & Event Info */}
            <div className="relative h-48 bg-gray-200 shrink-0">
              {/* Gunakan gambar dari event jika ada, atau placeholder */}
              <img
                src={
                  ticket.event_banner ||
                  ticket.event_image ||
                  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
                }
                alt="Event Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <h2 className="text-xl font-bold leading-tight mb-1">
                  {ticket.event_title}
                </h2>
                <p className="text-xs text-gray-300 font-medium">
                  {ticket.category_name} Ticket
                </p>
              </div>
            </div>

            {/* Bagian Tengah: Detail Tiket (Scrollable) */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              {/* Status Badge */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                    Nomor Tiket
                  </p>
                  <p className="font-mono text-sm font-bold text-gray-800 tracking-wide">
                    {ticket.ticket_code}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                    ticket.is_used
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {ticket.is_used ? "SUDAH DIPAKAI" : "VALID / AKTIF"}
                </span>
              </div>

              {/* Nama Pemilik */}
              <div className="mb-8">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                  Nama Pemilik
                </p>
                <p className="font-bold text-gray-800 text-lg">
                  {user.full_name || "Guest User"}
                </p>
              </div>

              {/* QR Code Area */}
              <div className="flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6 mb-6 relative group">
                {/* Hiasan bulat di sisi tiket */}
                <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white rounded-full border-r border-gray-200"></div>
                <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white rounded-full border-l border-gray-200"></div>

                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${ticket.ticket_code}`}
                  alt="QR Code"
                  className={`w-48 h-48 mix-blend-multiply transition-opacity ${
                    ticket.is_used ? "opacity-30" : "opacity-100"
                  }`}
                />
                <p className="text-[10px] text-gray-400 mt-4 flex items-center gap-1">
                  <ShieldCheck size={12} /> Tunjukkan QR ini kepada petugas di
                  lokasi
                </p>
              </div>

              {/* Detail Waktu & Lokasi */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Tanggal</p>
                  <p className="font-medium text-gray-700 flex items-center gap-1.5">
                    <Calendar size={14} className="text-[#026DA7]" />
                    {new Date(ticket.start_time).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Waktu</p>
                  <p className="font-medium text-gray-700 flex items-center gap-1.5">
                    <Clock size={14} className="text-[#026DA7]" />
                    {new Date(ticket.start_time).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    WIB
                  </p>
                </div>
                <div className="col-span-2 space-y-1 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-400">Lokasi</p>
                  <p className="font-medium text-gray-700 flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#026DA7]" />
                    {ticket.venue || "Lokasi Event"}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
              <button
                onClick={handleDownload}
                className="flex-[2] py-3 px-4 bg-[#026DA7] text-white font-bold rounded-xl hover:bg-[#025a8a] shadow-lg shadow-blue-200 transition-all text-sm flex items-center justify-center gap-2"
              >
                <Download size={18} /> Unduh E-Ticket
              </button>
            </div>
          </>
        ) : (
          <div className="p-10 text-center">Data tiket tidak ditemukan</div>
        )}
      </div>
    </div>,
    document.body
  );
};
