import api from "../api/axiosInstance";

export const eventService = {
  // Mengambil daftar event publik dengan dukungan filter dan sorting otomatis
  getEvents: async (params = {}) => {
    try {
      const finalParams = { limit: 100, ...params };
      const response = await api.get("/events", { params: finalParams });

      const rawData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      const detailedData = await Promise.all(
        rawData.map(async (ev) => {
          try {
            // Tembak endpoint tiket untuk setiap event
            const ticketRes = await api.get(`/tickets/event/${ev.id}`);
            const tickets = Array.isArray(ticketRes.data)
              ? ticketRes.data
              : ticketRes.data?.data || [];

            // Masukkan data tiket ke dalam object event agar helper 'transformEventData' bisa hitung harganya
            return { ...ev, tickets };
          } catch (err) {
            // Kalau gagal ambil tiket, biarkan harga default
            return ev;
          }
        })
      );

      const transformedData = detailedData.map(transformEventData);

      // Mengurutkan event berdasarkan waktu mulai secara menurun (terbaru/masa depan di atas)
      const sortedData = transformedData.sort((a, b) => {
        const dateA = new Date(a.start_time_raw || 0);
        const dateB = new Date(b.start_time_raw || 0);
        return dateB - dateA;
      });

      return sortedData;
    } catch (error) {
      console.error("Gagal ambil events:", error);
      return [];
    }
  },

  // Mengambil detail satu event berdasarkan ID dengan penanganan format respons dinamis
  getEventById: async (id) => {
    try {
      const response = await api.get(`/events/${id}`);

      // Menangani variasi struktur respons (data, data.data, atau data.event)
      let rawData = response.data;
      if (response.data.data) {
        rawData = response.data.data;
      } else if (response.data.event) {
        rawData = response.data.event;
      }

      if (!rawData || !rawData.id) {
        throw new Error("Data event tidak lengkap atau tidak ditemukan");
      }

      return transformEventData(rawData);
    } catch (error) {
      console.error("Gagal ambil detail event:", error);
      throw error;
    }
  },

  // Mengambil 5 event unggulan/terbaru untuk ditampilkan di beranda
  getFeaturedEvents: async () => {
    try {
      const events = await eventService.getEvents();
      return events.slice(0, 5);
    } catch (error) {
      return [];
    }
  },

  // Mengambil daftar tiket yang dimiliki user saat ini
  getMyTickets: async (page = 1, limit = 10) => {
    try {
      const response = await api.get("/tickets/mine", {
        params: { page, limit },
      });
      return {
        tickets: response.data.data || [],
        pagination: response.data.pagination || {},
      };
    } catch (error) {
      console.error("Gagal ambil tiket saya:", error);
      return { tickets: [], pagination: {} };
    }
  },

  // Mengambil detail spesifik satu tiket yang sudah dibeli
  getTicketDetail: async (ticketId) => {
    try {
      const response = await api.get(`/tickets/${ticketId}`);
      return response.data.data || response.data.ticket || response.data;
    } catch (error) {
      console.error("Gagal ambil detail tiket:", error);
      throw error;
    }
  },

  // Membuat event baru (Khusus Admin) dengan dukungan upload gambar
  createEvent: async (formData) => {
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const response = await api.post("/admin/events", formData, config);
      return response.data;
    } catch (error) {
      console.error("Gagal create event:", error);
      throw error;
    }
  },

  // Memperbarui data event yang sudah ada (Khusus Admin)
  updateEvent: async (id, formData) => {
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const response = await api.put(`/admin/events/${id}`, formData, config);
      return response.data;
    } catch (error) {
      console.error("Gagal update event:", error);
      throw error;
    }
  },

  // Menghapus event secara permanen (Khusus Admin)
  deleteEvent: async (id) => {
    try {
      const response = await api.delete(`/admin/events/${id}`);
      return response.data;
    } catch (error) {
      console.error("Gagal delete event:", error);
      throw error;
    }
  },

  // Mengambil daftar kategori tiket berdasarkan ID event (Public & Admin)
  getTicketsByEvent: async (eventId) => {
    try {
      const response = await api.get(`/tickets/event/${eventId}`);
      return Array.isArray(response.data)
        ? response.data
        : response.data.data || [];
    } catch (error) {
      console.error("Gagal ambil tiket event:", error);
      return [];
    }
  },

  // Membuat kategori tiket baru untuk event tertentu (Khusus Admin)
  createTicket: async (payload) => {
    try {
      const response = await api.post("/admin/tickets", payload);
      return response.data;
    } catch (error) {
      console.error("Gagal buat tiket:", error);
      throw error;
    }
  },

  // Memperbarui data kategori tiket (Khusus Admin)
  updateTicket: async (id, payload) => {
    try {
      const response = await api.put(`/admin/tickets/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error("Gagal update tiket:", error);
      throw error;
    }
  },

  // Menghapus kategori tiket (Khusus Admin)
  deleteTicket: async (id) => {
    try {
      await api.delete(`/admin/tickets/${id}`);
    } catch (error) {
      console.error("Gagal hapus tiket:", error);
      throw error;
    }
  },
};

// Helper: Mengubah format data raw backend menjadi format UI yang konsisten
const transformEventData = (item) => {
  if (!item) return {};

  // Logika penentuan harga terendah dari daftar tiket atau harga dasar
  let bestPrice = parseFloat(item.price || 0);

  if (item.tickets && Array.isArray(item.tickets) && item.tickets.length > 0) {
    const prices = item.tickets.map((t) => parseFloat(t.price));
    bestPrice = Math.min(...prices);
  }

  // Normalisasi harga jika nilai di bawah 1000 (asumsi format ribuan desimal)
  if (bestPrice > 0 && bestPrice < 1000) {
    bestPrice = bestPrice * 1000;
  }

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    location: item.location || "Lokasi Belum Ditentukan",
    venue: item.venue || "",

    // Menyimpan data waktu mentah untuk keperluan sorting dan form edit
    start_time_raw: item.start_time,
    end_time_raw: item.end_time,

    // Format tanggal dan waktu untuk tampilan UI (Kartu/Detail)
    date: item.start_time
      ? new Date(item.start_time).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Segera",
    time: item.start_time
      ? new Date(item.start_time).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "TBA",

    image:
      item.banner_url ||
      item.image ||
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4",
    price: bestPrice,
    organizer: item.organizer_name || "Tickify Partner",
    category: item.category || "others",
    stock: 100,
  };
};
