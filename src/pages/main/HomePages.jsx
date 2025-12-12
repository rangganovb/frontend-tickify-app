import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { HomeCarousel } from "../../components/features/HomeCarousel";
import { HomeCategories } from "../../components/features/HomeCategories";
import { TopMarkotop } from "../../components/features/HomeTopMarkotop";
import { EventCard } from "../../components/features/EventCard";
import { EventCarousel } from "../../components/features/EventCarousel";
import { eventService } from "../../services/eventServices";

export default function HomePage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getEvents();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-28 flex flex-col">
      <Navbar />

      <main className="flex-grow w-full">
        {/* 1. Hero Section */}
        <section className="w-full mb-12">
          <HomeCarousel />
        </section>

        {/* 2. REKOMENDASI EVENT (Carousel + Loop + No Button) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="mb-6">
            <h2 className="font-['Poppins'] font-bold text-[20px] md:text-[24px] text-[#1D3A6B]">
              Rekomendasi Event
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Pilihan event terbaik minggu ini khusus untukmu
            </p>
          </div>

          {loading ? (
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="min-w-[280px] h-[350px] bg-gray-200 rounded-2xl animate-pulse shrink-0"
                ></div>
              ))}
            </div>
          ) : (
            // Kirim data events
            <EventCarousel events={events.slice(0, 8)} />
          )}
        </section>

        {/* 3. TOP MARKOTOP */}
        <section className="bg-gradient-to-b from-[#1197c7] to-[#026da7] py-16 mb-16 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-0 md:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-8 px-4">
              <h2 className="font-['Poppins'] font-bold text-[32px] text-white drop-shadow-md">
                Top Markotop
              </h2>
              <p className="text-white/80 mt-2 font-medium">
                Event paling hits yang wajib kamu datangi!
              </p>
            </div>
            <TopMarkotop events={events} />
          </div>
        </section>

        {/* 4. KATEGORI EVENT */}
        <section className="mb-16">
          <HomeCategories />
        </section>

        {/* 5. EVENT TERDEKAT / TERBARU */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="flex justify-between items-end mb-6">
            <h2 className="font-['Poppins'] font-bold text-[24px] text-[#1D3A6B]">
              Event Terbaru
            </h2>
            <button
              onClick={() => navigate("/explore")}
              className="text-[#026DA7] font-semibold text-sm hover:underline"
            >
              Lihat Lainnya
            </button>
          </div>
          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {/* Tampilkan sisa event */}
              {events.slice(8, 16).map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
