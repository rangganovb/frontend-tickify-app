import React, { useEffect, useState } from "react";
import logoImg from "../../assets/images/Logo-Tickify.png";
import bgSplash from "../../assets/images/bg-loading-tickify.jpeg";

export default function SplashScreen({ onFinish }) {
  const [showLogo, setShowLogo] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // 1. Munculkan Logo setelah 500ms
    const timer1 = setTimeout(() => {
      setShowLogo(true);
    }, 500);

    // 2. Selesai loading setelah 2.5 detik
    const timer2 = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 700); // Waktu transisi fade-out
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  if (fadeOut && !onFinish) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-700 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        backgroundImage: `url(${bgSplash})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className={`flex flex-row items-center gap-4 transition-all duration-1000 transform ${
          showLogo ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <img
          src={logoImg}
          alt="Tickify Logo"
          className="h-16 md:h-20 object-contain"
        />

        <h1 className="font-['Poppins'] font-bold text-4xl text-white tracking-wide">
          Tickify.
        </h1>
      </div>
    </div>
  );
}
