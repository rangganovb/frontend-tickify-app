import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/auth/LandingPage";
import SplashScreen from "./components/common/SplashScreen";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "./pages/main/HomePages";
import ExplorePage from "./pages/main/ExplorePage";
import ProfilePage from "./pages/user/UserProfilePage";
import AboutPage from "./pages/main/AboutPage";
import ContactPage from "./pages/main/ContactPage";
import EventDetailPage from "./pages/main/EventDetailPage";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <BrowserRouter>
      {/* 1. Global Toaster */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#1D3A6B",
            fontWeight: "500",
            fontSize: "13px",
            padding: "10px 20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            border: "1px solid #E5E7EB",
            maxWidth: "90vw",
          },
          success: {
            iconTheme: { primary: "#026DA7", secondary: "#E0F2FE" },
          },
          error: {
            iconTheme: { primary: "#EF4444", secondary: "#FEF2F2" },
          },
        }}
      />

      {/* 2. Splash Screen Logic */}
      {isLoading && <SplashScreen onFinish={() => setIsLoading(false)} />}

      {/* 3. Main Content Wrapper */}
      <div
        className={`transition-all duration-1000 ease-out ${
          isLoading
            ? "opacity-0 scale-105 blur-sm overflow-hidden h-screen"
            : "opacity-100 scale-100 blur-0"
        }`}
      >
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Main Pages */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/event/:id" element={<EventDetailPage />} />

          {/* ROUTE KONTAK */}
          <Route path="/contact" element={<ContactPage />} />

          {/* User Pages */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* ... (Placeholder / 404) ... */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
