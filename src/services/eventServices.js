import api from "../api/axiosInstance";

export const eventService = {
  // 1. GET ALL EVENTS
  getEvents: async (filters = {}) => {
    try {
      // Parameter Request
      const params = {
        title: filters.search,
        category: filters.category,
        location: filters.location,
        min_price: filters.minPrice,
        date: filters.date,
        limit: 50,
        page: 1,
      };

      // Hapus parameter yang kosong/undefined
      Object.keys(params).forEach((key) => !params[key] && delete params[key]);

      // Tembak API
      const response = await api.get("/events", { params });

      // --- LOGIC BUKA BUNGKUS DATA ---
      const eventsArray = response.data.data;

      // Validasi
      if (!Array.isArray(eventsArray)) {
        console.warn(
          "Format response tidak sesuai ekspektasi array:",
          response.data
        );
        return [];
      }

      // Format data sesuai kebutuhan UI (EventCard)
      return eventsArray.map(transformEventData);
    } catch (error) {
      console.error("Gagal ambil events:", error);
      return [];
    }
  },

  // 2. GET EVENT BY ID
  getEventById: async (id) => {
    try {
      const response = await api.get(`/events/${id}`);
      const eventData = response.data.data || response.data;
      return transformEventData(eventData);
    } catch (error) {
      console.error("Gagal ambil detail event:", error);
      throw error;
    }
  },

  // 3. GET TICKETS
  getEventTickets: async (eventId) => {
    try {
      const response = await api.get(`/tickets/event/${eventId}`);
      // Handle wrapper data juga untuk tiket
      return response.data.data || response.data;
    } catch (error) {
      console.error("Gagal ambil tiket:", error);
      return [];
    }
  },

  // 4. GET MY TICKETS
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

  // 5. GET TICKET DETAIL (Baru)
  getTicketDetail: async (ticketId) => {
    try {
      const response = await api.get(`/tickets/${ticketId}`);
      // Handle response wrapper (jika ada data.data)
      return response.data.data || response.data;
    } catch (error) {
      console.error("Gagal ambil detail tiket:", error);
      throw error;
    }
  },
};

// --- HELPER: MAPPING DATA BACKEND -> FRONTEND ---
const transformEventData = (item) => {
  return {
    id: item.id,

    // Data Text
    title: item.title,
    description: item.description,
    location: item.location || "Lokasi Belum Ditentukan",
    venue: item.venue || "",

    // Data Waktu (Parse dari ISO String)
    date: item.start_time
      ? item.start_time.split("T")[0]
      : new Date().toISOString().split("T")[0],
    time: item.start_time
      ? item.start_time.split("T")[1].substring(0, 5)
      : "19:00",

    // Data Gambar (Banner URL)
    image:
      item.banner_url ||
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4",

    // Data Tambahan (Organizer & Category) - SUDAH REAL DARI BE
    organizer: item.organizer_name || "Tickify Partner",
    category: item.category || "others",

    // Harga (Masih Random karena di object event belum ada field 'price')
    price:
      item.price || Math.floor(Math.random() * (500 - 100 + 1) + 100) * 1000,

    stock: 100, // Dummy
  };
};
