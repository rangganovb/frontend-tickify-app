import bgAuth from "../../assets/images/bg-loading-tickify.jpeg";
import { Logo } from "../common/logo";
import { useNavigate } from "react-router-dom";

export const AuthLayout = ({ children, title, subtitle }) => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgAuth})` }}
    >
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[480px] p-8 md:p-10 relative overflow-hidden">
        <div
          className="mb-8 w-fit cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate("/")}
        >
          <Logo size="md" />
        </div>

        <div className="mb-8">
          <h1 className="font-['Poppins'] font-bold text-[28px] text-[#1D3A6B] mb-2">
            {title}
          </h1>
          <p className="font-['Poppins'] text-[14px] text-[#707070]">
            {subtitle}
          </p>
        </div>

        {children}
      </div>
    </div>
  );
};
