import { useNavigate } from "react-router-dom";
import { Logo } from "../../components/common/logo";
import { Search, ShieldCheck, CreditCard, Calendar } from "lucide-react";
import { EventCard } from "../../components/features/EventCard";
import { Footer } from "../../components/layout/Footer";

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Search,
      title: "Mudah Dicari",
      description:
        "Temukan event favorit Anda dengan mudah melalui pencarian dan filter yang canggih.",
    },
    {
      icon: CreditCard,
      title: "Pembelian Cepat",
      description:
        "Proses pembelian tiket yang mudah dan cepat dengan berbagai metode pembayaran.",
    },
    {
      icon: ShieldCheck,
      title: "Aman & Terpercaya",
      description:
        "Keamanan data dan transaksi Anda adalah prioritas utama kami.",
    },
    {
      icon: Calendar,
      title: "Beragam Pilihan Event",
      description:
        "Ribuan event dari berbagai kategori menanti untuk Anda jelajahi.",
    },
  ];

  // DATA DUMMY
  const featuredEvents = [
    {
      id: "buzz-youth-fest-4",
      image:
        "https://images.unsplash.com/photo-1559060680-36abfac01944?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3V0aCUyMGZlc3RpdmFsJTIwY29uY2VydHxlbnwxfHx8fDE3NjQ4NTUyNTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Buzz Youth Fest #4",
      date: "2025-12-14",
      price: 380000,
      organizer: "VGC Entertainment",
    },
    {
      id: "ruang-bersuara",
      image:
        "https://images.unsplash.com/photo-1690013429722-87852aae164b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwc3RhZ2UlMjBsaWdodHN8ZW58MXx8fHwxNzY0ODQ2Mzk5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Ruang Bersuara Fest",
      date: "2025-12-20",
      price: 340000,
      organizer: "VGC Entertainment",
    },
    {
      id: "saemenfest",
      image:
        "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGZlc3RpdmFsJTIwY29uY2VydHxlbnwxfHx8fHwxNzY0NzgzMTAyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Saemenfest 2025",
      date: "2025-12-24",
      price: 175000,
      organizer: "VGC Entertainment",
    },
    {
      id: "utifest",
      image:
        "https://images.unsplash.com/photo-1503095396549-807759245b35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdGVyJTIwcGVyZm9ybWFuY2V8ZW58MXx8fHwxNzY0ODAzNjI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Utifest 2025",
      date: "2025-12-28",
      price: 610000,
      organizer: "VGC Entertainment",
    },
  ];

  const stats = [
    { value: "1,000+", label: "User Terdaftar" },
    { value: "50,000+", label: "Transaksi Sukses" },
    { value: "100,000+", label: "Tiket Terjual" },
    { value: "50+", label: "Kota di Indonesia" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[80px]">
            {/* Logo */}
            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <Logo variant="white" size="sm" />
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 font-['Poppins'] text-[13px] text-white hover:text-[#96d8e8] transition-colors"
              >
                Masuk
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-6 py-2 bg-white text-[#026da7] font-['Poppins'] text-[13px] rounded-[6px] hover:bg-white/90 transition-colors shadow-lg"
              >
                Daftar
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative overflow-hidden min-h-[700px] flex items-center"
        id="home"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1610900603480-c0a85ac8e315?q=80&w=1963&auto=format&fit=crop)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#026da7]/90 via-[#1197c7]/85 to-[#5eb3d6]/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
          <div className="text-center">
            <div className="inline-flex items-center px-5 py-2 bg-white/20 backdrop-blur-md rounded-full mb-8 border border-white/30 shadow-lg">
              <span className="font-['Poppins'] text-[13px] text-white font-medium">
                Reach Your Dream Event!
              </span>
            </div>

            <h1 className="font-['Poppins'] font-bold text-[48px] md:text-[56px] text-white leading-tight mb-6 max-w-4xl mx-auto drop-shadow-lg">
              Temukan Event Impian Anda di Tickify!
            </h1>

            <p className="font-['Poppins'] text-[16px] text-white mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Tickify adalah platform yang menyediakan penjualan tiket event
              online secara luas yang digunakan di berbagai negara
            </p>

            <button
              onClick={() => navigate("/register")}
              className="px-10 py-3.5 bg-white text-[#026da7] font-['Poppins'] font-semibold text-[15px] rounded-[8px] hover:bg-white/95 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Mulai Sekarang
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Tickify Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-['Poppins'] font-bold text-[38px] text-black mb-4">
              Mengapa Memilih Tickify?
            </h2>
            <p className="font-['Poppins'] text-[14px] text-[#707070] max-w-2xl mx-auto">
              Platform terbaik untuk menemukan dan membeli tiket event dengan
              pengalaman yang menyenangkan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#96d8e8] rounded-full mx-auto mb-6 flex items-center justify-center">
                  <feature.icon size={32} className="text-[#026da7]" />
                </div>
                <h3 className="font-['Poppins'] font-medium text-[16px] text-black mb-3">
                  {feature.title}
                </h3>
                <p className="font-['Poppins'] text-[13px] text-[#707070] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex justify-between items-end mb-10">
          <h2 className="font-['Poppins'] font-bold text-[28px] md:text-[32px] text-[#1D3A6B]">
            Event Terdekat
          </h2>
          <button
            onClick={() => navigate("/login")}
            className="text-[#026DA7] font-semibold text-sm hover:underline"
          >
            Lihat Lainnya
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#026da7] to-[#1197c7] rounded-[20px] md:rounded-[30px] py-12 px-5 md:py-16 md:px-12 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-24 h-24 md:w-32 md:h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl"></div>

            {/* Title Section */}
            <div className="text-center mb-8 md:mb-12 relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full mb-4 md:mb-6 backdrop-blur-sm">
                <ShieldCheck className="text-white w-6 h-6 md:w-8 md:h-8" />
              </div>

              <h2 className="font-['Poppins'] font-bold text-[22px] md:text-[32px] text-white mb-3 md:mb-4 leading-snug">
                Dipercaya Oleh Ribuan Pengguna
              </h2>
              <p className="font-['Poppins'] text-[13px] md:text-[14px] text-white/80 max-w-2xl mx-auto leading-relaxed">
                Platform ticketing terpercaya dengan track record yang terbukti
                melayani ribuan transaksi setiap harinya
              </p>
            </div>

            {/* Stats Grid */}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 relative z-10">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 text-center hover:bg-white/20 transition-all hover:-translate-y-1"
                >
                  <h3 className="font-['Poppins'] font-bold text-[24px] md:text-[36px] text-white mb-1">
                    {stat.value}
                  </h3>

                  <p className="font-['Poppins'] text-[11px] md:text-[13px] font-medium text-white/90 leading-tight">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
