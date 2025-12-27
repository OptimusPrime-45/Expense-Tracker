import React from "react";
import { useTheme } from "../../context/ThemeContext";

const Input = ({
  label,
  error,
  className = "",
  type = "text",
  id,
  ...props
}) => {
  const { isDarkMode } = useTheme();
  const inputClasses = `mt-1 block w-full rounded-lg border-2 ${
    error
      ? "border-red-500/50 focus:ring-red-500 focus:border-red-500"
      : isDarkMode
      ? "border-neon-green/20 focus:ring-neon-aqua/50 focus:border-neon-aqua"
      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
  } ${
    isDarkMode ? "bg-dark-700/30 text-white" : "bg-white text-gray-900"
  } backdrop-blur-sm shadow-sm px-4 py-2.5 transition-all duration-300 ${
    isDarkMode ? "placeholder:text-gray-400" : "placeholder:text-gray-500"
  } focus:${isDarkMode ? "bg-dark-700/50 shadow-neon-aqua" : "bg-white"}`;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm font-semibold mb-1 ${
            isDarkMode ? "text-white" : "text-gray-700"
          }`}
        >
          {label}
        </label>
      )}
      <input type={type} id={id} className={inputClasses} {...props} />
      {error && (
        <p className="mt-1.5 text-sm text-red-400 font-medium">{error}</p>
      )}
    </div>
  );
};

export default Input;
