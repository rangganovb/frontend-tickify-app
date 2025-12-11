import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { eventService } from "../../services/eventServices";
import { toast } from "react-hot-toast";
import {
  X,
  Upload,
  Calendar,
  MapPin,
  Type,
  FileText,
  Plus,
  Trash2,
  Ticket,
} from "lucide-react";

export const EventFormModal = ({ eventId, onClose, onSuccess }) => {
  const isEdit = !!eventId;
  const [loading, setLoading] = useState(false);

  // State Form Event
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    venue: "",
    start_time: "",
    end_time: "",
    category: "music",
  });

  const [bannerFile, setBannerFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // State Tiket
  const [tickets, setTickets] = useState([]);

  // State Image Positioning
  const [imagePos, setImagePos] = useState(50);

  // --- INITIAL LOAD ---
  useEffect(() => {
    if (isEdit) {
      fetchEventData();
    } else {
      setTickets([{ name: "", price: "", quota: "" }]);
    }
  }, [eventId]);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      // 1. Ambil Data Event
      const data = await eventService.getEventById(eventId);

      const formatForInput = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const offset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - offset).toISOString().slice(0, 16);
      };

      setFormData({
        title: data.title,
        description: data.description,
        location: data.location,
        venue: data.venue,
        start_time: formatForInput(data.start_time_raw),
        end_time: formatForInput(data.end_time_raw),
        category: data.category || "music",
      });
      setPreviewUrl(data.image);

      // 2. Ambil Data Tiket
      const ticketData = await eventService.getTicketsByEvent(eventId);
      setTickets(
        ticketData.length > 0
          ? ticketData
          : [{ name: "", price: "", quota: "" }]
      );
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data event");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS EVENT ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // --- HANDLERS TIKET ---
  const addTicketRow = () => {
    setTickets([...tickets, { name: "", price: "", quota: "" }]);
  };

  const updateTicketRow = (index, field, value) => {
    const newTickets = [...tickets];
    newTickets[index][field] = value;
    setTickets(newTickets);
  };

  const removeTicketRow = async (index) => {
    const ticketToDelete = tickets[index];

    if (ticketToDelete.id) {
      if (
        !window.confirm(
          "Hapus kategori tiket ini? Tiket yang sudah dibeli user tidak akan hilang, tapi kategori ini akan dihapus."
        )
      )
        return;
      try {
        await eventService.deleteTicket(ticketToDelete.id);
        toast.success("Kategori tiket dihapus");
      } catch (error) {
        toast.error("Gagal hapus tiket di server");
        return;
      }
    }

    const newTickets = tickets.filter((_, i) => i !== index);
    setTickets(newTickets);
  };

  // --- SUBMIT UTAMA ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi Tiket Sederhana
    const invalidTickets = tickets.filter(
      (t) => !t.name || !t.price || !t.quota
    );
    if (invalidTickets.length > 0) {
      toast.error("Mohon lengkapi semua data tiket (Nama, Harga, Kuota)");
      return;
    }

    setLoading(true);

    try {
      // 1. Simpan Event Dulu
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (bannerFile) data.append("banner", bannerFile);

      let activeEventId = eventId;

      if (isEdit) {
        await eventService.updateEvent(eventId, data);
      } else {
        const response = await eventService.createEvent(data);

        const createdId =
          response.id || response.data?.id || response.event?.id;

        if (!createdId) {
          throw new Error("Event dibuat tapi ID tidak ditemukan.");
        }
        activeEventId = createdId;
      }

      // 2. Simpan Tiket-Tiketnya
      const ticketPromises = tickets.map((ticket) => {
        const payload = {
          event_id: activeEventId,
          name: ticket.name,
          price: parseInt(ticket.price) || 0,
          quota: parseInt(ticket.quota) || 0,
        };

        if (ticket.id) {
          return eventService.updateTicket(ticket.id, payload);
        } else {
          return eventService.createTicket(payload);
        }
      });

      await Promise.all(ticketPromises);

      toast.success(
        isEdit ? "Event & Tiket diperbarui!" : "Event & Tiket berhasil dibuat!"
      );
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submit:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Gagal menyimpan data";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-2xl w-full max-w-3xl relative z-10 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl shrink-0">
          <h3 className="font-bold text-gray-800 text-lg">
            {isEdit ? "Edit Event & Tiket" : "Buat Event Baru"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="event-form" onSubmit={handleSubmit} className="space-y-8">
            {/* --- SECTION 1: DETAIL EVENT --- */}
            <div className="space-y-6">
              {/* --- Banner Upload Section --- */}
              <div className="space-y-3">
                {/* Section Header & Instruction */}
                <div className="flex justify-between items-end">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Banner Event
                  </label>
                  {previewUrl && (
                    <span className="text-[10px] text-[#026DA7] bg-blue-50 px-2 py-0.5 rounded font-medium">
                      Geser slider di bawah untuk mengatur posisi
                    </span>
                  )}
                </div>

                {/* Image Container with Hover Overlay */}
                <div className="relative group border-2 border-dashed border-gray-300 rounded-xl bg-gray-100 h-[250px] overflow-hidden flex flex-col items-center justify-center transition-colors hover:border-[#026DA7]">
                  {previewUrl ? (
                    // Dynamic Image Positioning Logic
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover transition-all duration-75"
                      style={{ objectPosition: `center ${imagePos}%` }}
                    />
                  ) : (
                    // Empty State Placeholder
                    <div className="text-center p-6 text-gray-400">
                      <Upload size={32} className="mx-auto mb-2" />
                      <p className="text-sm">Klik untuk upload banner</p>
                      <p className="text-[10px] mt-1 opacity-70">
                        Format: JPG/PNG, Maks 2MB
                      </p>
                    </div>
                  )}

                  {/* Hover Overlay for Change Action */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer z-10">
                    <p className="text-white font-medium flex items-center gap-2">
                      <Upload size={18} /> Ganti Gambar
                    </p>
                  </div>

                  {/* Hidden Input Field */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                  />
                </div>

                {/* Position Adjustment Slider (Visible only when image exists) */}
                {previewUrl && (
                  <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-200 animate-fade-in">
                    <span className="text-[10px] font-bold text-gray-400 uppercase w-12">
                      Posisi Y
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={imagePos}
                      onChange={(e) => setImagePos(e.target.value)}
                      className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[#026DA7]"
                    />
                    <span className="text-[10px] font-mono text-gray-500 w-8 text-right">
                      {imagePos}%
                    </span>
                  </div>
                )}
              </div>

              {/* Form Input Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
                    <Type size={14} /> Judul Event
                  </label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#026DA7] outline-none transition-all"
                    placeholder="Contoh: Jazz Night 2025"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
                    <Type size={14} /> Kategori
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#026DA7] outline-none bg-white"
                  >
                    <option value="music">Musik</option>
                    <option value="exhibition">Pameran</option>
                    <option value="theater">Teater</option>
                    <option value="talkshow">Talkshow</option>
                    <option value="sports">Olahraga</option>
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
                      <Calendar size={14} /> Waktu Mulai
                    </label>
                    <input
                      type="datetime-local"
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#026DA7] outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
                      <Calendar size={14} /> Waktu Selesai
                    </label>
                    <input
                      type="datetime-local"
                      name="end_time"
                      value={formData.end_time}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#026DA7] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
                      <MapPin size={14} /> Kota
                    </label>
                    <input
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#026DA7] outline-none"
                      placeholder="Jakarta"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
                      <MapPin size={14} /> Venue
                    </label>
                    <input
                      name="venue"
                      value={formData.venue}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#026DA7] outline-none"
                      placeholder="GBK Stadium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
                    <FileText size={14} /> Deskripsi
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#026DA7] outline-none"
                    placeholder="Jelaskan detail event..."
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 my-6"></div>

            {/* --- SECTION 2: TIKET MANAGEMENT --- */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-bold text-[#1D3A6B] uppercase tracking-wider">
                  <Ticket size={18} /> Kategori Tiket
                </label>
                <button
                  type="button"
                  onClick={addTicketRow}
                  className="text-xs font-bold text-[#026DA7] bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"
                >
                  <Plus size={14} /> Tambah Tiket
                </button>
              </div>

              <div className="space-y-3">
                {tickets.map((ticket, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-gray-50 p-3 rounded-xl border border-gray-200 relative group"
                  >
                    {/* Input Nama */}
                    <div className="flex-1 w-full">
                      <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block md:hidden">
                        Nama Tiket
                      </label>
                      <input
                        type="text"
                        placeholder="Nama (Misal: VIP)"
                        value={ticket.name}
                        onChange={(e) =>
                          updateTicketRow(index, "name", e.target.value)
                        }
                        required
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#026DA7] outline-none"
                      />
                    </div>

                    {/* Input Harga */}
                    <div className="w-full md:w-32">
                      <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block md:hidden">
                        Harga (Rp)
                      </label>
                      <input
                        type="tel"
                        placeholder="Harga"
                        value={ticket.price}
                        onChange={(e) =>
                          updateTicketRow(index, "price", e.target.value)
                        }
                        required
                        min="0"
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#026DA7] outline-none"
                      />
                    </div>

                    {/* Input Kuota */}
                    <div className="w-full md:w-24">
                      <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block md:hidden">
                        Kuota
                      </label>
                      <input
                        type="number"
                        placeholder="Stok"
                        value={ticket.quota}
                        onChange={(e) =>
                          updateTicketRow(index, "quota", e.target.value)
                        }
                        required
                        min="1"
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#026DA7] outline-none"
                      />
                    </div>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => removeTicketRow(index)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors self-end md:self-center"
                      title="Hapus Tiket"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}

                {tickets.length === 0 && (
                  <div className="text-center p-4 text-sm text-gray-400 border border-dashed border-gray-200 rounded-xl">
                    Belum ada tiket. Klik tombol tambah di atas.
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            type="button"
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-all text-sm"
          >
            Batal
          </button>
          <button
            form="event-form"
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#026DA7] text-white font-bold rounded-xl hover:bg-[#025a8a] transition-all text-sm disabled:opacity-70 shadow-md"
          >
            {loading
              ? "Menyimpan Data..."
              : isEdit
              ? "Simpan Perubahan"
              : "Buat Event & Tiket"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
