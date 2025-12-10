import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { Logo } from "../common/logo";
import {
  Search,
  Bell,
  X,
  Home,
  Compass,
  Info,
  Phone,
  LogIn,
  UserPlus,
} from "lucide-react";
// Pastikan path ini benar
import { userService } from "../../services/userService";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // --- 1. UBAH JADI STATE (Agar Reaktif) ---
  // Kita tidak lagi membaca localStorage langsung di body component
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // --- 2. LOGIC SINKRONISASI DATA (REVISED / BARU) ---
  useEffect(() => {
    // A. Fungsi Baca LocalStorage (Biar tampil instan dulu saat load)
    const loadFromStorage = () => {
      const token = localStorage.getItem("token");
      const userString = localStorage.getItem("user");

      setIsLoggedIn(!!token);
      if (userString) {
        setUserData(JSON.parse(userString));
      } else {
        setUserData(null);
      }
    };

    // B. Fungsi Fetch Data Terbaru dari API (Self-Healing / Background Check)
    // Ini jurus rahasia biar foto profil muncul walau data login awal gak lengkap
    const fetchLatestUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return; // Gak perlu fetch kalau gak login

      try {
        const response = await userService.getProfile();
        // Handle struktur response be: { user: {...} } atau langsung {...}
        const freshUser = response.user || response;

        // Simpan data terbaru (yang ada fotonya) ke Storage
        localStorage.setItem("user", JSON.stringify(freshUser));

        // Update State Navbar agar foto langsung muncul
        setUserData(freshUser);
      } catch (error) {
        console.error("Silent refresh profil gagal", error);
        // Kalau token expired (401), sekalian logoutin otomatis (opsional tapi aman)
        if (error.response?.status === 401) {
          localStorage.clear();
          setIsLoggedIn(false);
          setUserData(null);
          navigate("/login");
        }
      }
    };

    // --- EKSEKUSI ---

    // 1. Load data storage saat pertama mount (Instan)
    loadFromStorage();

    // 2. Fetch data terbaru di background (PENTING BUAT MUNCULIN FOTO)
    fetchLatestUser();

    // 3. Event Listener (Supaya tetap reaktif kalau diedit di ProfilePage atau Login)
    const handleUserUpdate = () => loadFromStorage();
    window.addEventListener("userUpdated", handleUserUpdate);
    window.addEventListener("storage", handleUserUpdate);

    return () => {
      window.removeEventListener("userUpdated", handleUserUpdate);
      window.removeEventListener("storage", handleUserUpdate);
    };
  }, [navigate]);

  // --- Logic Avatar (Menggunakan State userData) ---
  const userAvatar =
    userData?.avatar ||
    userData?.profile_picture_url || // Jaga-jaga nama field beda
    `https://ui-avatars.com/api/?name=${
      userData?.full_name || "User"
    }&background=random`;

  const navItems = [
    { label: "Beranda", path: "/home", icon: Home },
    { label: "Jelajah", path: "/explore", icon: Compass },
    { label: "Tentang", path: "/about", icon: Info },
    { label: "Kontak", path: "/contact", icon: Phone },
  ];

  const isActive = (path) => location.pathname === path;

  // Efek scroll lock saat search open
  useEffect(() => {
    if (isSearchOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isSearchOpen]);

  return (
    <>
      {/* TOP NAVBAR (DESKTOP) */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-[#026DA7] shadow-lg h-[70px] md:h-[88px] flex items-center transition-all">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-full">
            {/* KIRI: Logo */}
            <div
              className="flex-shrink-0 z-20 hover:opacity-90 transition-opacity cursor-pointer"
              onClick={() => navigate(isLoggedIn ? "/home" : "/")}
            >
              <div className="scale-90 md:scale-100 origin-left">
                <Logo variant="white" size="sm" />
              </div>
            </div>

            {/* TENGAH: Menu Navigasi Desktop */}
            <div
              className={`hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 transition-opacity duration-300 ${
                isSearchOpen ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full p-1.5 shadow-inner">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`px-6 py-2.5 rounded-full font-['Poppins'] text-[14px] font-medium transition-all duration-300 ${
                      isActive(item.path)
                        ? "bg-[#014063] text-white shadow-md transform scale-105"
                        : "text-white/90 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* KANAN: Kondisional (Login vs Guest) */}
            <div className="flex items-center gap-3 md:gap-4 z-20">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 md:p-2.5 rounded-full text-white/90 hover:bg-white/10 hover:text-white transition-all"
              >
                <Search size={20} className="md:w-[22px] md:h-[22px]" />
              </button>

              {/* SMART LOGIN STATUS */}
              {isLoggedIn ? (
                // --- TAMPILAN SUDAH LOGIN (Avatar) ---
                <div
                  className="flex items-center gap-3 cursor-pointer pl-1 group"
                  onClick={() => navigate("/profile")}
                >
                  <img
                    src={userAvatar}
                    alt="Profile"
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover border-2 border-white/20 group-hover:border-white transition-all"
                  />
                </div>
              ) : (
                // --- TAMPILAN BELUM LOGIN (Tombol Masuk/Daftar) ---
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate("/login")}
                    className="hidden sm:flex px-5 py-2.5 text-white font-medium text-sm hover:text-blue-100 transition-colors"
                  >
                    Masuk
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="px-5 py-2.5 bg-white text-[#026DA7] rounded-full font-bold text-sm shadow-md hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center gap-2"
                  >
                    Daftar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* BOTTOM NAV (MOBILE) */}
      {createPortal(
        <div className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[9999] w-auto max-w-[90%]">
          <div className="flex items-center gap-2 bg-[#026DA7]/90 backdrop-blur-md border border-white/10 rounded-full p-2 shadow-2xl ring-1 ring-white/20">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center justify-center rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] whitespace-nowrap overflow-hidden ${
                    active
                      ? "bg-white text-[#026DA7] px-5 py-3 gap-2 max-w-[140px]"
                      : "text-white/70 hover:text-white hover:bg-white/10 w-11 h-11"
                  }`}
                >
                  <Icon
                    size={active ? 20 : 22}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  <span
                    className={`font-['Poppins'] text-[13px] font-semibold transition-all duration-300 ${
                      active
                        ? "opacity-100 translate-x-0 w-auto"
                        : "opacity-0 -translate-x-2 w-0 hidden"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )}

      {/* SEARCH OVERLAY */}
      {isSearchOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-24 md:pt-32 px-4 animate-fade-in">
            <div
              className="absolute inset-0 bg-[#026DA7]/90 backdrop-blur-md"
              onClick={() => setIsSearchOpen(false)}
            ></div>
            <div className="relative w-full max-w-3xl z-10 animate-slide-down">
              <div className="bg-white rounded-2xl shadow-2xl flex items-center p-3 md:p-4 gap-3 md:gap-4">
                <Search size={20} className="text-gray-400 ml-2" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Cari event..."
                  className="flex-1 bg-transparent border-none outline-none text-[16px] md:text-[18px] text-gray-800 h-10 md:h-12 font-['Poppins']"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setIsSearchOpen(false);
                      navigate(`/explore?q=${e.target.value}`);
                    }
                  }}
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
