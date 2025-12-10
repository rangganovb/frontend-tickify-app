import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { InputField } from "../../components/common/InputField";
import api from "../../api/axiosInstance";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // 1. State untuk menampung input user
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    whatsapp: "",
    password: "",
    confirmPassword: "",
  });

  // Handle perubahan input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Fungsi Submit ke API
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validasi sederhana di Frontend
    if (formData.password !== formData.confirmPassword) {
      toast.error("Password tidak sama!");
      setIsLoading(false);
      return;
    }

    try {
      // 3. MAPPING DATA
      const payload = {
        full_name: formData.fullName,
        email: formData.email,
        phone_number: `62${formData.whatsapp}`,
        password: formData.password,
        confirm_password: formData.confirmPassword,
      };

      // Tembak API
      const response = await api.post("/auth/register", payload);

      // 4. Kalau Sukses, Simpan Token
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Registrasi Berhasil! Selamat datang.");
      navigate("/home");
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Registrasi Gagal";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Selamat Datang!"
      subtitle="Silakan buat akun untuk memulai perjalanan Anda."
    >
      <form onSubmit={handleRegister}>
        <InputField
          label="Nama Lengkap"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Masukkan Nama Lengkap Anda"
          required
        />
        <InputField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Masukkan Email Anda"
          required
        />

        {/* Input WhatsApp */}
        <div className="mb-5">
          <label className="block font-['Poppins'] font-bold text-[13px] text-black mb-2">
            Nomor Whatsapp
          </label>
          <div className="flex gap-3">
            <div className="w-[100px] px-3 py-3 rounded-[8px] border border-[#E0E0E0] bg-gray-50 font-['Poppins'] text-[14px] flex items-center justify-center text-gray-600">
              ID +62
            </div>
            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              className="flex-1 px-4 py-3 rounded-[8px] border border-[#E0E0E0] font-['Poppins'] text-[14px] focus:outline-none focus:border-[#026DA7] focus:ring-1 focus:ring-[#026DA7] transition-all placeholder:text-[#B0B0B0]"
              placeholder="81234567890"
              required
            />
          </div>
        </div>

        <InputField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Masukkan Password Anda"
          required
        />
        <InputField
          label="Ulangi Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Masukkan Ulang Password Anda"
          required
        />

        {/* Checkbox Syarat */}
        <div className="flex items-start gap-3 mb-6 mt-6">
          <input
            type="checkbox"
            id="terms"
            required
            className="w-4 h-4 text-[#026DA7]"
          />
          <label
            htmlFor="terms"
            className="font-['Poppins'] text-[12px] text-black leading-snug"
          >
            Saya telah membaca & setuju dengan{" "}
            <span className="font-bold">"Syarat & Ketentuan"</span>
          </label>
        </div>

        <button
          disabled={isLoading}
          className="w-full bg-[#1197C7] hover:bg-[#026DA7] text-white font-['Poppins'] font-semibold py-3 rounded-[8px] transition-colors shadow-md mb-4 disabled:opacity-50"
        >
          {isLoading ? "Memproses..." : "Buat Akun"}
        </button>

        <p className="text-center font-['Poppins'] text-[13px] text-[#707070]">
          Sudah punya akun?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#026DA7] font-bold cursor-pointer hover:underline"
          >
            Masuk
          </span>
        </p>
      </form>
    </AuthLayout>
  );
}
