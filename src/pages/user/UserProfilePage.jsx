import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createPortal } from "react-dom";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { userService } from "../../services/userService";
import { eventService } from "../../services/eventServices";
import { orderService } from "../../services/orderService";

// Import Komponen Modular
import { TicketList } from "../../components/features/TicketList";
import { OrderList } from "../../components/features/OrderList";
import { TicketDetailModal } from "../../components/features/TicketDetailModal";
import { OrderDetailModal } from "../../components/features/OrderDetailModal";

import {
  User,
  Ticket,
  Clock,
  LogOut,
  Camera,
  Trash2,
  Lock,
  AlertTriangle,
  X,
} from "lucide-react";

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  // --- 1. STATE MANAGEMENT ---

  const isTicketUrl = location.pathname === "/my-tickets";
  const [activeTab, setActiveTab] = useState(
    isTicketUrl || location.state?.defaultTab === "tickets"
      ? "tickets"
      : "profile"
  );

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [tickets, setTickets] = useState([]);
  const [orders, setOrders] = useState([]);

  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    avatar: null,
    avatar_url: "",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // State Modal (Detail & Konfirmasi)
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // State Modal Konfirmasi Global
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "danger",
    onConfirm: null,
  });

  // --- 2. FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === "profile") {
          const userData = await userService.getProfile();
          const user = userData.user || userData;
          setProfile({
            full_name: user.full_name || "",
            email: user.email || "",
            phone: user.phone_number ? user.phone_number.replace("62", "") : "",
            avatar_url: user.profile_picture_url || "",
            avatar: null,
          });
        } else if (activeTab === "tickets") {
          const data = await eventService.getMyTickets();
          setTickets(Array.isArray(data) ? data : data.tickets || []);
        } else if (activeTab === "history") {
          const data = await orderService.getMyOrders();
          setOrders(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error(error);
        if (activeTab === "profile") toast.error("Gagal memuat profil");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  // --- 3. HANDLERS ---

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return toast.error("Ukuran file maksimal 2MB");
      }
      setProfile({
        ...profile,
        avatar: file,
        avatar_url: URL.createObjectURL(file),
      });
      uploadAvatarImmediately(file);
    }
  };

  const uploadAvatarImmediately = async (file) => {
    setActionLoading("avatar");
    try {
      const response = await userService.updateAvatar(file);
      const newUrl =
        response.profile_picture_url || response.user?.profile_picture_url;

      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...savedUser, avatar: newUrl })
      );
      window.dispatchEvent(new Event("userUpdated"));

      toast.success("Foto profil diperbarui!");
    } catch (error) {
      toast.error("Gagal upload foto");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setActionLoading("profile");

    let cleanPhone = profile.phone.trim();
    if (cleanPhone.startsWith("0")) cleanPhone = cleanPhone.slice(1);
    if (cleanPhone.startsWith("62")) cleanPhone = cleanPhone.slice(2);

    try {
      const payload = {
        full_name: profile.full_name,
        phone_number: `62${cleanPhone}`,
      };

      await userService.updateProfile(payload);

      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...savedUser, full_name: profile.full_name })
      );
      window.dispatchEvent(new Event("userUpdated"));

      toast.success("Profil berhasil diperbarui!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal update profil");
    } finally {
      setActionLoading(null);
    }
  };

  // --- LOGIC HAPUS AVATAR DENGAN MODAL ---

  // 1. Trigger Modal Hapus
  const onDeleteAvatarClick = () => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Foto Profil",
      message: "Foto profil Anda akan dihapus permanen. Apakah Anda yakin?",
      type: "danger",
      onConfirm: processDeleteAvatar, // Hubungkan ke fungsi eksekusi
    });
  };

  // 2. Eksekusi Hapus Avatar (Dipanggil saat klik 'Ya')
  const processDeleteAvatar = async () => {
    closeConfirmModal(); // Tutup modal dulu
    setActionLoading("avatar");
    try {
      await userService.deleteAvatar();
      setProfile((prev) => ({ ...prev, avatar_url: "", avatar: null }));

      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...savedUser, avatar: null })
      );
      window.dispatchEvent(new Event("userUpdated"));

      toast.success("Foto profil dihapus");
    } catch (error) {
      toast.error("Gagal hapus foto");
    } finally {
      setActionLoading(null);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      return toast.error("Konfirmasi password tidak cocok!");
    }

    setActionLoading("password");
    try {
      await userService.changePassword({
        old_password: passwords.oldPassword,
        new_password: passwords.newPassword,
        confirm_new_password: passwords.confirmNewPassword,
      });
      toast.success("Password berhasil diubah!");
      setPasswords({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal ganti password");
    } finally {
      setActionLoading(null);
    }
  };

  // --- LOGIC LOGOUT DENGAN MODAL ---

  // 1. Trigger Modal Logout
  const onLogoutClick = () => {
    setConfirmModal({
      isOpen: true,
      title: "Keluar Akun",
      message: "Apakah Anda yakin ingin keluar dari akun ini?",
      type: "danger",
      onConfirm: processLogout, // Hubungkan ke fungsi eksekusi
    });
  };

  // 2. Eksekusi Logout
  const processLogout = () => {
    localStorage.clear();
    navigate("/login");
    toast.success("Berhasil keluar");
    closeConfirmModal();
  };

  const closeConfirmModal = () =>
    setConfirmModal({ ...confirmModal, isOpen: false });

  const displayAvatar =
    profile.avatar_url ||
    `https://ui-avatars.com/api/?name=${
      profile.full_name || "User"
    }&background=random`;

  if (loading && activeTab === "profile") {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 flex flex-col">
        <Navbar />
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 h-[300px] animate-pulse bg-gray-200"></div>
            </div>
            <div className="lg:col-span-8 xl:col-span-9 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 h-[400px] animate-pulse bg-gray-200"></div>
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
        <div className="block lg:hidden mb-6">
          <h1 className="font-['Poppins'] font-bold text-2xl text-[#1D3A6B]">
            Akun Saya
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* SIDEBAR */}
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
                  {profile.full_name}
                </h3>
                <p className="text-gray-500 text-xs font-medium truncate w-full px-2">
                  {profile.email}
                </p>
              </div>

              <nav className="flex flex-col gap-1">
                {[
                  { id: "profile", label: "Edit Profil", icon: User },
                  { id: "tickets", label: "Tiket Saya", icon: Ticket },
                  { id: "history", label: "Riwayat Transaksi", icon: Clock },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group
                      ${
                        activeTab === item.id
                          ? "bg-[#1197C7]/80 text-[#FFFFFF] font-semibold"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium"
                      }
                    `}
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

                {/* TOMBOL LOGOUT: Menggunakan bg-red-50 secara permanen agar terlihat merah langsung */}
                <button
                  onClick={onLogoutClick}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition-colors font-medium text-sm"
                >
                  <LogOut size={20} />
                  <span>Keluar</span>
                </button>
              </nav>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            {activeTab === "profile" && (
              <>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)] p-6 md:p-10 animate-fade-in">
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
                      className="relative group shrink-0 rounded-full outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#026DA7] transition-all"
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
                        {/* TOMBOL HAPUS FOTO: Menggunakan Modal Konfirmasi Baru */}
                        {profile.avatar_url && (
                          <button
                            onClick={onDeleteAvatarClick}
                            className="px-5 py-2.5 bg-white border border-gray-200 text-red-500 text-sm font-semibold rounded-lg hover:bg-red-50 hover:border-red-100 transition-colors flex items-center gap-2"
                          >
                            <Trash2 size={16} /> Hapus Foto
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 max-w-xs mx-auto sm:mx-0 leading-relaxed">
                        Besar file: maks. 2MB. Format yang diizinkan: JPG, JPEG,
                        PNG.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          name="full_name"
                          value={profile.full_name}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#026DA7] focus:ring-1 focus:ring-[#026DA7] outline-none text-sm transition-all"
                          placeholder="Nama Lengkap Anda"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profile.email}
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
                            type="number"
                            name="phone"
                            value={profile.phone}
                            onChange={handleProfileChange}
                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#026DA7] focus:ring-1 focus:ring-[#026DA7] outline-none text-sm transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="812345678"
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

                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)] p-6 md:p-10 animate-fade-in">
                  <div className="mb-8 pb-4 border-b border-gray-100">
                    <h2 className="font-['Poppins'] font-bold text-xl text-gray-800 flex items-center gap-2">
                      <Lock size={22} className="text-[#026DA7]" />
                      Ganti Password
                    </h2>
                    <p className="text-gray-400 text-sm mt-1 ml-8">
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
                        value={passwords.oldPassword}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            oldPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#026DA7] focus:ring-1 focus:ring-[#026DA7] outline-none text-sm transition-all"
                        placeholder="Masukkan password saat ini"
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
                          value={passwords.newPassword}
                          onChange={(e) =>
                            setPasswords({
                              ...passwords,
                              newPassword: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#026DA7] focus:ring-1 focus:ring-[#026DA7] outline-none text-sm transition-all"
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
                          value={passwords.confirmNewPassword}
                          onChange={(e) =>
                            setPasswords({
                              ...passwords,
                              confirmNewPassword: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#026DA7] focus:ring-1 focus:ring-[#026DA7] outline-none text-sm transition-all"
                          placeholder="Ulangi password baru"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-6 flex justify-end">
                      <button
                        type="submit"
                        disabled={actionLoading === "password"}
                        className="w-full md:w-[220px] py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-900 hover:shadow-lg transition-all text-sm shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {actionLoading === "password"
                          ? "Memproses..."
                          : "Update Password"}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}

            {activeTab === "tickets" && (
              <TicketList
                tickets={tickets}
                loading={loading}
                onSelectTicket={setSelectedTicketId}
              />
            )}

            {activeTab === "history" && (
              <OrderList
                orders={orders}
                loading={loading}
                onSelectOrder={setSelectedOrderId}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />

      {/* --- UTILITIES & MODAL --- */}
      {selectedTicketId && (
        <TicketDetailModal
          ticketId={selectedTicketId}
          onClose={() => setSelectedTicketId(null)}
        />
      )}

      {selectedOrderId && (
        <OrderDetailModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}

      {confirmModal.isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 animate-fade-in">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
              onClick={closeConfirmModal}
            ></div>

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
