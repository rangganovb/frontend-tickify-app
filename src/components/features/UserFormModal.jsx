import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { userService } from "../../services/userService";
import { toast } from "react-hot-toast";
import { X, User, Mail, Lock, Shield } from "lucide-react";

export const UserFormModal = ({ userToEdit, onClose, onSuccess }) => {
  const isEdit = !!userToEdit;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "user", // Default role
  });

  // Load data jika Edit Mode
  useEffect(() => {
    if (isEdit && userToEdit) {
      setFormData({
        full_name: userToEdit.full_name || "",
        email: userToEdit.email || "",
        password: "",
        role: userToEdit.role || "user",
      });
    }
  }, [userToEdit, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        // Mode Edit
        const payload = {
          full_name: formData.full_name,
          role: formData.role,
        };
        await userService.updateUser(userToEdit.id, payload);
        toast.success("Data user diperbarui!");
      } else {
        // Mode Create
        await userService.createUser(formData);
        toast.success("User baru berhasil dibuat!");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Gagal menyimpan data";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Content */}
      <div className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-2xl flex flex-col overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800 text-lg">
            {isEdit ? "Edit User" : "Tambah User Baru"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nama Lengkap */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Nama Lengkap
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#026DA7] outline-none transition-all text-sm"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Email
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isEdit}
                className={`w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#026DA7] outline-none transition-all text-sm ${
                  isEdit ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                }`}
                placeholder="email@example.com"
              />
            </div>
          </div>

          {/* Password (Hanya muncul saat Create) */}
          {!isEdit && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#026DA7] outline-none transition-all text-sm"
                  placeholder="Min. 6 karakter"
                />
              </div>
            </div>
          )}

          {/* Role Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Role / Peran
            </label>
            <div className="relative">
              <Shield
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#026DA7] outline-none transition-all text-sm bg-white appearance-none"
              >
                <option value="user">User Biasa</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#026DA7] text-white font-bold rounded-xl hover:bg-[#025a8a] transition-all text-sm shadow-md mt-4 disabled:opacity-70"
          >
            {loading
              ? "Memproses..."
              : isEdit
              ? "Simpan Perubahan"
              : "Buat User Baru"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};
