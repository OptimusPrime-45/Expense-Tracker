import React from "react";
import { useTheme } from "../../context/ThemeContext";

const Card = ({ children, className = "", glow = false, ...props }) => {
  const { isDarkMode } = useTheme();
  const glowClass = glow
    ? "glass-card shadow-glass"
    : "bg-white/80 dark:bg-dark-800/80 backdrop-blur-md border border-gray-200/50 dark:border-neon-green/10";

  return (
    <div
      className={`rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${glowClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
