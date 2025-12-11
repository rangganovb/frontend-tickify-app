import api from "../api/axiosInstance";

export const userService = {
  getProfile: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.patch("/users/profile", data);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.patch("/users/change-password", passwordData);
    return response.data;
  },

  updateAvatar: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.patch("/users/profile-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteAvatar: async () => {
    const response = await api.delete("/users/profile-picture");
    return response.data;
  },

  // CREATE USER
  createUser: async (userData) => {
    try {
      const response = await api.post("/admin/users", userData);
      return response.data;
    } catch (error) {
      console.error("Gagal create user:", error);
      throw error;
    }
  },

  // UPDATE USER
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/admin/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error("Gagal update user:", error);
      throw error;
    }
  },

  // DELETE USER
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("Gagal hapus user:", error);
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const response = await api.get("/admin/users");

      // Handle format response
      const responseData = response.data;

      // Cek variasi struktur data
      if (Array.isArray(responseData)) return responseData;
      if (responseData.data && Array.isArray(responseData.data))
        return responseData.data;
      if (responseData.users && Array.isArray(responseData.users))
        return responseData.users;

      return [];
    } catch (error) {
      console.warn(
        "Gagal ambil users dari API (Mungkin token bukan admin atau error server). Menggunakan Mock Data.",
        error
      );

      // MOCK DATA CADANGAN
      return [
        {
          id: "mock-1",
          full_name: "Rangga November",
          email: "rangga@example.com",
          role: "admin",
          created_at: "2024-01-15T08:00:00Z",
        },
        {
          id: "mock-2",
          full_name: "Budi Santoso",
          email: "budi.santoso@test.com",
          role: "user",
          created_at: "2024-02-20T10:30:00Z",
        },
        {
          id: "mock-3",
          full_name: "Siti Aminah",
          email: "siti.am@test.com",
          role: "user",
          created_at: "2024-03-05T14:15:00Z",
        },
        {
          id: "mock-4",
          full_name: "John Doe",
          email: "john.doe@gmail.com",
          role: "user",
          created_at: "2024-03-10T09:00:00Z",
        },
        {
          id: "mock-5",
          full_name: "Admin Tickify",
          email: "admin@tickify.com",
          role: "admin",
          created_at: "2023-12-01T00:00:00Z",
        },
      ];
    }
  },
};
