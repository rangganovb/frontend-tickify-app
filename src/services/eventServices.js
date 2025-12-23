import api from "../api/axiosInstance";

export const eventService = {
  // 1. GET ALL EVENTS (Public)
  getEvents: async (params = {}) => {
    try {
      const finalParams = { limit: 100 };
      const response = await api.get("/events", { params: finalParams });

      const rawData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      // A. FETCH DATA TIKET UNTUK SETIAP EVENT
      const detailedData = await Promise.all(
        rawData.map(async (ev) => {
          try {
            const ticketRes = await api.get(`/tickets/event/${ev.id}`);
            const tickets = Array.isArray(ticketRes.data)
              ? ticketRes.data
              : ticketRes.data?.data || [];

            return { ...ev, tickets };
          } catch (err) {
            return ev;
          }
        })
      );

      // B. TRANSFORM DATA (Hitung harga & format tanggal)
      const transformedData = detailedData.map(transformEventData);

      // C. FILTER SISI CLIENT

      let filteredData = transformedData;

      // 1. Filter kategori
      if (params.category && params.category !== "all") {
        filteredData = filteredData.filter(
          (event) =>
            event.category?.toLowerCase() === params.category.toLowerCase()
        );
      }

      // 2. Filter harga maksimal
      if (params.maxPrice) {
        const cleanPrice = String(params.maxPrice).replace(/[.,]/g, "");
        const maxPrice = Number(cleanPrice);
        filteredData = filteredData.filter((event) => event.price <= maxPrice);
      }

      // 3. Filter Tanggal Event
      if (params.date) {
        const filterType = params.date;
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        filteredData = filteredData.filter((event) => {
          if (!event.start_time_raw) return false;

          const eventDate = new Date(event.start_time_raw);
          eventDate.setHours(0, 0, 0, 0);

          switch (filterType) {
            case "today": // Hari ini
              return eventDate.getTime() === now.getTime();

            case "tomorrow": // Besok
              const tomorrow = new Date(now);
              tomorrow.setDate(tomorrow.getDate() + 1);
              return eventDate.getTime() === tomorrow.getTime();

            case "this_week": // Minggu ini (Senin - Minggu)
              const dayOfWeek = now.getDay() || 7;
              const startOfWeek = new Date(now);
              startOfWeek.setDate(now.getDate() - dayOfWeek + 1);

              const endOfWeek = new Date(startOfWeek);
              endOfWeek.setDate(startOfWeek.getDate() + 6);

              return eventDate >= startOfWeek && eventDate <= endOfWeek;

            case "next_week": // Minggu depan (Senin - Minggu)
              const startNextWeek = new Date(now);
              const dayNext = startNextWeek.getDay() || 7;
              startNextWeek.setDate(startNextWeek.getDate() - dayNext + 1 + 7); // Senin minggu depan

              const endNextWeek = new Date(startNextWeek);
              endNextWeek.setDate(startNextWeek.getDate() + 6); // Minggu depan

              return eventDate >= startNextWeek && eventDate <= endNextWeek;

            case "this_month": // Bulan ini
              return (
                eventDate.getMonth() === now.getMonth() &&
                eventDate.getFullYear() === now.getFullYear()
              );

            case "next_month": // Bulan depan
              const nextMonth = new Date(now);
              nextMonth.setMonth(nextMonth.getMonth() + 1);
              return (
                eventDate.getMonth() === nextMonth.getMonth() &&
                eventDate.getFullYear() === nextMonth.getFullYear()
              );

            default:
              // Fallback: Filter tanggal spesifik manual (YYYY-MM-DD)
              const specificDate = new Date(filterType);
              if (!isNaN(specificDate.getTime())) {
                specificDate.setHours(0, 0, 0, 0);
                return eventDate.getTime() === specificDate.getTime();
              }
              return true;
          }
        });
      }

      // 4. Filter pencarian (search keyword)
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase();

        filteredData = filteredData.filter(
          (event) =>
            event.title.toLowerCase().includes(keyword) ||
            event.location.toLowerCase().includes(keyword)
        );
      }

      // D. SORTING LOGIC
      let sortedData = filteredData;

      if (params.sortBy) {
        sortedData.sort((a, b) => {
          const dateA = new Date(a.start_time_raw || 0);
          const dateB = new Date(b.start_time_raw || 0);

          switch (params.sortBy) {
            case "newest":
              // TERDEKAT: Mengurutkan berdasarkan tanggal pelaksanaan paling awal
              return dateA - dateB;

            case "oldest":
              // TERJAUH: Mengurutkan berdasarkan tanggal pelaksanaan paling akhir
              return dateB - dateA;

            case "lowPrice":
              return (a.price || 0) - (b.price || 0);

            case "highPrice":
              return (b.price || 0) - (a.price || 0);

            default:
              return dateA - dateB;
          }
        });
      } else {
        sortedData.sort((a, b) => {
          const dateA = new Date(a.start_time_raw || 0);
          const dateB = new Date(b.start_time_raw || 0);
          return dateB - dateA;
        });
      }

      return sortedData;
    } catch (error) {
      console.error("Gagal ambil events:", error);
      return [];
    }
  },

  // 2. GET EVENT BY ID
  getEventById: async (id) => {
    try {
      const response = await api.get(`/events/${id}`);

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

  // 3. GET 5 FEATURED EVENTS
  getFeaturedEvents: async () => {
    try {
      const events = await eventService.getEvents();
      return events.slice(0, 5);
    } catch (error) {
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

  // 5. TICKET DETAIL
  getTicketDetail: async (ticketId) => {
    try {
      const response = await api.get(`/tickets/${ticketId}`);
      return response.data.data || response.data.ticket || response.data;
    } catch (error) {
      console.error("Gagal ambil detail tiket:", error);
      throw error;
    }
  },

  // 6. CRUD EVENT
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

  deleteEvent: async (id) => {
    try {
      const response = await api.delete(`/admin/events/${id}`);
      return response.data;
    } catch (error) {
      console.error("Gagal delete event:", error);
      throw error;
    }
  },

  // 7. CRUD TICKET
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

  createTicket: async (payload) => {
    try {
      const response = await api.post("/admin/tickets", payload);
      return response.data;
    } catch (error) {
      console.error("Gagal buat tiket:", error);
      throw error;
    }
  },

  updateTicket: async (id, payload) => {
    try {
      const response = await api.put(`/admin/tickets/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error("Gagal update tiket:", error);
      throw error;
    }
  },

  deleteTicket: async (id) => {
    try {
      await api.delete(`/admin/tickets/${id}`);
    } catch (error) {
      console.error("Gagal hapus tiket:", error);
      throw error;
    }
  },
};

// HELPER: transformEventData
const transformEventData = (item) => {
  if (!item) return {};

  let bestPrice = parseFloat(item.price || 0);

  if (item.tickets && Array.isArray(item.tickets) && item.tickets.length > 0) {
    const prices = item.tickets.map((t) => parseFloat(t.price));
    bestPrice = Math.min(...prices);
  }

  if (bestPrice > 0 && bestPrice < 1000) {
    bestPrice = bestPrice * 1000;
  }

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    location: item.location || "Lokasi Belum Ditentukan",
    venue: item.venue || "",
    start_time_raw: item.start_time,
    end_time_raw: item.end_time,
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
