import logoWhite from "../../assets/images/Logo-Tickify.png";
import logoBlue from "../../assets/images/Logo-Tickify-Blue.png";

export function Logo({ variant = "default", size = "md" }) {
  // Ukuran Text
  const textSizeClasses = {
    sm: "text-[20px]",
    md: "text-[28px]",
    lg: "text-[40px]",
  };

  // Ukuran Gambar
  const imgSizeClasses = {
    sm: "h-[24px]",
    md: "h-[60px]",
    lg: "h-[70px]",
  };

  // Warna Text
  const colorClasses = {
    default: "text-[#026da7]",
    white: "text-white",
  };

  // Logika Pemilihan Gambar Logo
  const logoSrc = variant === "white" ? logoWhite : logoBlue;

  return (
    <div
      className={`flex items-center gap-2 font-['Poppins'] font-bold ${colorClasses[variant]} cursor-pointer`}
    >
      {/* Render Gambar Logo */}
      <img
        src={logoSrc}
        alt="Tickify Logo"
        className={`${imgSizeClasses[size]} object-contain`}
      />

      {/* Render Tulisan */}
      <span className={textSizeClasses[size]}>Tickify.</span>
    </div>
  );
}
