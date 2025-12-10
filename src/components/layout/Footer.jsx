import { Link } from "react-router-dom"; // Ganti useNavigate jadi Link
import { Logo } from "../common/logo";

export const Footer = () => {
  // const navigate = useNavigate(); <-- HAPUS INI

  return (
    <footer className="bg-[#026da7] pt-12 pb-28 md:pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-left">
          {/* KOLOM 1: Logo & Tagline */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-start">
            <Logo variant="white" size="sm" />
            <p className="font-['Poppins'] text-[13px] text-white/70 mt-4 leading-relaxed max-w-xs">
              Your Professional Ticketing Partner
            </p>
          </div>

          {/* KOLOM 2: Tentang Kami */}
          <div>
            <h4 className="font-['Poppins'] font-bold text-[15px] text-white mb-4">
              Tentang Kami
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="font-['Poppins'] text-[13px] text-white/70 hover:text-white transition-colors text-left block"
                >
                  Tentang Tickify
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="font-['Poppins'] text-[13px] text-white/70 hover:text-white transition-colors text-left block"
                >
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="font-['Poppins'] text-[13px] text-white/70 hover:text-white transition-colors text-left block"
                >
                  Blog & Berita
                </Link>
              </li>
            </ul>
          </div>

          {/* KOLOM 3: Informasi */}
          <div>
            <h4 className="font-['Poppins'] font-bold text-[15px] text-white mb-4">
              Informasi
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="#"
                  className="font-['Poppins'] text-[13px] text-white/70 hover:text-white transition-colors text-left block"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="font-['Poppins'] text-[13px] text-white/70 hover:text-white transition-colors text-left block"
                >
                  Cara Pembelian
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="font-['Poppins'] text-[13px] text-white/70 hover:text-white transition-colors text-left block"
                >
                  Kebijakan Refund
                </Link>
              </li>
            </ul>
          </div>

          {/* KOLOM 4: Kategori Event */}
          {/* NOTE: Saya sesuaikan linknya agar nyambung dengan Filter ExplorePage kita */}
          <div>
            <h4 className="font-['Poppins'] font-bold text-[15px] text-white mb-4">
              Kategori Event
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/explore?category=music"
                  className="font-['Poppins'] text-[13px] text-white/70 hover:text-white transition-colors text-left block"
                >
                  Konser
                </Link>
              </li>
              <li>
                <Link
                  to="/explore?category=exhibition"
                  className="font-['Poppins'] text-[13px] text-white/70 hover:text-white transition-colors text-left block"
                >
                  Pameran
                </Link>
              </li>
              <li>
                <Link
                  to="/explore?category=sports"
                  className="font-['Poppins'] text-[13px] text-white/70 hover:text-white transition-colors text-left block"
                >
                  Olahraga
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-white/10 pt-8 text-center md:text-left">
          <p className="font-['Poppins'] text-[13px] text-white/60">
            © 2025 Tickify. Hak Cipta Dilindungi Undang-Undang.
          </p>
        </div>
      </div>
    </footer>
  );
};
