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
};
