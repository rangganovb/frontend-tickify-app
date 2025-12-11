import api from "../api/axiosInstance";

export const orderService = {
  // 1. Membuat order baru berdasarkan item yang dipilih (Checkout)
  createOrder: async (payload) => {
    try {
      const response = await api.post("/orders", payload);
      return response.data;
    } catch (error) {
      console.error("Gagal membuat order:", error);
      throw error;
    }
  },

  // 2. Mengambil riwayat pesanan milik user yang sedang login
  getMyOrders: async () => {
    try {
      const response = await api.get("/orders");
      return response.data.data || response.data;
    } catch (error) {
      console.error("Gagal ambil history order:", error);
      return [];
    }
  },

  // 3. Mengambil detail pesanan spesifik berdasarkan ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Gagal ambil detail order:", error);
      throw error;
    }
  },

  // 4. Memproses pembayaran ke gateway (Xendit) dan mendapatkan Invoice URL
  payOrder: async (orderId) => {
    try {
      const response = await api.post(`/orders/${orderId}/pay`);
      return response.data;
    } catch (error) {
      console.error("Gagal memproses pembayaran:", error);
      throw error;
    }
  },

  // 5. Membatalkan pesanan yang statusnya masih pending
  cancelOrder: async (orderId) => {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      console.error("Gagal cancel order:", error);
      throw error;
    }
  },
};
