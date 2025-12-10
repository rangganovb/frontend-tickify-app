import api from "../api/axiosInstance";

export const orderService = {
  // 1. MEMBUAT ORDER (Checkout)
  createOrder: async (payload) => {
    try {
      const response = await api.post("/orders", payload);
      return response.data;
    } catch (error) {
      console.error("Gagal membuat order:", error);
      throw error;
    }
  },

  // 2. AMBIL LIST ORDER SAYA
  getMyOrders: async () => {
    try {
      const response = await api.get("/orders");
      return response.data.data || response.data;
    } catch (error) {
      console.error("Gagal ambil history order:", error);
      return [];
    }
  },

  // 3. AMBIL DETAIL ORDER
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Gagal ambil detail order:", error);
      throw error;
    }
  },

  // 4. BAYAR ORDER
  payOrder: async (orderId) => {
    try {
      const response = await api.post(`/orders/${orderId}/pay`);
      return response.data;
    } catch (error) {
      console.error("Gagal memproses pembayaran:", error);
      throw error;
    }
  },
};
