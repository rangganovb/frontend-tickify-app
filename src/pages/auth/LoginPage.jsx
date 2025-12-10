import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { InputField } from "../../components/common/InputField";
import api from "../../api/axiosInstance";
import toast from "react-hot-toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Tembak API Login
      const response = await api.post("/auth/login", formData);

      // Ambil Token & User
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // --- OVERRIDE KHUSUS "SELAMAT DATANG" ---
      toast.success(`Selamat datang kembali, ${user.full_name}!`, {
        style: {
          marginTop: "96px",
          background: "#fff",
          color: "#1D3A6B",
          borderRadius: "50px",
          padding: "8px 16px",
          fontSize: "13px",
          fontWeight: "500",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          border: "1px solid #f3f4f6",
        },
        iconTheme: {
          primary: "#026DA7",
          secondary: "#E0F2FE",
        },
      });

      navigate("/home");
    } catch (error) {
      console.error(error);
      const errorMsg =
        error.response?.data?.message || "Email atau Password Salah";

      // --- ERROR MESSAGE ---
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Selamat Datang!"
      subtitle="Silakan masuk untuk melanjutkan ke akun Anda."
    >
      <form onSubmit={handleLogin}>
        <InputField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Masukkan Email Anda"
          required
        />
        <InputField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Masukkan Password Anda"
          required
        />

        <button
          disabled={isLoading}
          className="w-full bg-[#1197C7] hover:bg-[#026DA7] text-white font-['Poppins'] font-semibold py-3 rounded-[8px] transition-colors shadow-md mt-2 disabled:opacity-50"
        >
          {isLoading ? "Memuat..." : "Lanjutkan"}
        </button>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <span className="relative px-4 bg-white font-['Poppins'] text-[12px] text-gray-500 font-medium">
            Atau
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate("/register")}
          className="w-full bg-[#026DA7] hover:bg-[#1D3A6B] text-white font-['Poppins'] font-semibold py-3 rounded-[8px] transition-colors shadow-md"
        >
          Register
        </button>
      </form>
    </AuthLayout>
  );
}
