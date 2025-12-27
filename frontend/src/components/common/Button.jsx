import React from "react";
import { useTheme } from "../../context/ThemeContext";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  ...props
}) => {
  const { isDarkMode } = useTheme();
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none";

  const variantClasses = {
    primary: isDarkMode
      ? "bg-linear-to-r from-neon-green to-neon-aqua text-white border-2 border-white/80 hover:border-white hover:shadow-neon-green font-semibold btn-glow"
      : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-2 border-blue-600 hover:border-blue-700 hover:shadow-lg font-semibold",
    secondary: isDarkMode
      ? "bg-dark-700/50 border-2 border-white/60 hover:border-white text-white hover:shadow-neon-aqua hover:bg-dark-700/70"
      : "bg-gray-200 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:shadow-lg hover:bg-gray-300",
    danger: isDarkMode
      ? "bg-linear-to-r from-red-500 to-pink-500 text-white border-2 border-white/80 hover:border-white hover:shadow-lg font-semibold"
      : "bg-gradient-to-r from-red-500 to-pink-500 text-white border-2 border-red-600 hover:border-red-700 hover:shadow-lg font-semibold",
    outline: isDarkMode
      ? "border-2 border-white/70 hover:border-white text-white hover:bg-white/10 font-medium"
      : "border-2 border-gray-400 hover:border-gray-600 text-gray-700 hover:bg-gray-100 font-medium",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;
