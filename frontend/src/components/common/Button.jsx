import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none";

  const variantClasses = {
    primary:
      "bg-linear-to-r from-neon-green to-neon-aqua text-white dark:text-white border-2 border-white/80 hover:border-white hover:shadow-neon-green font-semibold btn-glow",
    secondary:
      "bg-dark-700/50 dark:bg-dark-700/50 border-2 border-white/60 hover:border-white text-white dark:text-white hover:shadow-neon-aqua hover:bg-dark-700/70",
    danger:
      "bg-linear-to-r from-red-500 to-pink-500 text-white dark:text-white border-2 border-white/80 hover:border-white hover:shadow-lg font-semibold",
    outline:
      "border-2 border-white/70 hover:border-white text-white dark:text-white hover:bg-white/10 font-medium",
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
