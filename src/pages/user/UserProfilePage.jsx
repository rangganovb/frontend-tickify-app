import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createPortal } from "react-dom"; // Import Portal untuk Modal
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { userService } from "../../services/userService";
import { eventService } from "../../services/eventServices";
import {
  User,
  Ticket,
  Clock,
  LogOut,
  Camera,
  Lock,
  Trash2,
  Calendar,
  AlertTriangle,
  X,
} from "lucide-react";

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // --- STATE UTAMA ---
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // State Navigasi
  const [activeTab, setActiveTab] = useState("profile");
  const [myTickets, setMyTickets] = useState([]);
  const [ticketFilter, setTicketFilter] = useState("active");

  // State Data
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    avatar: "",
  });

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
  });

  const [passData, setPassData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // --- STATE MODAL KONFIRMASI ---
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "danger", // 'danger' (merah) atau 'info' (biru)
    onConfirm: null, // Fungsi yang akan dijalankan saat klik "Ya"
  });

  // --- INITIAL FETCH ---
  useEffect(() => {
    fetchProfile();
    fetchMyTickets();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile();
      const user = response.user || response;
      const safePhone = user.phone_number
        ? user.phone_number.toString().replace(/^62/, "")
        : "";

      setUserData({
        fullName: user.full_name || "",
        email: user.email || "",
        phoneNumber: safePhone,
        avatar: user.profile_picture_url || "",
      });

      setFormData({
        fullName: user.full_name || "",
        phoneNumber: safePhone,
      });
      // Ambil data user lama dari LocalStorage
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      // Gabungkan data lama dengan data baru dari API
      const updatedUser = { ...savedUser, ...user };
      // Simpan balik ke LocalStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      // Trigger agar Navbar me-render ulang foto profilnya
      window.dispatchEvent(new Event("userUpdated"));
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat profil");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyTickets = async () => {
    try {
      const data = await eventService.getMyTickets();
      setMyTickets(data || []);
    } catch (error) {
      console.error("Gagal ambil tiket:", error);
    }
  };

  // --- MODAL HANDLERS ---

  // 1. Trigger Modal Logout
  const onLogoutClick = () => {
    setConfirmModal({
      isOpen: true,
      title: "Keluar Akun",
      message: "Apakah Anda yakin ingin keluar dari akun ini?",
      type: "danger",
      onConfirm: processLogout, // Link ke fungsi asli
    });
  };

  // 2. Trigger Modal Hapus Foto
  const onDeleteAvatarClick = () => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Foto Profil",
      message: "Foto profil Anda akan dihapus permanen. Lanjutkan?",
      type: "danger",
      onConfirm: processDeleteAvatar, // Link ke fungsi asli
    });
  };

  // 3. Helper Tutup Modal
  const closeConfirmModal = () => {
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  // --- LOGIC EKSEKUSI ---

  // A. Proses Logout Sebenarnya
  const processLogout = async () => {
    closeConfirmModal();
    localStorage.clear();
    navigate("/login");
    toast.success("Berhasil keluar");
  };

  // B. Proses Hapus Avatar
  const processDeleteAvatar = async () => {
    closeConfirmModal();
    setActionLoading("avatar");
    try {
      await userService.deleteAvatar();
      setUserData((prev) => ({ ...prev, avatar: "" }));
      toast.success("Foto profil dihapus");
    } catch (error) {
      toast.error("Gagal hapus foto");
    } finally {
      setActionLoading(null);
    }
  };

  // --- HANDLERS LAINNYA (Update Profile, Upload, Password) ---

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setActionLoading("profile");
    let cleanPhone = formData.phoneNumber.trim();
    if (cleanPhone.startsWith("0")) cleanPhone = cleanPhone.slice(1);
    if (cleanPhone.startsWith("62")) cleanPhone = cleanPhone.slice(2);

    try {
      const payload = {
        full_name: formData.fullName,
        phone_number: `62${cleanPhone}`,
      };
      await userService.updateProfile(payload);

      setUserData((prev) => ({
        ...prev,
        fullName: formData.fullName,
        phoneNumber: cleanPhone,
      }));
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...savedUser, full_name: formData.fullName })
      );
      window.dispatchEvent(new Event("userUpdated"));
      toast.success("Profil berhasil diperbarui!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal update profil");
    } finally {
      setActionLoading(null);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = null;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB");
      return;
    }

    setActionLoading("avatar");
    try {
      const response = await userService.updateAvatar(file);
      const newAvatarUrl =
        response.profile_picture_url || response.user?.profile_picture_url;
      setUserData((prev) => ({
        ...prev,
        avatar: newAvatarUrl || URL.createObjectURL(file),
      }));

      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...savedUser, avatar: newAvatarUrl })
      );
      window.dispatchEvent(new Event("userUpdated"));
      toast.success("Foto profil diperbarui!");
    } catch (error) {
      toast.error("Gagal upload foto");
    } finally {
      setActionLoading(null);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmNewPassword) {
      toast.error("Konfirmasi password tidak cocok!");
      return;
    }
    setActionLoading("password");
    try {
      const payload = {
        old_password: passData.oldPassword,
        new_password: passData.newPassword,
        confirm_new_password: passData.confirmNewPassword,
      };
      await userService.changePassword(payload);
      toast.success("Password berhasil diubah!");
      setPassData({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal ganti password");
    } finally {
      setActionLoading(null);
    }
  };

  const displayAvatar =
    userData.avatar ||
    `https://ui-avatars.com/api/?name=${userData.fullName}&background=random`;

  // --- SKELETON UI ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 flex flex-col">
        <Navbar />
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-24">
          <div className="block lg:hidden mb-6">
            <div className="h-8 w-40 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 h-[400px] animate-pulse">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
                <div className="space-y-4">
                  <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
                  <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
                  <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-8 xl:col-span-9 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-10 h-[500px] animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
                <div className="flex gap-6 mb-10">
                  <div className="w-28 h-28 bg-gray-200 rounded-full shrink-0"></div>
                  <div className="space-y-3 pt-4 w-full">
                    <div className="h-10 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-48"></div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                    <div className="h-12 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-24">
        {/* Header Mobile */}
        <div className="block lg:hidden mb-6">
          <h1 className="font-['Poppins'] font-bold text-2xl text-[#1D3A6B]">
            Akun Saya
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* --- SIDEBAR --- */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] sticky top-28 self-start z-10">
              <div className="flex flex-col items-center text-center relative overflow-hidden pb-6 mb-6 border-b border-gray-100">
                <div className="relative mt-2 mb-3">
                  <img
                    src={displayAvatar}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                  />
                </div>
                <h3 className="font-['Poppins'] font-bold text-[#1D3A6B] text-lg truncate w-full px-2">
                  {userData.fullName}
                </h3>
                <p className="text-gray-500 text-xs font-medium truncate w-full px-2">
                  {userData.email}
                </p>
              </div>

              <nav className="flex flex-col gap-1">
                {[
                  { id: "tickets", label: "Tiket Saya", icon: Ticket },
                  { id: "history", label: "Riwayat Transaksi", icon: Clock },
                  { id: "profile", label: "Edit Profil", icon: User },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                      activeTab === item.id
                        ? "bg-[#1197C7]/80 text-[#FFFFFF] font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        size={20}
                        strokeWidth={activeTab === item.id ? 2.5 : 2}
                      />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <span
                      className={`text-xs transition-transform ${
                        activeTab === item.id
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0"
                      }`}
                    >
                      {">"}
                    </span>
                  </button>
                ))}
                <div className="h-px bg-gray-100 my-2 mx-2"></div>
                <button
                  onClick={onLogoutClick}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-medium text-sm"
                >
                  <LogOut size={20} />
                  <span>Keluar</span>
                </button>
              </nav>
            </div>
          </div>

          {/* --- MAIN CONTENT --- */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* TIKET SAYA */}
            {activeTab === "tickets" && (
              <div className="animate-fade-in">
                <div className="mb-6 pb-4 border-b border-gray-100">
                  <h2 className="font-['Poppins'] font-bold text-xl text-[#1D3A6B]">
                    Tiket Saya
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Daftar tiket yang terdaftar dalam akun
                  </p>
                </div>
                <div className="flex gap-8 border-b border-gray-200 mb-6">
                  <button
                    onClick={() => setTicketFilter("active")}
                    className={`pb-3 text-sm font-medium transition-all relative ${
                      ticketFilter === "active"
                        ? "text-[#026DA7] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#026DA7]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Event Aktif
                  </button>
                  <button
                    onClick={() => setTicketFilter("past")}
                    className={`pb-3 text-sm font-medium transition-all relative ${
                      ticketFilter === "past"
                        ? "text-[#026DA7] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#026DA7]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Event Lalu
                  </button>
                </div>
                {myTickets.length > 0 ? (
                  // ... Logic List Tiket ...
                  <div className="text-center py-10 text-gray-400 text-sm">
                    Tidak ada tiket.
                  </div>
                ) : (
                  <div className="text-center py-20 animate-fade-in-up">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                      <Ticket size={40} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-600">
                      Belum ada tiket
                    </h3>
                    <p className="text-gray-400 text-sm mt-1 mb-6">
                      Kamu belum memiliki tiket aktif saat ini.
                    </p>
                    <button
                      onClick={() => navigate("/explore")}
                      className="px-6 py-2.5 bg-[#026DA7] text-white rounded-full font-medium hover:bg-[#025a8a] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      Mulai Jelajah
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* HISTORY */}
            {activeTab === "history" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <h2 className="font-bold text-lg text-gray-600">
                  Riwayat Transaksi
                </h2>
                <p className="text-gray-400 text-sm">
                  Fitur ini akan segera tersedia.
                </p>
              </div>
            )}

            {/* EDIT PROFIL */}
            {activeTab === "profile" && (
              <div className="animate-fade-in space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)] p-6 md:p-10">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                    <div>
                      <h2 className="font-['Poppins'] font-bold text-xl text-[#1D3A6B]">
                        Edit Profil
                      </h2>
                      <p className="text-gray-400 text-sm mt-1">
                        Perbarui foto dan data diri Anda
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="relative group shrink-0 rounded-full outline-none transition-all"
                      type="button"
                    >
                      <div className="w-28 h-28 rounded-full overflow-hidden border-[3px] border-white shadow-lg ring-1 ring-gray-100 relative">
                        <img
                          src={displayAvatar}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                        {actionLoading === "avatar" && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                        {actionLoading !== "avatar" && (
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 cursor-pointer">
                            <Camera
                              size={24}
                              className="text-white drop-shadow-sm"
                            />
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-0 right-0 p-2 bg-[#026DA7] text-white rounded-full shadow-md group-hover:bg-[#025a8a] transition-transform group-hover:scale-105 z-30">
                        <Camera size={16} />
                      </div>
                    </button>
                    <div className="flex flex-col gap-3 text-center sm:text-left pt-2">
                      <div className="flex gap-3 justify-center sm:justify-start">
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                        {userData.avatar && (
                          <button
                            onClick={onDeleteAvatarClick}
                            className="px-5 py-2.5 bg-white border border-gray-200 text-red-500 text-sm font-semibold rounded-lg hover:bg-red-50 hover:border-red-100 transition-colors flex items-center gap-2"
                          >
                            <Trash2 size={16} /> Hapus Foto
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 max-w-xs mx-auto sm:mx-0 leading-relaxed">
                        Besar file: maks. 2MB. Format: JPG, JPEG, PNG.
                      </p>
                    </div>
                  </div>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    {/* Form Fields (Nama, Email, Telp)*/}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fullName: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#026DA7] outline-none text-sm transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Email
                        </label>
                        <input
                          type="email"
                          value={userData.email}
                          disabled
                          className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Nomor Telepon
                        </label>
                        <div className="flex gap-3">
                          <div className="px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium">
                            +62
                          </div>
                          <input
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phoneNumber: e.target.value,
                              })
                            }
                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#026DA7] outline-none text-sm transition-all"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 flex justify-end">
                      <button
                        type="submit"
                        disabled={actionLoading === "profile"}
                        className="w-full md:w-[220px] py-3 bg-[#026DA7] text-white font-bold rounded-lg hover:bg-[#025a8a] transition-all text-sm shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {actionLoading === "profile"
                          ? "Menyimpan..."
                          : "Simpan Perubahan"}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)] p-6 md:p-10">
                  <div className="mb-8 pb-4 border-b border-gray-100">
                    <h2 className="font-['Poppins'] font-bold text-xl text-gray-800">
                      Ganti Password
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                      Pastikan password Anda aman dan kuat
                    </p>
                  </div>
                  <form onSubmit={handleChangePassword} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Password Lama
                      </label>
                      <input
                        type="password"
                        value={passData.oldPassword}
                        onChange={(e) =>
                          setPassData({
                            ...passData,
                            oldPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#026DA7] outline-none text-sm transition-all"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Password Baru
                        </label>
                        <input
                          type="password"
                          value={passData.newPassword}
                          onChange={(e) =>
                            setPassData({
                              ...passData,
                              newPassword: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#026DA7] outline-none text-sm transition-all"
                          placeholder="Min. 8 karakter"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Konfirmasi Password
                        </label>
                        <input
                          type="password"
                          value={passData.confirmNewPassword}
                          onChange={(e) =>
                            setPassData({
                              ...passData,
                              confirmNewPassword: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#026DA7] outline-none text-sm transition-all"
                          required
                        />
                      </div>
                    </div>
                    <div className="pt-6 flex justify-end">
                      <button
                        type="submit"
                        disabled={actionLoading === "password"}
                        className="w-full md:w-[220px] py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-900 transition-all text-sm shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {actionLoading === "password"
                          ? "Memproses..."
                          : "Update Password"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      {/* --- KOMPONEN MODAL --- */}
      {confirmModal.isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 animate-fade-in">
            {/* Backdrop Blur */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
              onClick={closeConfirmModal}
            ></div>

            {/* Content Modal */}
            <div className="bg-white rounded-2xl p-6 md:p-8 max-w-sm w-full relative z-10 shadow-2xl animate-scale-up border border-gray-100">
              <button
                onClick={closeConfirmModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
                    confirmModal.type === "danger"
                      ? "bg-red-50 text-red-500"
                      : "bg-blue-50 text-blue-500"
                  }`}
                >
                  <AlertTriangle size={28} />
                </div>

                <h3 className="font-['Poppins'] font-bold text-xl text-gray-800 mb-2">
                  {confirmModal.title}
                </h3>

                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                  {confirmModal.message}
                </p>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={closeConfirmModal}
                    className="flex-1 py-3 px-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm"
                  >
                    Batal
                  </button>
                  <button
                    onClick={confirmModal.onConfirm}
                    className={`flex-1 py-3 px-4 text-white font-bold rounded-xl shadow-md transition-all text-sm ${
                      confirmModal.type === "danger"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-[#026DA7] hover:bg-[#025a8a]"
                    }`}
                  >
                    Ya, Lanjutkan
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
