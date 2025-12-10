import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export const InputField = ({ label, type = "text", placeholder, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="mb-5">
      <label className="block font-['Poppins'] font-bold text-[13px] text-black mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className="w-full px-4 py-3 rounded-[8px] border border-[#E0E0E0] font-['Poppins'] text-[14px] focus:outline-none focus:border-[#026DA7] focus:ring-1 focus:ring-[#026DA7] transition-all placeholder:text-[#B0B0B0]"
          placeholder={placeholder}
          {...props}
        />

        {/* Toggle Password Visibility */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#026DA7]"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};
