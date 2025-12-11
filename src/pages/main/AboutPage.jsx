import { Navbar } from "../../components/layout/Navbar";

import { Footer } from "../../components/layout/Footer";

import LogoWhite from "../../assets/images/Logo-Tickify.png";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-28 flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-20">
        {/* --- SECTION 1: HERO TITLE --- */}

        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="font-['Poppins'] font-semibold text-2xl md:text-3xl text-gray-800">
            Your Professional Ticketing Partner
          </h1>
        </div>

        {/* --- SECTION 2: BLUE BRAND CARD --- */}

        <div className="relative w-full h-[250px] md:h-[320px] rounded-[30px] bg-gradient-to-r from-[#1197c7] to-[#026da7] flex items-center justify-center shadow-xl mb-16 overflow-hidden animate-scale-up group">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 transition-transform duration-700 group-hover:scale-110"></div>

          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 transition-transform duration-700 group-hover:scale-125"></div>

          <div className="flex items-center gap-4 transform group-hover:scale-105 transition-transform duration-500 z-10">
            <img
              src={LogoWhite}
              alt="Tickify White Logo"
              className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-md"
            />

            <span className="font-['Poppins'] font-bold text-4xl md:text-5xl text-white tracking-wide drop-shadow-md">
              Tickify.
            </span>
          </div>
        </div>

        {/* --- SECTION 3: STORY & STATS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-8 space-y-6 text-gray-600 font-['Poppins'] text-sm md:text-[15px] leading-relaxed text-justify animate-fade-in-left">
            <p>
              <span className="font-bold text-[#026DA7]">Tickify</span> adalah
              platform penyedia Ticket Management Service (TMS) yang dirancang
              untuk mendukung berbagai acara dan destinasi wisata yang
              membutuhkan sistem pengelolaan tiket modern.Tickify memberikan
              kemudahan bagi penyelenggara dalam membuat, memasarkan, menjual,
              mendistribusikan, hingga mendapatkan laporan tiket secara mandiri
              melalui teknologi yang praktis dan terpadu.
            </p>

            <p>
              Tickify memiliki tujuan untuk menghadirkan teknologi unggul yang
              memudahkan, memperkuat, dan memuaskan setiap penyelenggara acara
              maupun pengelola lokasi. Mulai dari pendistribusian tiket,
              manajemen akses, hingga penyediaan laporan pra-acara sampai
              selesai, semua dapat dilakukan dengan cepat dan efisien.
            </p>

            <p>
              Didirikan pada tahun 2025, Tickify hadir sebagai solusi modern
              dalam dunia ticketing. Meskipun baru, Tickify dirancang untuk
              tumbuh cepat dan siap berkolaborasi dengan berbagai acara,
              komunitas, dan penyelenggara di seluruh Indonesia. Kini, giliran
              Anda merasakan kemudahan mengelola dan menjual tiket acara Anda
              bersama Tickify!
            </p>
          </div>

          {/* KANAN: Stats */}
          <div className="lg:col-span-4 flex flex-col gap-10 border-t border-gray-200 pt-10 mt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:mt-0 lg:pl-12 items-center lg:items-start text-center lg:text-left animate-fade-in-right">
            {/* Stat Item 1 */}
            <div className="group">
              <h3 className="font-['Poppins'] font-bold text-4xl md:text-5xl text-[#1D3A6B] mb-2 group-hover:text-[#026DA7] transition-colors">
                300,000+
              </h3>
              <p className="text-gray-500 font-['Poppins'] text-sm font-medium tracking-wide">
                Tiket Terjual
              </p>
            </div>

            {/* Stat Item 2 */}
            <div className="group">
              <h3 className="font-['Poppins'] font-bold text-4xl md:text-5xl text-[#1D3A6B] mb-2 group-hover:text-[#026DA7] transition-colors">
                50+
              </h3>
              <p className="text-gray-500 font-['Poppins'] text-sm font-medium tracking-wide">
                Event Diselenggarakan
              </p>
            </div>

            {/* Stat Item 3 */}
            <div className="group">
              <h3 className="font-['Poppins'] font-bold text-4xl md:text-5xl text-[#1D3A6B] mb-2 group-hover:text-[#026DA7] transition-colors">
                30+
              </h3>
              <p className="text-gray-500 font-['Poppins'] text-sm font-medium tracking-wide">
                Kota Terjangkau
              </p>
            </div>
          </div>
        </div>

        {/* --- SECTION 4: GALLERY MASONRY --- */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-auto md:h-[500px] animate-fade-in-up delay-200">
          {/* Gambar 1 (Kiri Tinggi) */}

          <div className="md:col-span-1 h-[300px] md:h-full relative rounded-2xl overflow-hidden group bg-gray-100">
            <img
              src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600&auto=format&fit=crop"
              alt="Atmosphere"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#026DA7]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
              <span className="text-white font-bold font-['Poppins'] tracking-wider">
                Konser Berkualitas
              </span>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-4 md:gap-6 h-full">
            {/* Gambar 2 (Kanan Atas Kiri) */}

            <div className="relative rounded-2xl overflow-hidden group h-[200px] md:h-auto bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1698824554110-7187e3068031?auto=format&fit=crop&q=80&w=1080"
                alt="Production"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-sm font-bold font-['Poppins']">
                  Pentas Seni
                </span>
              </div>
            </div>

            {/* Gambar 3 (Kanan Atas Kanan) */}

            <div className="relative rounded-2xl overflow-hidden group h-[200px] md:h-auto bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1585230699768-a31a4d76e48f?auto=format&fit=crop&q=80&w=1080"
                alt="Vibes"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-sm font-bold font-['Poppins']">
                  Pertunjukan Megah
                </span>
              </div>
            </div>

            {/* Gambar 4 (Kanan Bawah Kiri)*/}

            <div className="relative rounded-2xl overflow-hidden group h-[200px] md:h-auto bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=500&auto=format&fit=crop"
                alt="Komunitas"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-sm font-bold font-['Poppins']">
                  Komunitas
                </span>
              </div>
            </div>

            {/* Gambar 5 (Kanan Bawah Kanan)*/}

            <div className="relative rounded-2xl overflow-hidden group h-[200px] md:h-auto bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1719299246416-b4c069be9caf?auto=format&fit=crop&q=80&w=1080"
                alt="Olahraga"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-sm font-bold font-['Poppins']">
                  Event Olahraga
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
