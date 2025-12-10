import { useNavigate } from "react-router-dom";
import { Logo } from "../common/logo";

export const Footer = () => {
  const navigate = useNavigate();

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
                <button
                  onClick={() => navigate("/about")}
                  className="font-['Poppins'] text-[13px] text-white/70 hover:text-white transition-colors text-left"
                >
                  Tentang Tickify
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/contact")}
                  className="font-['Poppins'] text-[13px] text-white/70 hover:text-white transition-colors text-left"
                >
                  Hubungi Kami
                </button>
              </li>
              <li>
                <button className="font-['Poppins'] text-[13px] text-white/70 hover:text-white transition-colors text-left">
                  Blog & Berita
                </button>
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
                <button className="font-['Poppins'] text-[13px] text-white/70 hover:text-white transition-colors text-left">
                  FAQ
                </button>
              </li>
              <li>
                <button className="font-['Poppins'] text-[13px] text-white/70 hover:text-white transition-colors text-left">
                  Cara Pembelian
                </button>
              </li>
              <li>
                <button className="font-['Poppins'] text-[13px] text-white/70 hover:text-white transition-colors text-left">
                  Kebijakan Refund
                </button>
              </li>
            </ul>
          </div>

          {/* KOLOM 4: Kategori */}
          <div>
            <h4 className="font-['Poppins'] font-bold text-[15px] text-white mb-4">
              Kategori Event
            </h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => navigate("/explore?cat=konser")}
                  className="font-['Poppins'] text-[13px] text-white/70 hover:text-white transition-colors text-left"
                >
                  Konser
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/explore?cat=festival")}
                  className="font-['Poppins'] text-[13px] text-white/70 hover:text-white transition-colors text-left"
                >
                  Festival
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/explore?cat=sports")}
                  className="font-['Poppins'] text-[13px] text-white/70 hover:text-white transition-colors text-left"
                >
                  Olahraga
                </button>
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
