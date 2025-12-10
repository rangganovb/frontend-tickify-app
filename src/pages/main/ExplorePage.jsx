import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { EventCard } from "../../components/features/EventCard";
import { eventService } from "../../services/eventServices";
import {
  Filter,
  SlidersHorizontal,
  ChevronDown,
  X,
  Search,
} from "lucide-react";

export default function ExplorePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // --- STATE ---
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATE BARU: LAZY LOADING ---
  const [visibleLimit, setVisibleLimit] = useState(8);

  // UI Controls
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSort] = useState(false);

  // Filter Values
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    category: "",
    minPrice: "",
    date: "",
  });
  const [sortOption, setSortOption] = useState("newest");

  const hasActiveFilters =
    filters.search !== "" ||
    filters.location !== "" ||
    filters.category !== "" ||
    filters.minPrice !== "" ||
    filters.date !== "";

  // --- 1. INITIAL SETUP ---
  useEffect(() => {
    const searchParam = searchParams.get("q");
    const catParam = searchParams.get("category");

    setFilters((prev) => ({
      ...prev,
      search: searchParam || "",
      category: catParam || "",
    }));

    if (catParam) setIsFilterOpen(true);
  }, [searchParams]);

  // --- 2. FETCHING DATA ---
  useEffect(() => {
    const fetchFilteredData = async () => {
      setLoading(true);

      const payload = {
        ...filters,
        sortBy: sortOption,
      };

      try {
        const data = await eventService.getEvents(payload);
        setEvents(data);

        // RESET LAZY LOAD SAAT FILTER BERUBAH
        // Setiap kali user cari/filter baru, kembalikan tampilan ke 8 kartu awal
        setVisibleLimit(8);
      } catch (error) {
        console.error("Gagal fetch events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchFilteredData();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters, sortOption]);

  const clearFilters = () => {
    setFilters({
      search: "",
      location: "",
      category: "",
      minPrice: "",
      date: "",
    });
    setSortOption("newest");
    navigate("/explore", { replace: true });
  };

  // --- FUNGSI LOAD MORE ---
  const handleLoadMore = () => {
    // Tambah 8 kartu lagi setiap diklik
    setVisibleLimit((prev) => prev + 8);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-20">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="font-['Poppins'] font-bold text-3xl md:text-4xl text-[#1D3A6B] mb-2">
            {filters.search
              ? `Hasil Pencarian: "${filters.search}"`
              : "Jelajahi Event Seru"}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {filters.search
              ? `Menampilkan event yang cocok dengan "${filters.search}"`
              : "Temukan berbagai event menarik mulai dari konser musik hingga workshop edukatif."}
          </p>
        </div>

        {/* --- CONTROL BAR --- */}
        <div className="flex flex-row justify-between items-center gap-3 mb-8 bg-transparent">
          {/* GROUP KIRI */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
                isFilterOpen
                  ? "bg-[#026DA7] text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Filter size={18} />
              <span>Filter Event</span>
              {isFilterOpen ? (
                <X size={16} className="ml-1 opacity-70" />
              ) : (
                <ChevronDown size={16} className="ml-1 opacity-70" />
              )}
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          {/* GROUP KANAN */}
          <div className="relative">
            <button
              onClick={() => setIsSort(!isSortOpen)}
              className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} />
                <span className="text-sm hidden md:block whitespace-nowrap">
                  {sortOption === "newest" && "Paling Baru"}
                  {sortOption === "lowPrice" && "Harga Terendah"}
                  {sortOption === "highPrice" && "Harga Tertinggi"}
                </span>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
            {isSortOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-[60] overflow-hidden animate-fade-in origin-top-right">
                {[
                  { val: "newest", label: "Paling Baru" },
                  { val: "lowPrice", label: "Harga Terendah" },
                  { val: "highPrice", label: "Harga Tertinggi" },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => {
                      setSortOption(opt.val);
                      setIsSort(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 ${
                      sortOption === opt.val
                        ? "text-[#026DA7] font-bold bg-blue-50/50"
                        : "text-gray-600"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* --- FILTER PANEL --- */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isFilterOpen
              ? "max-h-[600px] opacity-100 mb-10"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Lokasi */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Lokasi
                </label>
                <input
                  type="text"
                  placeholder="Jakarta..."
                  className="w-full p-2 border-b border-gray-200 focus:border-[#026DA7] outline-none text-sm transition-colors"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters({ ...filters, location: e.target.value })
                  }
                />
              </div>
              {/* Kategori */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Kategori
                </label>
                <select
                  className="w-full p-2 border-b border-gray-200 focus:border-[#026DA7] outline-none text-sm bg-transparent cursor-pointer"
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                >
                  <option value="">Semua</option>
                  <option value="music">Musik</option>
                  <option value="exhibition">Pameran</option>
                  <option value="theater">Teater</option>
                  <option value="talkshow">Talkshow</option>
                  <option value="sports">Olahraga</option>
                  <option value="workshop">Workshop</option>
                  <option value="competition">Kompetisi</option>
                </select>
              </div>
              {/* Waktu */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Waktu
                </label>
                <select
                  className="w-full p-2 border-b border-gray-200 focus:border-[#026DA7] outline-none text-sm bg-transparent cursor-pointer"
                  value={filters.date}
                  onChange={(e) =>
                    setFilters({ ...filters, date: e.target.value })
                  }
                >
                  <option value="">Semua Waktu</option>
                  <option value="today">Hari Ini</option>
                  <option value="this_week">Minggu Ini</option>
                  <option value="next_week">Minggu Depan</option>
                  <option value="this_month">Bulan Ini</option>
                  <option value="next_month">Bulan Depan</option>
                </select>
              </div>
              {/* Max Harga */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Max Harga
                </label>
                <input
                  type="number"
                  placeholder="Rp..."
                  className="w-full p-2 border-b border-gray-200 focus:border-[#026DA7] outline-none text-sm [appearance:textfield]"
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, minPrice: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* EVENT GRID */}
        {loading ? (
          <div className="text-center py-20 text-gray-400 animate-pulse">
            Memuat Event...
          </div>
        ) : events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch animate-fade-in-up">
              {events.slice(0, visibleLimit).map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>

            {/* TOMBOL LOAD MORE*/}
            {visibleLimit < events.length && (
              <div className="mt-12 flex flex-col items-center">
                <div className="w-full max-w-xs border-t border-gray-100 mb-8"></div>

                <button
                  onClick={handleLoadMore}
                  className="px-10 py-3 rounded-full border border-gray-300 text-gray-600 text-sm font-medium hover:border-[#026DA7] hover:text-[#026DA7] hover:bg-blue-50/50 transition-all duration-300 tracking-wide"
                >
                  Tampilkan Lebih Banyak
                </button>

                <p className="text-[11px] text-gray-400 mt-4 tracking-wide">
                  Menampilkan {Math.min(visibleLimit, events.length)} dari{" "}
                  {events.length} event
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Search size={40} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              {filters.search
                ? `"${filters.search}" tidak ditemukan`
                : "Tidak ada event ditemukan"}
            </h3>
            <p className="text-gray-500 text-sm mt-2">
              Coba kata kunci lain atau reset filter kamu.
            </p>
            <button
              onClick={clearFilters}
              className="mt-6 px-6 py-2 bg-[#026DA7] text-white rounded-full font-medium hover:bg-[#025a8a] transition-colors"
            >
              Lihat Semua Event
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
