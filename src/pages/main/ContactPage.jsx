import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { MapPin, Mail, Phone, Clock, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulasi loading kirim pesan
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success(
      "Pesan berhasil dikirim! Tim kami akan segera menghubungi Anda."
    );
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 flex flex-col font-['Poppins']">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-24">
        {/* LAYOUT GRID: KIRI (Info) & KANAN (Form) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* --- BAGIAN KIRI: Teks & Info Kontak --- */}
          <div className="space-y-8 animate-fade-in-left lg:pt-8">
            <div>
              <h1 className="font-bold text-3xl md:text-4xl text-[#1D3A6B] mb-6">
                Hubungi Kami
              </h1>
              <p className="text-gray-600 leading-relaxed text-[15px]">
                Jika Anda memiliki pertanyaan seputar kerja sama atau mengalami
                kendala terkait tiket, silakan hubungi kami melalui kontak yang
                tersedia.
              </p>
              <p className="text-gray-600 leading-relaxed text-[15px] mt-4">
                Tim kami siap membantu Anda sebaik mungkin.
              </p>
            </div>

            {/* List Kontak */}
            <div className="space-y-5">
              {/* Alamat */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#026DA7] shrink-0 mt-1">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm mb-1">
                    Alamat Kantor
                  </h3>
                  <p className="text-sm text-gray-600 leading-snug">
                    Jl. Ahmad Yani No.16-18, Wonokromo, Kec. Wonokromo, <br />
                    Surabaya, Jawa Timur 60243
                  </p>
                </div>
              </div>

              {/* Telepon */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#026DA7] shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm mb-1">
                    Telepon / WhatsApp
                  </h3>
                  <a
                    href="https://wa.me/6287744650477"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-[#026DA7] hover:underline font-medium"
                  >
                    +62 877 4465 0477
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#026DA7] shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm mb-1">
                    Email
                  </h3>
                  <a
                    href="mailto:cs@tickify.co.id"
                    className="text-sm text-[#026DA7] hover:underline font-medium"
                  >
                    cs@tickify.co.id
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* --- BAGIAN KANAN: Form Pesan (Card Putih) --- */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-gray-100 animate-fade-in-right">
            <h3 className="font-bold text-xl text-[#1D3A6B] mb-2">
              Terhubung dengan kami
            </h3>
            <p className="text-gray-400 text-sm mb-8">
              Hubungi kami kapan saja
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nama */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Masukkan Nama Lengkap Anda"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#026DA7] focus:ring-1 focus:ring-[#026DA7] outline-none text-sm transition-all placeholder:text-gray-300"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Masukkan Email Anda"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#026DA7] focus:ring-1 focus:ring-[#026DA7] outline-none text-sm transition-all placeholder:text-gray-300"
                />
              </div>

              {/* Subject (Dropdown) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Subject <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#026DA7] focus:ring-1 focus:ring-[#026DA7] outline-none text-sm transition-all text-gray-600 appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Pilih Subject
                    </option>
                    <option value="support">Kendala Tiket</option>
                    <option value="partnership">Kerjasama Event</option>
                    <option value="feedback">Kritik & Saran</option>
                    <option value="other">Lainnya</option>
                  </select>
                  {/* Custom Chevron Icon */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg
                      width="12"
                      height="8"
                      viewBox="0 0 12 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 1.5L6 6.5L11 1.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Pesan */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Pesan
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Masukkan Pesan Anda"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#026DA7] focus:ring-1 focus:ring-[#026DA7] outline-none text-sm transition-all resize-none placeholder:text-gray-300"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#1197C7] hover:bg-[#026DA7] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
