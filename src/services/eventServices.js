import api from "../api/axiosInstance";

const transformEventData = (item) => {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    location: item.location || "Lokasi Belum Ditentukan",
    venue: item.venue || "",

    // Format Tanggal
    date: item.start_time
      ? item.start_time.split("T")[0]
      : new Date().toISOString().split("T")[0],
    time: item.start_time
      ? item.start_time.split("T")[1].substring(0, 5)
      : "19:00",

    // Harga Card Event Acak jika tidak ada
    price:
      item.price || Math.floor(Math.random() * (500 - 100 + 1) + 100) * 1000,
    stock: 100,
    image:
      item.banner_url ||
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4",
    organizer: item.organizer_name || "Tickify Partner",
    category: item.category || "others",

    stock: 100, // Dummy stock
  };
};

// --- EVENT SERVICE ---
export const eventService = {
  // 1. Get All Events
  getEvents: async (filters = {}) => {
    try {
      // Mapping nama filter
      const params = {
        title: filters.search,
        category: filters.category,
        location: filters.location,
        min_price: filters.minPrice,
        date: filters.date,
      };

      Object.keys(params).forEach((key) => !params[key] && delete params[key]);

      // Axios akan otomatis membuat URL Query
      const response = await api.get("/events", { params });

      // Mapping data API ke format UI
      return response.data.map(transformEventData);
    } catch (error) {
      console.error("Gagal ambil events:", error);
      return [];
    }
  },

  // 2. Get Event By ID
  getEventById: async (id) => {
    try {
      const response = await api.get(`/events/${id}`);
      return transformEventData(response.data);
    } catch (error) {
      console.error("Gagal ambil detail event:", error);
      throw error;
    }
  },

  // 3. Get Tickets by Event ID
  getEventTickets: async (eventId) => {
    try {
      const response = await api.get(`/tickets/event/${eventId}`);
      return response.data;
    } catch (error) {
      console.error("Gagal ambil tiket:", error);
      return [];
    }
  },

  // 4. Get My Tickets
  getMyTickets: async () => {
    try {
      const response = await api.get("/tickets/mine");
      return response.data;
    } catch (error) {
      console.error("Gagal ambil tiket saya:", error);
      return [];
    }
  },
};
